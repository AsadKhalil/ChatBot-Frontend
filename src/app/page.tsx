"use client";
import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useRouter } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';

const drawerWidth = 260;

const sidebarItems = [
  { text: "Ask AI", icon: <ChatBubbleOutlineIcon /> },
  { text: "Add New Data", icon: <AddCircleOutlineIcon /> },
  { text: "Manage Data", icon: <ManageAccountsIcon /> },
];

type ChatMessage = { role: "user" | "ai"; content: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [convoId, setConvoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      // Prepare chat_history as array of {prompt, response}
      const formattedHistory = chatHistory.reduce<{prompt: string, response: string}[]>((acc, msg, idx, arr) => {
        if (msg.role === "user") {
          const responseMsg = arr[idx + 1];
          acc.push({ prompt: msg.content, response: responseMsg?.content || "" });
        }
        return acc;
      }, []);
      const res = await axios.post(`${API_URL}/generate`, {
        input,
        chat_history: formattedHistory,
        convo_id: convoId,
      });
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: res.data.response || "No response" },
      ]);
      if (res.data.convo_id) setConvoId(res.data.convo_id);
    } catch (_err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: "Error: Could not get response from server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f6f8fc" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#fff",
            borderRight: "1px solid #e3e6ef",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <img src="/favicon.ico" alt="Insphere Logo" width={32} height={32} style={{ marginRight: 8 }} />
          <Typography variant="h6" fontWeight={700} color="primary">Insphere</Typography>
        </Box>
        <Divider />
        <List>
          {sidebarItems.map((item) => {
            let path = "/";
            if (item.text === "Add New Data") path = "/add-new-data";
            if (item.text === "Manage Data") path = "/data-management";
            return (
              <ListItem component="button" key={item.text} sx={{ my: 1, borderRadius: 2 }} onClick={() => router.push(path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 4, bgcolor: "#f6f8fc" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/favicon.ico" alt="Insphere Logo" width={32} height={32} style={{ marginRight: 8 }} />
            <Typography variant="h5" fontWeight={700}>Insphere</Typography>
          </Box>
          <Button variant="contained" color="primary" sx={{ borderRadius: 8, textTransform: "none" }} onClick={() => { setChatHistory([]); setConvoId(null); }}>
            New Chat
          </Button>
        </Box>
        {/* Chat Messages */}
        <Box sx={{ flex: 1, overflowY: "auto", mb: 2, bgcolor: "#fff", borderRadius: 2, p: 3, boxShadow: 1 }}>
          {chatHistory.length === 0 && (
            <Typography color="text.secondary">Hello there! How can I assist you today?</Typography>
          )}
          {chatHistory.map((msg, idx) => (
            <Box key={idx} sx={{ mb: 2, display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <Box sx={{
                bgcolor: msg.role === "user" ? "#1976d2" : "#f1f3f9",
                color: msg.role === "user" ? "#fff" : "#222",
                px: 2, py: 1, borderRadius: 2, maxWidth: "70%"
              }}>
                <Typography variant="body1">{msg.content}</Typography>
              </Box>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={32} color="primary" />
            </Box>
          )}
        </Box>
        {/* Input Area */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your own prompt..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !loading) handleSend(); }}
            disabled={loading}
            sx={{ bgcolor: "#fff", borderRadius: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{ borderRadius: 8 }}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
