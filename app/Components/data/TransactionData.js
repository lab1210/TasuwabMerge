import loanData from "./LoanData";

const transactionData = loanData.flatMap((loan) => {
  const loanId = loan.LoanApplication.id;
  const clientId = loan.LoanApplication.clientId;

  return [
    {
      transactionId: loanId * 10 + 1, // Unique ID based on loanId
      loanId: loanId,
      clientId: clientId,
      date: "2024-10-01",
      type: "Disbursement",
      amount: loan.LoanApplication.loanRequestAmount,
      description: "Initial Loan Disbursement",
    },
    {
      transactionId: loanId * 10 + 2,
      loanId: loanId,
      clientId: clientId,
      date: "2024-10-15",
      type: "Payment",
      amount: loan.LoanApplication.loanRequestAmount * 0.1, // 10% payment
      description: "First Monthly Payment",
    },
    {
      transactionId: loanId * 10 + 3,
      loanId: loanId,
      clientId: clientId,
      date: "2024-11-15",
      type: "Payment",
      amount: loan.LoanApplication.loanRequestAmount * 0.1,
      description: "Second Monthly Payment",
    },
  ];
});

export default transactionData;
