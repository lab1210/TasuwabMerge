// ActivityData.js
const dummyActivity = [
  {
    id: 1,
    type: "userLogin",
    message: "User John Doe logged in.",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: 2,
    type: "documentUploaded",
    message: "Document 'Loan Agreement' uploaded by Jane Smith.",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: 3,
    type: "paymentReceived",
    message: "Payment of $1000 received from Michael Brown.",
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
  },
  {
    id: 4,
    type: "settingsUpdated",
    message: "Loan settings updated by Admin.",
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
  },
  {
    id: 5,
    type: "activity",
    message: "Loan application #12345 submitted by Sarah Lee.",
    timestamp: new Date(Date.now() - 18000000), // 5 hours ago
  },
  {
    id: 6,
    type: "success",
    message: "Loan application #67890 Approved by Admin.",
    timestamp: new Date(Date.now() - 21600000), // 6 hours ago
  },
  {
    id: 7,
    type: "warning",
    message: "Loan #112233 is now overdue.",
    timestamp: new Date(Date.now() - 25200000), // 7 hours ago
  },
  {
    id: 8,
    type: "error",
    message: "System Error: Failed to process payment.",
    timestamp: new Date(Date.now() - 28800000), // 8 hours ago
  },
];

export default dummyActivity;
