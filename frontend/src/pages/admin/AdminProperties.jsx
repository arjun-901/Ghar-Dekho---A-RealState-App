import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import { adminDashboardStyles as s } from "../../assets/dummyStyles.js";
import { HiOutlineLibrary, HiOutlineTrash, HiSearch, HiMenu, HiOutlineEye, HiOutlineLocationMarker } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "";

const AdminProperties = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/property`);
        setProperties(res.data.properties);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [token, user, navigate]);

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Delete this property permanently? This action cannot be undone.")) {
      try {
        await axios.delete(`${API_URL}/api/property/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setProperties(properties.filter(p => p._id !== id));
      } catch (err) { alert("Failed to delete property"); }
    }
  };

  const filteredProperties = properties.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.city.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="dashboard-main">
        <div className="dashboard-mobile-header" style={{ display: "none", padding: "1rem", background: "#fff", borderBottom: "1px solid #e2e8f0", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><HiMenu size={24} /></button>
          <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Properties Management</div>
        </div>

        <div className="dashboard-content" style={{ padding: "2rem" }}>
          <div className={s.headerContainer}>
            <div>
              <h1 className={s.pageTitle}>Properties Management</h1>
              <p className={s.pageSubtitle}>Review and manage all property listings</p>
            </div>
          </div>

          <div className="card-premium">
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}><HiOutlineLibrary color="#0d9488" /> All Properties ({properties.length})</h3>
              <div style={{ position: "relative", width: "300px", maxWidth: "100%" }}>
                <HiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                <input type="text" placeholder="Search by title or city..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", color: "#475569", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Property</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Location</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Price</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Status</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map(p => (
                      <tr key={p._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <img src={p.images?.[0] || "https://via.placeholder.com/150"} alt={p.title} style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "0.25rem" }} />
                            <div>
                              <div style={{ fontWeight: 600, color: "#1e293b", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                              <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Seller: {p.seller?.name || "Unknown"}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", color: "#64748b", fontSize: "0.9rem" }}>
                           <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><HiOutlineLocationMarker /> {p.city}</div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>
                          ₹{p.price.toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, background: p.status === "sale" ? "#dcfce7" : "#f1f5f9", color: p.status === "sale" ? "#166534" : "#475569" }}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button onClick={() => navigate(`/property/${p._id}`)} title="View Property" style={{ padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", background: "#fff", color: "#0d9488", cursor: "pointer", display: "flex" }}>
                              <HiOutlineEye size={16} />
                            </button>
                            <button onClick={() => handleDeleteProperty(p._id)} title="Delete Property" style={{ padding: "6px", borderRadius: "4px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex" }}>
                              <HiOutlineTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>No properties found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProperties;
