import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiUser, HiOutlineLogout, HiOutlineViewGrid, HiOutlineHeart } from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hidden on dashboard pages
  const hiddenPaths = ["/dashboard", "/add-property", "/edit-property", "/my-properties", "/inquiries", "/admin"];
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) return null;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Contact Us", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <>
      <style>{`
        .navbar-wrapper {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 20px 0;
        }
        .navbar-wrapper.scrolled {
          padding: 12px 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .nav-container {
          max-width: 1400px; margin: 0 auto; padding: 0 5%;
          display: flex; align-items: center; justify-content: space-between;
        }

        .brand-logo {
          display: flex; align-items: center; gap: 8px; font-size: 1.6rem;
          font-weight: 800; color: #0f172a; text-decoration: none;
          letter-spacing: -0.03em;
        }
        .brand-icon {
          width: 36px; height: 36px; background: #4f46e5; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 1.2rem;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
        }

        .desktop-nav { display: flex; align-items: center; gap: 32px; }
        
        .nav-link {
          position: relative; font-size: 1rem; font-weight: 600;
          color: #64748b; text-decoration: none; padding: 8px 0;
          transition: color 0.3s;
        }
        .nav-link:hover { color: #0f172a; }
        .nav-link.active { color: #4f46e5; }
        .nav-link-indicator {
          position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: #4f46e5; border-radius: 4px 4px 0 0;
        }

        .auth-buttons { display: flex; align-items: center; gap: 16px; }
        
        .btn-login {
          font-weight: 600; color: #0f172a; text-decoration: none;
          padding: 10px 20px; border-radius: 12px; transition: all 0.3s;
        }
        .btn-login:hover { background: rgba(0,0,0,0.04); }
        
        .btn-register {
          background: #4f46e5; color: #fff; font-weight: 600; text-decoration: none;
          padding: 10px 24px; border-radius: 12px; transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }
        .btn-register:hover { background: #3730a3; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79, 70, 229, 0.35); }

        .profile-wrapper { position: relative; }
        .profile-btn {
          display: flex; align-items: center; gap: 10px; background: #fff;
          border: 1px solid rgba(0,0,0,0.08); padding: 6px 16px 6px 6px;
          border-radius: 50px; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .profile-btn:hover { border-color: rgba(79,70,229,0.3); box-shadow: 0 4px 14px rgba(79,70,229,0.1); }
        .profile-avatar {
          width: 34px; height: 34px; border-radius: 50%; background: #eff6ff;
          color: #4f46e5; display: flex; align-items: center; justify-content: center;
          font-weight: 700; overflow: hidden;
        }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-name { font-weight: 600; font-size: 0.95rem; color: #0f172a; }

        .dropdown-menu {
          position: absolute; top: calc(100% + 12px); right: 0; width: 220px;
          background: #fff; border-radius: 20px; padding: 12px;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
          transform-origin: top right;
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          color: #64748b; text-decoration: none; border-radius: 12px;
          font-weight: 500; transition: all 0.2s; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; font-size: 1rem;
        }
        .dropdown-item:hover { background: #f8fafc; color: #4f46e5; }
        .dropdown-item.danger:hover { background: #fef2f2; color: #e11d48; }

        .mobile-toggle {
          display: none; background: transparent; border: none; font-size: 1.8rem;
          color: #0f172a; cursor: pointer; padding: 4px;
        }

        .mobile-menu {
          position: fixed; inset: 0; background: #fff; z-index: 999;
          display: flex; flex-direction: column; padding: 80px 5% 40px;
        }
        .mobile-link {
          font-size: 2rem; font-weight: 700; color: #0f172a; text-decoration: none;
          padding: 16px 0; border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .mobile-link.active { color: #4f46e5; }

        @media (max-width: 900px) {
          .desktop-nav, .auth-buttons { display: none; }
          .mobile-toggle { display: block; }
        }
      `}</style>

      <div className={`navbar-wrapper ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <Link to="/" className="brand-logo">
            <motion.div className="brand-icon" whileHover={{ rotate: 10, scale: 1.05 }}>E</motion.div>
            EstateX
          </Link>

          {/* DESKTOP NAV */}
          <div className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} className={`nav-link ${isActive ? "active" : ""}`}>
                  {link.name}
                  {isActive && (
                    <motion.div layoutId="navbar-indicator" className="nav-link-indicator" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* AUTH SECTION */}
          <div className="auth-buttons">
            {user ? (
              <div className="profile-wrapper" ref={dropdownRef}>
                <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="profile-avatar">
                    {user.profilePic ? <img src={user.profilePic} alt="Profile" /> : <HiUser size={20} />}
                  </div>
                  <span className="profile-name">{user.name?.split(" ")[0]}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div 
                      className="dropdown-menu"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div style={{ padding: "8px 16px 16px", borderBottom: "1px solid #f1f5f9", marginBottom: "8px" }}>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{user.name}</div>
                        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{user.email}</div>
                      </div>
                      
                      {user.role === "admin" && (
                        <Link to="/admin-dashboard" onClick={() => setProfileOpen(false)} className="dropdown-item"><HiOutlineViewGrid size={20} /> Dashboard</Link>
                      )}
                      {user.role === "seller" && (
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="dropdown-item"><HiOutlineViewGrid size={20} /> Dashboard</Link>
                      )}
                      {user.role === "buyer" && (
                        <Link to="/buyer-dashboard" onClick={() => setProfileOpen(false)} className="dropdown-item"><HiOutlineViewGrid size={20} /> Dashboard</Link>
                      )}
                      {user.role !== "admin" && (
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="dropdown-item"><HiUser size={20} /> Profile</Link>
                      )}
                      
                      <button onClick={handleLogout} className="dropdown-item danger" style={{ marginTop: "8px" }}>
                        <HiOutlineLogout size={20} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-login">Log In</Link>
                <Link to="/register" className="btn-register">Sign Up</Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }}>
              {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              {navLinks.map((link, i) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link to={link.path} className={`mobile-link ${location.pathname === link.path ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)}>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              {user && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {user.role === "admin" && <Link to="/admin-dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>}
                  {user.role === "seller" && <Link to="/dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>}
                  {user.role === "buyer" && <Link to="/buyer-dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>}
                  {user.role !== "admin" && <Link to="/profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Profile</Link>}
                </motion.div>
              )}
            </div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {user ? (
                <button onClick={handleLogout} className="btn-register" style={{ textAlign: "center", width: "100%", padding: "16px", fontSize: "1.2rem" }}>Logout</button>
              ) : (
                <>
                  <Link to="/login" className="btn-login" style={{ textAlign: "center", border: "1px solid #e2e8f0", padding: "16px", fontSize: "1.2rem" }} onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  <Link to="/register" className="btn-register" style={{ textAlign: "center", padding: "16px", fontSize: "1.2rem" }} onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;