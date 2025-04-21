import { useState, useEffect } from "react";
import { MenuItem, Select, CircularProgress } from "@mui/material";
import operationService from "services/operationService";
import { useMessage } from "context/messageContext";

const StatusDropdown = ({ operationId, currentStatus, onUpdate, statuses }) => {
  const [status, setStatus] = useState(currentStatus ?? "");
  const [loading, setLoading] = useState(false);
  const { message, setMessage } = useMessage();

  // 🟢 Načteme seznam statusů z backend

  // 🟢 Pokud se změní `currentStatus`, aktualizujeme `status`
  useEffect(() => {
    if (currentStatus) {
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  // 🟢 Změna statusu
  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setLoading(true);

    try {
      await operationService.updateOperationStatus(operationId, newStatus);
      setStatus(newStatus);
      if (onUpdate) onUpdate(); // Aktualizace seznamu operací
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <CircularProgress size={20} />
  ) : (
    <>
      <Select value={status || ""} onChange={handleChange} size="small">
        {statuses.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default StatusDropdown;
