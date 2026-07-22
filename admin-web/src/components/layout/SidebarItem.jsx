import React from 'react'
import { NavLink } from "react-router-dom";


const SidebarItem = ({ icon: Icon, title, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-[#6C63FF] text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <Icon className="text-lg" />

      <span className="font-medium">{title}</span>
    </NavLink>
  );
};

export default SidebarItem
