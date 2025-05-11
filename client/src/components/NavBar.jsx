import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, currentUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (["/login", "/register"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-[#4c096e] w-full py-5 px-10 flex justify-between items-center">
      <div>
        <Link to="/">
          <img src="/image.png" alt="logo" />
        </Link>
      </div>
      {isAuthenticated && (
        <div className="flex items-center">
          {currentUser && (
            <span className="text-white mr-6">
              Hello, {currentUser.name || currentUser.email}
            </span>
          )}
          <ul className="flex gap-10 text-xl text-white font-montserrat items-center">
            <Link
              to="/send"
              className={`hover:text-amber-700 cursor-pointer ${
                location.pathname === "/send" ? "text-amber-500" : ""
              }`}
            >
              Send Money
            </Link>
            <Link
              to="/balance"
              className={`hover:text-amber-700 cursor-pointer ${
                location.pathname === "/balance" ? "text-amber-500" : ""
              }`}
            >
              Balance
            </Link>
            <Link
              to="/history"
              className={`hover:text-amber-700 cursor-pointer ${
                location.pathname === "/history" ? "text-amber-500" : ""
              }`}
            >
              History
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer bg-[#FB6619] hover:bg-amber-700 py-2 px-5 rounded-full transition-colors duration-300"
            >
              Logout
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
