"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/Components/Layout";
import dummyInterestData from "../../../../Components/data/InterestData"; // Import dummy interest data
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

const ComputedInterestListing = () => {
    const [interestList, setInterestList] = useState([]);

    useEffect(() => {
        setInterestList(dummyInterestData);
    }, []);

    return (
        <Layout>
            <Box sx={{ padding: 3 }}>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 8 }}>
                    <Typography variant="h4" gutterBottom>
                        Computed Interest Listing
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Loan ID</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {interestList.map((interest) => (
                                    <TableRow key={interest.id}>
                                        <TableCell>{interest.id}</TableCell>
                                        <TableCell>{interest.loanId}</TableCell>
                                        <TableCell>{interest.amount}</TableCell>
                                        <TableCell>{interest.date}</TableCell>
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

export default ComputedInterestListing;