import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HiOutlineViewGrid, HiOutlineUsers, HiOutlineUserCircle, HiOutlineLibrary, HiOutlineChatAlt2, HiOutlineMail } from "react-icons/hi";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: "Overview", icon: HiOutlineViewGrid, path: "/admin-dashboard" },
    { name: "Users", icon: HiOutlineUsers, path: "/admin/users" },
    { name: "Properties", icon: HiOutlineLibrary, path: "/admin/properties" },
    { name: "Contact Inbox", icon: HiOutlineMail, path: "/admin/contacts" },
  ];

  return (
    <div className={`dashboard-sidebar ${isOpen ? 'open' : ''}`} style={{ 
      position: "fixed", top: 0, left: 0, bottom: 0, width: "260px", background: "#fff", 
      borderRight: "1px solid #e2e8f0", zIndex: 1000, display: "flex", flexDirection: "column",
      transition: "transform 0.3s ease"
    }}>
      <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", fontWeight: 800, color: "#0d9488", textDecoration: "none" }}>
          <span style={{ background: "#0d9488", color: "#fff", padding: "4px 8px", borderRadius: "8px", fontSize: "0.8rem" }}>E</span>
          EstateX Admin
        </Link>
      </div>

      <div style={{ padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, overflowY: "auto" }}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`} onClick={() => setIsOpen && setIsOpen(false)}>
            <item.icon size={20} /> {item.name}
          </Link>
        ))}
      </div>
      
      <div style={{ padding: "1.5rem 1rem", borderTop: "1px solid #f1f5f9" }}>
        <button onClick={logout} style={{ width: "100%", background: "none", border: "none", color: "#64748b", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", cursor: "pointer", fontWeight: 600 }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
