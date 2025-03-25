const dummyNotifications = [
  {
    id: 1,
    type: "loanApproval",
    message: "Loan application #12345 for John Doe has been approved.",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isRead: false,
  },
  {
    id: 2,
    type: "loanDisbursement",
    message: "Loan #12345 has been disbursed to John Doe's account.",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isRead: true,
  },
  {
    id: 3,
    type: "loanRepaymentDue",
    message: "Repayment for loan #67890 for Jane Smith is due in 3 days.",
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    isRead: false,
  },
  {
    id: 4,
    type: "loanRepaymentReceived",
    message: "Repayment of $500 received for loan #67890 from Jane Smith.",
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    isRead: false,
  },
  {
    id: 5,
    type: "loanApplicationPending",
    message:
      "New loan application #98765 from Michael Brown is pending review.",
    timestamp: new Date(Date.now() - 18000000), // 5 hours ago
    isRead: true,
  },
  {
    id: 6,
    type: "loanApplicationRejected",
    message: "Loan application #54321 for Sarah Lee has been rejected.",
    timestamp: new Date(Date.now() - 21600000), // 6 hours ago
    isRead: false,
  },
  {
    id: 7,
    type: "loanOverdue",
    message: "Loan #112233 for David Wilson is now overdue.",
    timestamp: new Date(Date.now() - 25200000), // 7 hours ago
    isRead: false,
  },
  {
    id: 8,
    type: "userAccountCreated",
    message: "New user account created for Employee Robert Johnson.",
    timestamp: new Date(Date.now() - 28800000), // 8 hours ago
    isRead: false,
  },
  {
    id: 9,
    type: "loanDocumentUpload",
    message: "New document uploaded for loan #12345 by John Doe.",
    timestamp: new Date(Date.now() - 32400000), // 9 hours ago
    isRead: false,
  },
  {
    id: 10,
    type: "loanTermsChanged",
    message: "Loan terms updated for loan #67890 for Jane Smith.",
    timestamp: new Date(Date.now() - 36000000), // 10 hours ago
    isRead: true,
  },
];

export default dummyNotifications;
