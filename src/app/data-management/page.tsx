"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Switch, TextField, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from "next/navigation";

interface FileData {
  filename: string;
  created_at: string;
  active: boolean;
  url?: string;
}

const PAGE_SIZE = 10;

const drawerWidth = 260;
const sidebarItems = [
  { text: "Ask AI", icon: <ChatBubbleOutlineIcon /> },
  { text: "Add New Data", icon: <AddCircleOutlineIcon /> },
  { text: "Manage Data", icon: <ManageAccountsIcon /> },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export default function DataManagementPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [totalCountAll, setTotalCountAll] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; file?: string }>({ open: false });
  const [toggleDialog, setToggleDialog] = useState<{ open: boolean; file?: string; active?: boolean }>({ open: false });
  const [actionLoading, setActionLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchFiles();
  }, [page, limit, search]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit, offset: page * limit };
      if (search) params.search = search;
      const res = await axios.get(`${API_URL}/list-files`, { params });
      setFiles(res.data.files || []);
      setTotalCount(res.data.count || 0);
      setLimit(res.data.limit || PAGE_SIZE);
      setTotalCountAll(res.data.total_count || 0);
    } catch {
      setFiles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.file) return;
    setActionLoading(true);
    try {
      await axios.post(`${API_URL}/delete-file`, { file_name: deleteDialog.file });
      setDeleteDialog({ open: false });
      fetchFiles();
    } catch {
      setDeleteDialog({ open: false });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!toggleDialog.file) return;
    setActionLoading(true);
    try {
      await axios.post(`${API_URL}/file-active-toggle`, {
        file_name: toggleDialog.file,
        active: !toggleDialog.active,
      });
      setToggleDialog({ open: false });
      fetchFiles();
    } catch {
      setToggleDialog({ open: false });
    } finally {
      setActionLoading(false);
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
            const selected = item.text === "Manage Data";
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
        <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: 4, boxShadow: 1, flex: 1, minHeight: 0 }}>
          <Typography variant="h5" fontWeight={700} mb={3}>Data Management</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <TextField
              placeholder="Search by File Name"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
              sx={{ width: 320 }}
            />
          </Box>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "#E6EFFF" }}>
                    <TableCell>FILE NAME</TableCell>
                    <TableCell>ADDED AT</TableCell>
                    <TableCell>STATUS</TableCell>
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>
                  ) : files.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center">No results.</TableCell></TableRow>
                  ) : files.map((file) => (
                    <TableRow key={file.filename}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PictureAsPdfIcon color="error" />
                          {file.filename}
                          {file.url && file.url.endsWith('.pdf') && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                setPreviewUrl(file.url ?? null);
                                setPreviewOpen(true);
                              }}
                              sx={{ ml: 1 }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{file.created_at}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "inline-block", px: 2, py: 0.5, borderRadius: 2, bgcolor: file.active ? "#D2E3D8" : "#D9D9D9", color: file.active ? "#067647" : "#222" }}>
                          {file.active ? "Active" : "Inactive"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={file.active}
                          onChange={() => setToggleDialog({ open: true, file: file.filename, active: file.active })}
                          color="success"
                        />
                        <IconButton color="error" onClick={() => setDeleteDialog({ open: true, file: file.filename })}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box 
              sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                p: 2, 
                minWidth: 300, 
                borderTop: '1px solid #e3e6ef', 
                mt: 2, 
                bgcolor: '#fafbfc',
                position: 'sticky',
                bottom: 0,
                zIndex: 2
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, opacity: 0.8 }}>
                Showing {files.length} of {totalCount} filtered row(s) ({totalCountAll} total).
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} size="large">
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton onClick={() => setPage(p => (p + 1 < Math.ceil(totalCount / limit) ? p + 1 : p))} disabled={page + 1 >= Math.ceil(totalCount / limit)} size="large">
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
          {/* Delete Dialog */}
          <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false })}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>Are you sure you want to delete the file &quot;{deleteDialog.file}&quot;?</DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false })} disabled={actionLoading}>Cancel</Button>
              <Button color="error" onClick={handleDelete} disabled={actionLoading}>{actionLoading ? "Deleting..." : "Delete"}</Button>
            </DialogActions>
          </Dialog>
          {/* Toggle Status Dialog */}
          <Dialog open={toggleDialog.open} onClose={() => setToggleDialog({ open: false })}>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogContent>Are you sure you want to {toggleDialog.active ? "deactivate" : "activate"} the file &quot;{toggleDialog.file}&quot;?</DialogContent>
            <DialogActions>
              <Button onClick={() => setToggleDialog({ open: false })} disabled={actionLoading}>Cancel</Button>
              <Button onClick={handleToggle} disabled={actionLoading}>{actionLoading ? "Updating..." : toggleDialog.active ? "Deactivate" : "Activate"}</Button>
            </DialogActions>
          </Dialog>
          {/* Preview Dialog */}
          <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>PDF Preview</DialogTitle>
            <Box sx={{ p: 2 }}>
              {previewUrl && (
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
                  title="PDF Preview"
                />
              )}
            </Box>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
} 