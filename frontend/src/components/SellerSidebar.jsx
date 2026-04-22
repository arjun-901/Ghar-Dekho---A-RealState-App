import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineChartBar, HiOutlineUser, HiOutlineSupport, HiOutlineLogout } from "react-icons/hi";

const SellerSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", icon: HiOutlineViewGrid, path: "/dashboard" },
    { name: "My Listings", icon: HiOutlineClipboardList, path: "/dashboard" }, // In our single-page dashboard
    { name: "Leads", icon: HiOutlineChartBar, path: "/dashboard" }, // In our single-page dashboard
    { name: "Messages", icon: HiOutlineViewGrid, path: "/chat-messages" },
    { name: "Profile", icon: HiOutlineUser, path: "/profile" },
    { name: "Support", icon: HiOutlineSupport, path: "/contact" },
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
          EstateX Seller
        </Link>
      </div>

      <div style={{ padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, overflowY: "auto" }}>
        {navItems.map((item, index) => (
          <Link key={index} to={item.path} className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`} onClick={() => setIsOpen && setIsOpen(false)}>
            <item.icon size={20} /> {item.name}
          </Link>
        ))}
      </div>
      
      <div style={{ padding: "1.5rem 1rem", borderTop: "1px solid #f1f5f9" }}>
        <button onClick={logout} style={{ width: "100%", background: "none", border: "none", color: "#64748b", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", cursor: "pointer", fontWeight: 600 }}>
          <HiOutlineLogout size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default SellerSidebar;