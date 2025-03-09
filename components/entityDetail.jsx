"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoadingScreen from "/components/loadingScreen";
import TextFieldComponent from "components/textFieldComponent";
import NumberFieldComponent from "components/numberFieldComponent";
import DateFieldComponent from "components/dateFieldComponent";
import { useMessage } from "/context/messageContext";

const EntityDetail = ({ title, service, fields, selectFields, redirectPath }) => {
  const { id } = useParams();
  const router = useRouter();
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { message, setMessage } = useMessage();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!id) return;

    const loadEntity = async () => {
      setLoading(true);
      try {
        const data = await service.getById(id);
        setEntity(data);
        setFormData(
          fields.concat(selectFields).reduce((acc, field) => {
            acc[field.name] = data[field.name] || "";
            return acc;
          }, {})
        );
        setMessage(null);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadEntity();
  }, [id, fetchUrl, fields, selectFields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Hodnota je nyní pole pro více výběrů
    }));
  };

  const handleSave = async () => {
    try {
      await service.update(id, formData);
      setEntity(formData);
      setIsEditing(false);
      setMessage(null);
    } catch (error) {
      setMessage(error?.message || "Došlo k chybě při ukládání.");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <Container>
      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => router.back()} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      {entity ? (
        <Box>
          {fields.map((field) => {
            if (field.type === "number") {
              return (
                <NumberFieldComponent
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              );
            } else if (field.type === "date") {
              return (
                <DateFieldComponent
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              );
            } else {
              return (
                <TextFieldComponent
                  key={field.name}
                  field={field}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              );
            }
          })}
          {selectFields?.map((select) => (
           <FormControl key={select.name} fullWidth sx={{ mb: 2 }} disabled={!isEditing}>
           <InputLabel id={`${select.name}-label`}>{select.label}</InputLabel>
           <Select
            labelId={`${select.name}-label`}
            name={select.name}
            multiple={select.multiple}
            value={formData[select.name] || (select.multiple ? [] : "")} // Oprava pro single select
            onChange={handleChange}
            renderValue={(selected) => {
              if (select.multiple) {
                return selected
                  .map((value) => {
                    const option = select.options.find((opt) => opt.id === value);
                    return option ? option.name : "";
                  })
                  .join(", ");
              } else {
                const option = select.options.find((opt) => opt.id === selected);
                return option ? option.name : ""; // Oprava pro single select
              }
            }}
            label={select.label}
          >
            {select.options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
         </FormControl>
          ))}
          <Box display="flex" justifyContent="space-between">
            <Button color="primary" onClick={() => setIsEditing(!isEditing)} variant="outlined">
              {isEditing ? "Zrušit" : "Upravit"}
            </Button>
            {isEditing && (
              <Button onClick={handleSave} variant="contained" color="primary">
                Uložit změny
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" color="error">
          Entita nebyla nalezena.
        </Typography>
      )}
    </Container>
  );
};

export default EntityDetail;