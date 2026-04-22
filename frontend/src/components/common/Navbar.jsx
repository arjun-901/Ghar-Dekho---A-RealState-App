import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { HiMenu, HiX, HiOutlineLogout, HiOutlineUser, HiOutlineHeart } from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Don't show navbar on seller/admin dashboard pages
  const hiddenPaths = ["/dashboard", "/add-property", "/edit-property", "/my-properties", "/inquiries", "/admin"];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e2e8f0", padding: "0 2rem", height: "72px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.4rem", fontWeight: 800, color: "#0d9488", textDecoration: "none" }}>
        <span style={{ background: "#0d9488", color: "#fff", padding: "4px 10px", borderRadius: "10px", fontSize: "0.9rem" }}>R</span>
        ReeState
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <div className="hide-mobile" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/" style={{ fontWeight: 600, color: "#334155", textDecoration: "none" }}>Home</Link>
          <Link to="/properties" style={{ fontWeight: 600, color: "#334155", textDecoration: "none" }}>Properties</Link>
          <Link to="/contact" style={{ fontWeight: 600, color: "#334155", textDecoration: "none" }}>Contact</Link>
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/wishlist">
              <HiOutlineHeart size={22} color="#64748b" />
            </Link>
            <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              <img
                src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`}
                alt="Profile"
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
              />
            </Link>
            {user.role === "seller" && (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Dashboard</Link>
            )}
            {user.role === "admin" && (
              <Link to="/admin-dashboard" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Admin</Link>
            )}
            <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
              <HiOutlineLogout size={22} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to="/login" className="btn btn-outline" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;