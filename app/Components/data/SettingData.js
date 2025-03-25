// app/settings/settingsData.js

const settingsData = {
  transactionTypes: [
    { name: "Payment", description: "Loan Payment", sign: "-" },
    { name: "Disbursement", description: "Loan Disbursement", sign: "+" },
    { name: "Fee", description: "Application Fee", sign: "+" },
    { name: "Interest", description: "Interest Charge", sign: "+" },
    { name: "Penalty", description: "Late Payment Penalty", sign: "+" },
  ],
  interestTypes: [
    { name: "Fixed", formula: "Amount * Rate" },
    { name: "Variable", formula: "Amount * (Rate + Index)" },
    { name: "Simple", formula: "Principal * Rate * Time" },
    { name: "Compound", formula: "Principal * (1 + Rate)^Time - Principal" },
  ],
  interestTable: [
    { minAmount: 0, maxAmount: 1000, rate: 5 },
    { minAmount: 1001, maxAmount: 5000, rate: 7 },
    { minAmount: 5001, maxAmount: 10000, rate: 10 },
    { minAmount: 10001, maxAmount: 50000, rate: 12 },
    { minAmount: 50001, maxAmount: Infinity, rate: 15 },
  ],
  defaultCharges: [
    { name: "Late Fee", amount: 10 },
    { name: "Application Fee", amount: 50 },
    { name: "Origination Fee", amount: 100 },
    { name: "Processing Fee", amount: 25 },
  ],
  loanProducts: [
    { name: "Personal Loan", terms: "12 months" },
    { name: "Business Loan", terms: "36 months" },
    { name: "Mortgage", terms: "360 months" },
    { name: "Auto Loan", terms: "60 months" },
  ],
};

export default settingsData;
