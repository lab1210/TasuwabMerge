import loanData from './LoanData';

const dummyInterestData = loanData.map((loan, index) => ({
    id: index + 1,
    loanId: loan.LoanApplication.id,
    amount: Math.round(loan.LoanApplication.loanRequestAmount * 0.05), // Example interest calculation
    date: new Date().toISOString().split('T')[0],
}));

export default dummyInterestData;