import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser } from "../../services/authApi";
import ConfirmationModel from "../common/ConfirmationModel";
import SidebarItem from "./SidebarItem";
import logo from "../../assets/logo.png";
import {
  FaHome,
  FaBoxOpen,
  FaLayerGroup,
  FaShoppingCart,
  FaUsers,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUndoAlt,
  FaTruck,
  FaBan,
  FaTicketAlt,
  FaUserShield,
} from "react-icons/fa";

const navigationItems = [
  {
    icon: FaHome,
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: FaLayerGroup,
    title: "Categories",
    path: "/categories",
  },
  {
    icon: FaBoxOpen,
    title: "Products",
    path: "/products",
  },
  {
    icon: FaShoppingCart,
    title: "Orders",
    path: "/orders",
  },
  {
    icon: FaUndoAlt,
    title: "Refunds",
    path: "/refund",
  },
  {
    icon: FaTruck,
    title: "Shipment",
    path: "/shipment",
  },
  {
    icon: FaBan,
    title: "Return/Exchange",
    path: "/return",
  },
  {
    icon: FaUsers,
    title: "Customers",
    path: "/customers",
  },
  {
    icon: FaStar,
    title: "Reviews",
    path: "/reviews",
  },
  {
    icon: FaTicketAlt,
    title: "Tickets",
    path: "/tickets",
  },
  {
    icon: FaUserShield,
    title: "Admins",
    path: "/admins",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpenLogout(false);
    setMenuOpen(false);
    navigate("/");
  };

  const filteredNavigationItems = navigationItems.filter(
    (item) => item.path !== "/admins" || user?.role === "SUPER_ADMIN"
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-md lg:hidden">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#6547C9]">
          ShopEase
        </h1>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </header>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />

          <div className="fixed right-0 top-16 z-50 w-72 max-w-[60vw] rounded-bl-2xl border-b border-l border-slate-200 bg-white/100 p-4 shadow-xl lg:hidden">
            <nav className="space-y-1">
              {filteredNavigationItems.map(({ icon: Icon, title, path }) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => handleNavigate(path)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-slate-700 transition hover:bg-[#F0EEFF] hover:text-[#6547C9]"
                >
                  <Icon />
                  <span>{title}</span>
                </button>
              ))}
            </nav>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setOpenLogout(true)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-red-600 hover:bg-red-50"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmationModel
        isOpen={openLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setOpenLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
