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
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [openLogout, setOpenLogout] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();

        if (response?.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const user = currentUser || authUser;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const profileImage =
    user?.profileImage?.url ||
    user?.profileImage ||
    user?.avatar ||
    user?.image ||
    null;

  const initialLetter = (user?.fullName || user?.name || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <>
      <aside className="w-60 h-screen shrink-0 bg-white border-r border-slate-200 p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex justify-center mb-5">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#6C63FF]">
              ShopEase
            </h1>
          </div>
          <div className="flex flex-col items-center text-center my-5">
            <div className="rounded-full border-2 border-[#8B5CF6] mb-2 shadow-sm">
              {profileImage && !imgError ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#F0EEFF] text-[#6C63FF] font-bold text-base flex items-center justify-center">
                  {initialLetter}
                </div>
              )}
            </div>

            <h3 className="text-sm font-semibold text-[#6C63FF]">
              Welcome, {user?.fullName || user?.name || "User"}
            </h3>

            <p className="text-xs font-medium text-[#6C63FF]">
              {user?.email || ""}
            </p>
          </div>

          <nav className="space-y-1 ">
            <SidebarItem icon={FaHome} title="Dashboard" path="/dashboard" />

            <SidebarItem
              icon={FaLayerGroup}
              title="Categories"
              path="/categories"
            />

            <SidebarItem icon={FaBoxOpen} title="Products" path="/products" />

            <SidebarItem icon={FaShoppingCart} title="Orders" path="/orders" />

            <SidebarItem icon={FaUsers} title="Customers" path="/customers" />

            <SidebarItem icon={FaStar} title="Reviews" path="/reviews" />

          </nav>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setOpenLogout(true)}
            className="w-full px-3 py-1.5 rounded-lg flex items-center gap-2.5 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors cursor-pointer"
          >
            <FaSignOutAlt className="text-base shrink-0" />
            Logout
          </button>
        </div>
      </aside>

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

export default Sidebar;
