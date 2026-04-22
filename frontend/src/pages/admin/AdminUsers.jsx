import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import { adminDashboardStyles as s } from "../../assets/dummyStyles.js";
import { HiOutlineUserAdd, HiOutlineBan, HiOutlineTrash, HiSearch, HiMenu } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "";

const AdminUsers = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    const fetchUsers = async () => {
      try {
        const [usersRes, sellersRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/admin/seller-requests`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setUsers(usersRes.data.users);
        setSellerRequests(sellersRes.data.sellers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token, user, navigate]);

  const handleBlockUser = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/api/admin/users/${id}/block`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: res.data.user.isBlocked } : u));
    } catch (err) { alert("Failed to update user status"); }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user permanently? This action cannot be undone.")) {
      try {
        await axios.delete(`${API_URL}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(users.filter(u => u._id !== id));
      } catch (err) { alert("Failed to delete user"); }
    }
  };

  const handleApproveSeller = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/api/admin/approve-seller/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setSellerRequests(sellerRequests.filter(s => s._id !== id));
      setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
    } catch (err) { alert("Failed to approve seller"); }
  };

  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="dashboard-main">
        <div className="dashboard-mobile-header" style={{ display: "none", padding: "1rem", background: "#fff", borderBottom: "1px solid #e2e8f0", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><HiMenu size={24} /></button>
          <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>User Management</div>
        </div>

        <div className="dashboard-content" style={{ padding: "2rem" }}>
          <div className={s.headerContainer}>
            <div>
              <h1 className={s.pageTitle}>User Management</h1>
              <p className={s.pageSubtitle}>Manage platform users and approve seller requests</p>
            </div>
          </div>

          {/* Seller Requests Section */}
          {sellerRequests.length > 0 && (
            <div className="card-premium" style={{ padding: "1.5rem", marginBottom: "2rem", background: "#fffbf0", border: "1px solid #fef08a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <HiOutlineUserAdd size={24} color="#d97706" />
                <h3 style={{ margin: 0, color: "#92400e" }}>Pending Seller Approvals ({sellerRequests.length})</h3>
              </div>
              <div style={{ display: "grid", gap: "1rem" }}>
                {sellerRequests.map(seller => (
                  <div key={seller._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "#fff", borderRadius: "0.5rem", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{seller.name}</div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{seller.email} • {seller.phone || "No phone"}</div>
                    </div>
                    <button onClick={() => handleApproveSeller(seller._id)} className="btn btn-primary" style={{ background: "#10b981", border: "none", padding: "6px 16px" }}>Approve Seller</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Users Section */}
          <div className="card-premium">
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>All Registered Users</h3>
              <div style={{ position: "relative", width: "300px" }}>
                <HiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", color: "#475569", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>User</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Role</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Joined</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Status</th>
                    <th style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(u => (
                      <tr key={u._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ fontWeight: 600, color: "#1e293b" }}>{u.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{u.email}</div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span style={{ padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600, background: u.role === "admin" ? "#fce7f3" : u.role === "seller" ? "#e0e7ff" : "#f1f5f9", color: u.role === "admin" ? "#be185d" : u.role === "seller" ? "#4338ca" : "#475569" }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", color: "#64748b", fontSize: "0.9rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          {u.isBlocked ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#ef4444", fontSize: "0.85rem", fontWeight: 600 }}><HiOutlineBan size={14} /> Blocked</span>
                          ) : (
                            <span style={{ color: "#10b981", fontSize: "0.85rem", fontWeight: 600 }}>Active</span>
                          )}
                        </td>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {u.role !== "admin" && (
                              <>
                                <button onClick={() => handleBlockUser(u._id)} title={u.isBlocked ? "Unblock User" : "Block User"} style={{ padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", background: u.isBlocked ? "#f8fafc" : "#fff", color: u.isBlocked ? "#10b981" : "#f59e0b", cursor: "pointer", display: "flex" }}>
                                  <HiOutlineBan size={16} />
                                </button>
                                <button onClick={() => handleDeleteUser(u._id)} title="Delete User" style={{ padding: "6px", borderRadius: "4px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex" }}>
                                  <HiOutlineTrash size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>No users found matching your search.</td>
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

export default AdminUsers;