"use client";
import React, { useState } from "react";
import Layout from "@/app/Components/Layout";
import clientdata from "../../Components/data/ClientData";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import EditClient from "./EditClient";
import DeleteClient from "./DeleteClient";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  Box,
  IconButton,
  Tooltip,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const theme = createTheme({
  palette: {
    primary: {
      main: "#50aa4e",
    },
    text: {
      primary: "#333",
    },
  },
});

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editedClientData, setEditedClientData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 5;
  const router = useRouter();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredClients = clientdata.filter((client) =>
    Object.values(client).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleViewDetails = (clientId) => {
    router.push(`/Staff/Clients/${clientId}`);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setEditedClientData(client);
    setEditModalOpen(true);
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedClient(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedClient(null);
  };

  const handleEditChange = (updatedClient) => {
    setEditedClientData(updatedClient);
    const clientIndex = clientdata.findIndex(
      (client) => client.clientId === updatedClient.clientId
    );
    if (clientIndex > -1) {
      const updatedClientData = [...clientdata];
      updatedClientData[clientIndex] = updatedClient;
      clientdata[clientIndex] = updatedClient;
    }
  };

  const handleSaveEdit = () => {
    const clientIndex = clientdata.findIndex(
      (client) => client.clientId === selectedClient.clientId
    );
    if (clientIndex > -1) {
      clientdata[clientIndex] = editedClientData;
    }
    handleCloseEditModal();
  };

  const handleConfirmDelete = () => {
    const clientIndex = clientdata.findIndex(
      (client) => client.clientId === selectedClient.clientId
    );
    if (clientIndex > -1) {
      clientdata.splice(clientIndex, 1);
    }
    handleCloseDeleteModal();
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ padding: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Box>
              <Typography variant="h4" component="h1">
                Clients
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View all of your Client information.
              </Typography>
            </Box>
            <Tooltip title="Add New Client">
              <IconButton
                style={{ color: "#50aa4e" }}
                onClick={() => router.push("/Staff/Clients/Create-Client")}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Search clients..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              size="small"
            />
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>ClientId</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients.map((client, index) => (
                  <TableRow key={client.clientId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <img
                        src={client.image}
                        alt={client.fullName}
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                      />
                    </TableCell>
                    <TableCell>{client.clientId}</TableCell>
                    <TableCell>{client.fullName}</TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>{client.emailAddress}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton style={{ color: "#333" }} onClick={() => handleViewDetails(client.clientId)}>
                          <FaEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Client">
                        <IconButton style={{ color: "#333" }} onClick={() => handleEditClient(client)}>
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Client">
                        <IconButton style={{ color: "red" }} onClick={() => handleDeleteClient(client)}>
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
          <EditClient
            isOpen={editModalOpen}
            onClose={handleCloseEditModal}
            client={selectedClient}
            onSaveEdit={handleSaveEdit}
            onEditChange={handleEditChange}
          />
          <DeleteClient
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            client={selectedClient}
            onDelete={handleConfirmDelete}
          />
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default ClientList;