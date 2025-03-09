"use client";

import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import chatbotService from "/services/chatbotService";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage(null);

    const botResponse = await chatbotService.sendMessage(message);
    const botMessage = { role: "bot", content: botResponse };

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        {messages.map((msg, index) => (
          <Typography key={index} sx={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            {msg.role === "user" ? "🧑" : "🤖"} {msg.content}
          </Typography>
        ))}
      </Paper>
      <TextField
        fullWidth
        label="Zadejte zprávu"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button sx={{ mt: 2 }} variant="contained" onClick={sendMessage}>
        Odeslat
      </Button>
    </Box>
  );
};

export default Chatbot;