"use client";

import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  IconButton,
  useTheme,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import DownloadIcon from "@mui/icons-material/Download";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import chatbotService from "/services/chatbotService";
import { useClient } from "/context/clientContext";
import { useMessage } from "/context/messageContext";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { selectedClient } = useClient();
  const { setMessage } = useMessage();
  const theme = useTheme();

  useEffect(() => {
    loadChatHistory();
  }, [selectedClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!selectedClient || !chatMessage) return;

    const userMessage = { role: "user", content: chatMessage };
    setMessages((prev) => [...prev, userMessage]);
    setChatMessage("");
    setBotTyping(true);

    try {
      const botResponse = await chatbotService.sendMessage(
        chatMessage,
        selectedClient
      );

      setTimeout(() => {
        setMessages((prev) => [...botResponse]);
        setBotTyping(false);
      });
    } catch (error) {
      setMessage(error.message);
      setBotTyping(false);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const downloadImage = (src, alt) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = alt || "downloaded-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ height: "100%" }}>
      {!selectedClient ? (
        <Typography color="error" sx={{ textAlign: "center" }}>
          Chyba: Není vybrán žádný klient. Vyberte klienta pro pokračování.
        </Typography>
      ) : (
        <Card sx={{ height: "100%", p: 2, boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ height: "90%" }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ChatRoundedIcon fontSize="large" /> Chatbot
            </Typography>

            <Paper
              sx={{
                p: 2,
                mb: 2,
                overflowY: "auto",
                borderRadius: 2,
                height: "90%",
              }}
            >
              {messages.map((msg, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  {msg.element === "img" ? (
                    <Box sx={{ textAlign: "center" }}>
                      <img
                        src={msg.src}
                        alt={msg.alt}
                        style={{ maxWidth: "100%", borderRadius: 5 }}
                      />
                      <IconButton
                        onClick={() => downloadImage(msg.src, msg.alt)}
                        color="primary"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        textAlign:
                          (msg.role === "user") | msg?.class?.includes("user")
                            ? "right"
                            : "left",
                        bgcolor:
                          (msg.role === "user") | msg?.class?.includes("user")
                            ? theme.palette.primary.main
                            : "#e0e0e0",
                        color:
                          (msg.role === "user") | msg?.class?.includes("user")
                            ? "#fff"
                            : "#000",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 1,
                        maxWidth: "80%",
                        ml:
                          (msg.role === "user") | msg?.class?.includes("user")
                            ? "auto"
                            : 0,
                      }}
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </Typography>
                  )}
                </Box>
              ))}

              {botTyping && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: "#e0e0e0",
                    color: "#000",
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "40%",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#757575",
                      borderRadius: "50%",
                      animation: "dotFlashing 1.5s infinite ease-in-out",
                    }}
                  ></span>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#757575",
                      borderRadius: "50%",
                      animation: "dotFlashing 1.5s infinite ease-in-out",
                      animationDelay: "0.2s",
                    }}
                  ></span>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: "#757575",
                      borderRadius: "50%",
                      animation: "dotFlashing 1.5s infinite ease-in-out",
                      animationDelay: "0.4s",
                    }}
                  ></span>
                  <style>
                    {`
                    @keyframes dotFlashing {
                      0% { opacity: 0.2; }
                      50% { opacity: 1; }
                      100% { opacity: 0.2; }
                    }
                  `}
                  </style>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Paper>

            <Box sx={{ alignSelf: "end", justifySelf: "end" }}>
              <TextField
                label="Napište zprávu..."
                variant="outlined"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ width: "90%" }}
              />
              <IconButton color="primary" onClick={sendMessage}>
                <SendRoundedIcon fontSize="large" />
              </IconButton>
              <IconButton color="error" onClick={resetChat}>
                <RestartAltRoundedIcon fontSize="large" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Chatbot;
