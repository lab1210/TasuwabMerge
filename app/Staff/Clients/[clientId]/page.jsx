"use client";
import React from "react";
import Layout from "@/app/Components/Layout";
import { useParams } from "next/navigation";
import clientdata from "../../../Components/data/ClientData";
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

const ClientDetails = () => {
  const { clientId } = useParams();

  if (!clientId) {
    return (
      <Layout>
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Layout>
    );
  }

  const numericClientId = parseInt(clientId, 10);
  const client = clientdata.find((c) => c.clientId === numericClientId);

  if (!client) {
    return (
      <Layout>
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6">Client not found.</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ padding: 3 }}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Avatar
                src={client.image}
                alt={client.fullName}
                sx={{ width: 120, height: 120, marginBottom: 1 }}
              />
              <Typography variant="h5" component="h1">
                {client.fullName}
              </Typography>
            </Box>

            <Divider sx={{ marginBottom: 2 }} />

            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Personal Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Phone" secondary={<Typography color="primary">{client.phoneNumber}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="Email" secondary={<Typography color="primary">{client.emailAddress}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="Gender" secondary={<Typography color="primary">{client.gender}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="Marital Status" secondary={<Typography color="primary">{client.maritalStatus}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="Date of Birth" secondary={<Typography color="primary">{client.dateOfBirth}</Typography>} />
                <Divider />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Address Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Residential Address" secondary={<Typography color="primary">{client.residentialAddress}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="Town" secondary={<Typography color="primary">{client.town}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="State" secondary={<Typography color="primary">{client.state}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="Nationality" secondary={<Typography color="primary">{client.nationality}</Typography>} />
                <Divider />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Employment Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Occupation" secondary={<Typography color="primary">{client.occupation}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="Employer" secondary={<Typography color="primary">{client.employer}</Typography>} />
                <Divider />
              </ListItem>
              <ListItem>
                <ListItemText primary="Employer Address" secondary={<Typography color="primary">{client.employerAddress}</Typography>} />
                <Divider />
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default ClientDetails;