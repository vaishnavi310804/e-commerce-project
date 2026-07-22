import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import ConfirmationModel from "../common/ConfirmationModel";

const Navbar = () => {

     const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-6">

        <FaBell className="text-lg cursor-pointer" />

        <div className="text-right">
          <p className="font-semibold">
            {user?.fullName}
          </p>

          <p className="text-sm text-slate-500">
            {user?.role}
          </p>
        </div>

        <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
          >
            <FaSignOutAlt />
            Logout
          </button>

      </div>

    </header>
    <ConfirmationModel
        isOpen={open}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default Navbar
