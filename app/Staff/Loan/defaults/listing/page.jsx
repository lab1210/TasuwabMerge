// app/Staff/Loan/defaults/listing/page.js
"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/Components/Layout";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import dummyDefaultData from "../../../../Components/data/DefaultData"; // Import dummy data

const ComputedDefaultChargesListing = () => {
    const [defaultList, setDefaultList] = useState([]);

    useEffect(() => {
        setDefaultList(dummyDefaultData); // Use dummy data
    }, []);

    return (
        <Layout>
            <Box sx={{ padding: 3 }}>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 8 }}>
                    <Typography variant="h4" gutterBottom style={{ color: "#333" }}>
                        Computed Default Charges Listing
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Loan ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {defaultList.map((defaultCharge, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{defaultCharge.loanId}</TableCell>
                                        <TableCell>{defaultCharge.date}</TableCell>
                                        <TableCell>{defaultCharge.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Layout>
    );
};

export default ComputedDefaultChargesListing;