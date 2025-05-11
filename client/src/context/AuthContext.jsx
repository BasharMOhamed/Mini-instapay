import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/user";

// Configure axios defaults for credentials
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      // First check localStorage for a quick initial state
      const storedAuth = localStorage.getItem("isAuthenticated");

      if (storedAuth === "true") {
        try {
          // Verify with the server
          const response = await axios.get(`${API_URL}/profile`);

          if (response.data) {
            setCurrentUser(response.data);
            setIsAuthenticated(true);
          } else {
            // If server says not authenticated, clear localStorage
            localStorage.removeItem("isAuthenticated");
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem("isAuthenticated");
          setIsAuthenticated(false);
          setCurrentUser(null);
          setError("Failed to authenticate user");
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data) {
        localStorage.setItem("isAuthenticated", "true");
        setCurrentUser(response.data);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Failed to login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/logout`);

      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      if (response.data) {
        return true;
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.error || "Failed to register");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
