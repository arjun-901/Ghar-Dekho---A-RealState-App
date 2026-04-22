import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import { adminDashboardStyles as s } from "../../assets/dummyStyles.js";
import { HiOutlineUserGroup, HiOutlineLibrary, HiOutlineTicket, HiOutlineCheckCircle, HiMenu, HiRefresh } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, activeListings: 0, soldProperties: 0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchStats();
  }, [token, user, navigate]);

  if (loading && !stats.totalUsers) return <div className="loader-full-page"><div className="loader"></div></div>;

  const statCards = [
    { title: "Total Users", value: stats.totalUsers || 0, icon: HiOutlineUserGroup, color: "#0d9488", bg: "#ccfbf1" },
    { title: "Total Properties", value: stats.totalProperties || 0, icon: HiOutlineLibrary, color: "#f59e0b", bg: "#fef3c7" },
    { title: "Active Listings", value: stats.activeListings || 0, icon: HiOutlineTicket, color: "#3b82f6", bg: "#dbeafe" },
    { title: "Sold Properties", value: stats.soldProperties || 0, icon: HiOutlineCheckCircle, color: "#10b981", bg: "#dcfce7" },
  ];

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="dashboard-main">
        <div className="dashboard-mobile-header" style={{ display: "none", padding: "1rem", background: "#fff", borderBottom: "1px solid #e2e8f0", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><HiMenu size={24} /></button>
          <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Admin Dashboard</div>
        </div>

        <div className="dashboard-content" style={{ padding: "2rem" }}>
          <div className={s.headerContainer}>
            <div>
              <h1 className={s.pageTitle}>Platform Overview</h1>
              <p className={s.pageSubtitle}>Monitor key metrics and platform health</p>
            </div>
            <button className={s.refreshButton} onClick={fetchStats}><HiRefresh /> Refresh Stats</button>
          </div>

          <div className={s.statsGrid}>
            {statCards.map((stat, idx) => (
              <div key={idx} className={s.statCard}>
                <div className={s.statIconContainer} style={{ background: stat.bg, color: stat.color }}><stat.icon size={24} /></div>
                <div>
                  <div className={s.statTitle}>{stat.title}</div>
                  <div className={s.statValue}>{stat.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={s.secondGrid}>
            <div className={s.systemHealthCard}>
              <h3 className={s.systemHealthTitle}>System Health</h3>
              <div className={s.servicesContainer}>
                {["Database", "Media Storage", "Auth Service", "API Gateway"].map((service, i) => (
                  <div key={i} className={s.serviceItem}>
                    <div className={s.serviceName}>{service}</div>
                    <div className={s.statusContainer}>
                      <div className={s.statusDot}></div>
                      <div className={s.statusText}>Operational</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.adminToolsCard}>
              <h3 className={s.adminToolsTitle}>Quick Tools</h3>
              <p className={s.adminToolsDesc}>Common administrative actions</p>
              <div className={s.adminToolsButtonsContainer}>
                <Link to="/admin/users" className={s.adminToolButton}>Manage Users</Link>
                <Link to="/admin/properties" className={s.adminToolButton}>Review Listings</Link>
                <Link to="/admin/contacts" className={s.adminToolButton}>View Inbox</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
