"use client";

import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import chatbotService from "/services/chatbotService";
import { useClient } from "/context/clientContext";
import { useMessage } from "/context/messageContext";

const Chatbot = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { selectedClient } = useClient();
  const { setMessage } = useMessage();

  useEffect(() => {
    if (!selectedClient) {
      setMessage("Chyba: Není vybrán žádný klient.");
      return;
    }
    loadChatHistory();
  }, [selectedClient]);

  const loadChatHistory = async () => {
    if (!selectedClient) return;
    try {
      const history = await chatbotService.getHistory(selectedClient);
      setMessages(history);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const sendMessage = async () => {
    if (!selectedClient) {
      setMessage("Chyba: Není vybrán žádný klient.");
      return;
    }
    if (!chatMessage) return;

    const userMessage = { role: "user", content: chatMessage };
    setMessages((prev) => [...prev, userMessage]);
    setChatMessage("");

    try {
      const botResponse = await chatbotService.sendMessage(chatMessage, selectedClient);
      setMessages((prev) => [...prev, ...botResponse]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const resetChat = async () => {
    if (!selectedClient) {
      setMessage("Chyba: Není vybrán žádný klient.");
      return;
    }

    try {
      await chatbotService.resetChat(selectedClient);
      setMessages([]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      {!selectedClient ? (
        <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
          Chyba: Není vybrán žádný klient. Vyberte klienta pro pokračování.
        </Typography>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2, maxHeight: 300, overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <Typography
                key={index}
                sx={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  bgcolor: msg.role === "user" ? "lightblue" : "lightgray",
                  p: 1,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                {msg.role === "user" ? "🧑" : "🤖"} {msg.content}
              </Typography>
            ))}
          </Paper>
          <TextField
            fullWidth
            label="Zadejte zprávu"
            variant="outlined"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            disabled={!selectedClient}
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={sendMessage} disabled={!selectedClient}>
              Odeslat
            </Button>
            <Button variant="outlined" color="error" onClick={resetChat} disabled={!selectedClient}>
              Resetovat chat
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Chatbot;