import React from 'react'
import { NavLink } from "react-router-dom";


const SidebarItem = ({ icon: Icon, title, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? "bg-[#6C63FF] text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <Icon className="text-base shrink-0" />

      <span>{title}</span>
    </NavLink>
  );
};

export default SidebarItem
