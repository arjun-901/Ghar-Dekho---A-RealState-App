import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import { adminDashboardStyles as s } from "../../assets/dummyStyles.js";
import { HiOutlineMail, HiMenu, HiOutlinePhone, HiOutlineUser, HiOutlineClock } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "";

const AdminContacts = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/contact`, { headers: { Authorization: `Bearer ${token}` } });
        setContacts(res.data.contacts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [token, user, navigate]);

  if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="dashboard-main">
        <div className="dashboard-mobile-header" style={{ display: "none", padding: "1rem", background: "#fff", borderBottom: "1px solid #e2e8f0", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><HiMenu size={24} /></button>
          <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Contact Inbox</div>
        </div>

        <div className="dashboard-content" style={{ padding: "2rem" }}>
          <div className={s.headerContainer}>
            <div>
              <h1 className={s.pageTitle}>Contact Inbox</h1>
              <p className={s.pageSubtitle}>View messages from the "Contact Us" form</p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {contacts.length > 0 ? (
              contacts.map(c => (
                <div key={c._id} className="card-premium" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#1e293b", fontWeight: 600 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <HiOutlineUser size={18} />
                        </div>
                        {c.name}
                        <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 600, background: "#f1f5f9", color: "#475569", marginLeft: "0.5rem" }}>{c.role.toUpperCase()}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.9rem" }}><HiOutlineMail /> <a href={`mailto:${c.email}`} style={{ color: "#0d9488", textDecoration: "none" }}>{c.email}</a></div>
                      {c.phone && <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.9rem" }}><HiOutlinePhone /> {c.phone}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                      <HiOutlineClock /> {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", color: "#334155", lineHeight: 1.6 }}>
                    {c.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="card-premium" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                <HiOutlineMail size={48} style={{ opacity: 0.5, marginBottom: "1rem" }} />
                <h3>Inbox Empty</h3>
                <p>No contact messages found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;
