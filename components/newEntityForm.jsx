"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import TextFieldComponent from "components/textFieldComponent";
import NumberFieldComponent from "components/numberFieldComponent";
import DateFieldComponent from "components/dateFieldComponent";
import { useMessage } from "context/messageContext";

const NewEntityForm = ({
  title,
  fields,
  selectFields = [],
  service,
  redirectPath,
}) => {
  const router = useRouter();
  const { message, setMessage } = useMessage();
  const [loading, setLoading] = useState(false);

  // Inicializace formulářových dat – každý field má výchozí hodnotu ""
  const [formData, setFormData] = useState(
    fields
      .concat(selectFields)
      .reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  // Změna hodnoty libovolného pole
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Odeslání formuláře (vytvoření entity)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await service.create(formData); // Zavolání metody z poskytnutého service
      router.push(redirectPath); // Přesměrování po úspěchu
    } catch (error) {
      setMessage(`Error creating entity: ${error.message}`); // Nastavení chybové zprávy
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 3 }}>
        {title}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Pole formuláře – dle typu komponenty */}
        {fields.map((field) => {
          if (field.type === "number") {
            return (
              <NumberFieldComponent
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={handleChange}
              />
            );
          } else if (field.type === "date") {
            return (
              <DateFieldComponent
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={handleChange}
              />
            );
          } else {
            return (
              <TextFieldComponent
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={handleChange}
              />
            );
          }
        })}

        {/* Select pole – jedno nebo vícenásobné výběry */}
        {selectFields.map((field) => (
          <FormControl key={field.name} fullWidth sx={{ mb: 2 }}>
            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.name}-label`}
              name={field.name}
              multiple={field.multiple}
              value={formData[field.name] ?? (field.multiple ? [] : "")}
              onChange={(e) => {
                const { name, value } = e.target;
                setFormData((prevData) => ({
                  ...prevData,
                  [name]: field.multiple ? value : value || "",
                }));
              }}
              renderValue={(selected) => {
                if (field.multiple) {
                  return Array.isArray(selected) && selected.length > 0
                    ? field.options
                        .filter((option) => selected.includes(option.id))
                        .map((option) => option.name)
                        .join(", ")
                    : "Vyberte...";
                } else {
                  const option = field.options.find(
                    (opt) => opt.id === selected
                  );
                  return option ? option.name : "Vyberte...";
                }
              }}
            >
              {field.options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        {/* Tlačítka pro zrušení a odeslání */}
        <Box display="flex" justifyContent="space-between">
          <Button
            onClick={() => router.push(redirectPath)}
            variant="outlined"
            color="secondary"
          >
            Zpět
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Vytvořit"
            )}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default NewEntityForm;
