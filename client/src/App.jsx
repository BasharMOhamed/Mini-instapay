import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Balance from "./components/Balance";
import History from "./components/History";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Register from "./components/Register";
import SendMoney from "./components/SendMoney";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4c096e]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="font-montserrat">
        <NavBar />
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/balance" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/balance" /> : <Register />
            }
          />

          {/* Protected routes */}
          <Route
            path="/balance"
            element={isAuthenticated ? <Balance /> : <Navigate to="/login" />}
          />
          <Route
            path="/send"
            element={isAuthenticated ? <SendMoney /> : <Navigate to="/login" />}
          />
          <Route
            path="/history"
            element={isAuthenticated ? <History /> : <Navigate to="/login" />}
          />

          {/* Default route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/balance" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
