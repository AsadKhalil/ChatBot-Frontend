"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useRouter } from "next/navigation";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';

const drawerWidth = 260;
const sidebarItems = [
  { text: "Ask AI", icon: <ChatBubbleOutlineIcon /> },
  { text: "Add New Data", icon: <AddCircleOutlineIcon /> },
  { text: "Manage Data", icon: <ManageAccountsIcon /> },
];

export default function AddNewDataPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    setError(null);
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setError("Only PDF files are allowed.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setError("Only PDF files are allowed.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setMessage(null);
    setError(null);
    const formData = new FormData();
    formData.append("files", selectedFile);
    try {
      const res = await fetch("http://localhost:8000/create_knowledge_base", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setMessage("File uploaded successfully!");
        setSelectedFile(null);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
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
            const selected = item.text === "Add New Data";
            return (
              <ListItem component="button" key={item.text} sx={{ my: 1, borderRadius: 2, bgcolor: selected ? "#e6efff" : undefined }} onClick={() => router.push(path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 4, bgcolor: "#f6f8fc" }}>
        <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: 4, boxShadow: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h5" fontWeight={700} mb={1} align="center">Add Data To Knowledge Base</Typography>
          <Typography color="text.secondary" mb={3} align="center">Upload files to augment your bot's knowledge base.</Typography>
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              border: '1px dashed #bfc9da',
              borderRadius: 2,
              p: 5,
              mb: 3,
              width: 400,
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#fcfdff',
              cursor: 'pointer',
              transition: 'border 0.2s',
            }}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Typography color="primary" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Click to Upload
            </Typography>
            <Typography color="text.secondary" fontSize={14} mt={1}>
              or drag and drop file
            </Typography>
            <Typography color="text.secondary" fontSize={13} mt={1}>
              Limit 100MB overall
            </Typography>
            <Typography color="text.secondary" fontSize={13} mt={1}>
              Supported Format : .pdf
            </Typography>
            {selectedFile && (
              <Typography color="success.main" fontSize={14} mt={2}>{selectedFile.name}</Typography>
            )}
          </Box>
          {error && <Typography color="error" mb={2}>{error}</Typography>}
          {message && <Typography color="success.main" mb={2}>{message}</Typography>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            sx={{ borderRadius: 2, width: 300, height: 44, fontWeight: 600 }}
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
} 