import React from 'react'
import SidebarItem from './SidebarItem';
import {
  FaHome,
  FaBoxOpen,
  FaLayerGroup,
  FaShoppingCart,
  FaUsers,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-5">
      <h1 className="text-2xl font-bold text-[#6C63FF] mb-10">
        ShopEase
      </h1>

      <nav className="space-y-2">
        <SidebarItem icon={FaHome} title="Dashboard" path="/dashboard" />

        <SidebarItem
          icon={FaLayerGroup}
          title="Categories"
          path="/categories"
        />

        <SidebarItem
          icon={FaBoxOpen}
          title="Products"
          path="/products"
        />

        <SidebarItem
          icon={FaShoppingCart}
          title="Orders"
          path="/orders"
        />

        <SidebarItem
          icon={FaUsers}
          title="Customers"
          path="/customers"
        />

        <SidebarItem
          icon={FaCog}
          title="Settings"
          path="/settings"
        />
      </nav>
    </aside>
  );
}

export default Sidebar
