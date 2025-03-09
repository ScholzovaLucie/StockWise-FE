"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { fetchCurrentUser, logout } from '/services/authService';
import { getClients } from '/services/clientService';
import { updateUser } from '/services/userSrvices';
import { useRouter } from 'next/navigation'; // Import routeru

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      client_id: [],  // Pole pro více klientů
    });
  
    const router = useRouter();


  const handleLogout = () => {
    logout(); // Zavolej službu pro odhlášení (např. API request)
  };
  
    useEffect(() => {
      const loadUserData = async () => {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setFormData({
            name: currentUser.name,
            email: currentUser.email,
            client_id: currentUser.client_id || [],  // Očekáváme pole ID klientů
          });
        }
      };
  
      const loadClients = async () => {
        const clientList = await getClients(null, true);
        setClients(clientList);
      };
  
      loadUserData();
      loadClients();
    }, []);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: Array.isArray(value) ? value : value, // Zkontrolujeme, jestli je hodnota pole
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await updateUser(user.id, formData);
        alert('Údaje byly úspěšně aktualizovány!');
      } catch (error) {
        alert('Aktualizace se nezdařila.');
      }
    };
  
    const handlePasswordChange = () => {
      router.push('user/change_password');
    };
  
    if (!user) return <Typography>Načítání uživatelských dat...</Typography>;
  
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Uživatelský profil
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Jméno"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Select
            fullWidth
            multiple 
            margin="normal"
            name="client_id"
            value={formData.client_id}
            onChange={(e) => handleChange({ target: { name: 'client_id', value: e.target.value } })}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Vyberte klienty
            </MenuItem>
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
          <Button sx={{ mt: 2 }} type="submit" variant="contained" color="primary" fullWidth>
            Uložit změny
            </Button>
        </form>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handlePasswordChange}
          style={{ marginTop: '1rem' }}
        >
          Změnit heslo
        </Button>
        <Button variant="outlined" color="secondary" fullWidth onClick={handleLogout} style={{ marginTop: '1rem' }}>
          Odhlásit se
        </Button>
      </Container>
    );
  };

  export default UserProfile;