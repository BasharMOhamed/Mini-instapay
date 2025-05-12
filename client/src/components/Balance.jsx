import React, { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
const Balance = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  // const [balance, setBalance] = useState(1250.75);
  // const [transactions, setTransactions] = useState();
  const [moneyIn, setMoneyIn] = useState(0);
  const [moneyOut, setMoneyOut] = useState(0);
  const { fetchBalance, fetchTransactions, transactions, balance } =
    useTransactions();
  const { currentUser } = useAuth();

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }

    // In a real app, you would fetch the balance and transactions from an API
    fetchBalance();
    fetchTransactions();
    console.log("transactions ", transactions);

    const inTranasctions = transactions.reduce((acc, trans) => {
      if (trans.to == currentUser.email) return acc + trans.amount;
      return acc;
    }, 0);
    const outTransactions = transactions.reduce((acc, trans) => {
      if (trans.from == currentUser.email) return acc + trans.amount;
      return acc;
    }, 0);
    console.log("in ", inTranasctions, " out ", outTransactions);

    setMoneyIn(inTranasctions);
    setMoneyOut(outTransactions);
  }, [transactions, balance]);

  return (
    <div
      className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 font-montserrat"
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Balance Card */}
        <div className="bg-[#4c096e] text-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">Your Balance</h2>
          <p className="text-4xl font-bold mb-4">{formatCurrency(balance)}</p>
          <div className="flex space-x-4">
            <button className="bg-white text-[#4c096e] px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors cursor-pointer">
              Add Money
            </button>
            <button className="bg-[#FB6619] text-white px-4 py-2 rounded-md font-medium hover:bg-amber-700 transition-colors cursor-pointer">
              Send Money
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatComponent
            title="Money In (This Month)"
            value={moneyIn}
            color={"text-green-600"}
            sign={"+"}
          />
          <StatComponent
            title="Money Out (This Month)"
            value={moneyOut}
            color={"text-red-600"}
            sign={"-"}
          />
          <StatComponent
            title="Pending"
            value={0}
            color={"text-yellow-600"}
            sign={""}
          />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Transactions
            </h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <TransactionComponent
                transaction={transaction}
                currentUser={currentUser}
              />
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-gray-200">
            <button className="text-[#4c096e] font-medium hover:underline cursor-pointer">
              View All Transactions →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;

const StatComponent = ({ title, value, color, sign }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>
        {sign}
        {formatCurrency(value)}
      </p>
    </div>
  );
};

const TransactionComponent = ({ transaction, currentUser }) => {
  return (
    <li key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
              transaction.to === currentUser.email
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {transaction.to === currentUser.email ? "↓" : "↑"}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {transaction.to === currentUser.email
                ? `Received from ${transaction.from}`
                : `Sent to ${transaction.to}`}
            </p>
            <p className="text-sm text-gray-500">{transaction.note}</p>
            <p className="text-xs text-gray-400">{transaction.date}</p>
          </div>
        </div>
        <div
          className={`font-bold ${
            transaction.to === currentUser.email
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {transaction.to === currentUser.email ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </div>
      </div>
    </li>
  );
};
