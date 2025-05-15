import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_URL = "/transaction";
const USER_API_URL = "/user";

axios.defaults.withCredentials = true;

const TransactionContext = createContext();

export const useTransactions = () => {
  return useContext(TransactionContext);
};

export const TransactionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchBalance();
    } else {
      setTransactions([]);
      setBalance(0);
    }
  }, [isAuthenticated]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // todo --> get transactions from the server
      const response = await axios.get(`${API_URL}/history`);

      if (response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Fetch transactions error:", error);
      setError("Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalance = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${USER_API_URL}/profile`);

      if (response.data) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Fetch balance error:", error);
      setError("Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMoney = async (to, amount, note) => {
    setIsLoading(true);
    setError(null);

    try {
      // todo --> send money to the server
      const response = await axios.post(`${API_URL}/transfer`, {
        to,
        amount,
        note,
      });

      if (response.data) {
        await fetchTransactions();
        await fetchBalance();
        return true;
      }
    } catch (error) {
      console.error("Send money error:", error);
      setError(error.response?.data?.message || "Failed to send money");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    transactions,
    balance,
    isLoading,
    error,
    fetchTransactions,
    fetchBalance,
    sendMoney,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
