import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import SellerSidebar from "../../components/SellerSidebar.jsx";
import { sellerDashboardStyles as s } from "../../assets/dummyStyles.js";
import { HiOutlineEye, HiOutlineUserGroup, HiOutlineLibrary, HiOutlineCheckCircle, HiSearch, HiPencil, HiTrash, HiExternalLink, HiMenu } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "";

const SellerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({ totalViews: 0, totalInquiries: 0, activeListings: 0, soldProperties: 0 });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "seller") {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [propRes, inqRes] = await Promise.all([
          axios.get(`${API_URL}/api/property?seller=${user._id}`),
          axios.get(`${API_URL}/api/inquiry/seller`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const props = propRes.data.properties || [];
        setProperties(props);
        const inquiries = inqRes.data.inquiries || [];
        setRecentInquiries(inquiries.slice(0, 5));

        const views = props.reduce((sum, p) => sum + (p.views || 0), 0);
        const active = props.filter(p => p.status === "sale").length;
        const sold = props.filter(p => p.status === "sold").length;
        setStats({ totalViews: views, totalInquiries: inquiries.length, activeListings: active, soldProperties: sold });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`${API_URL}/api/property/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setProperties(properties.filter(p => p._id !== id));
      } catch (err) {
        alert("Failed to delete property");
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "sale" ? "sold" : "sale";
    try {
      await axios.patch(`${API_URL}/api/property/status/${id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      setProperties(properties.map(p => p._id === id ? { ...p, status: newStatus } : p));
      const active = properties.filter(p => (p._id === id ? newStatus : p.status) === "sale").length;
      const sold = properties.filter(p => (p._id === id ? newStatus : p.status) === "sold").length;
      setStats(prev => ({ ...prev, activeListings: active, soldProperties: sold }));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleExport = () => {
    const headers = ["Title", "Location", "Type", "Price", "Status", "Views"];
    const csvRows = properties.map((p) => [p.title, `${p.area}, ${p.city}`, p.propertyType, p.price, p.status, p.views || 0]);
    const csvContent = [headers, ...csvRows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "property_listings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

  const statCards = [
    { title: "Total Views", value: stats.totalViews.toLocaleString(), icon: HiOutlineEye, color: "#0d9488" },
    { title: "Active Leads", value: stats.totalInquiries.toLocaleString(), icon: HiOutlineUserGroup, color: "#0d9488" },
    { title: "Live Listings", value: stats.activeListings.toLocaleString(), icon: HiOutlineLibrary, color: "#0d9488" },
    { title: "Properties Sold", value: stats.soldProperties.toLocaleString(), icon: HiOutlineCheckCircle, color: "#0d9488" },
  ];

  const filteredProperties = properties.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.city.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <SellerSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="dashboard-main">
        <div className="dashboard-mobile-header" style={{ display: "none", padding: "1rem", background: "#fff", borderBottom: "1px solid #e2e8f0", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><HiMenu size={24} /></button>
          <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Dashboard</div>
        </div>
        <div className="dashboard-content" style={{ padding: "2rem" }}>
          <div className={s.header}>
            <div className={s.headerLeft}>
              <h1 className={s.headerTitle}>Welcome back, {user?.name.split(' ')[0]} 👋</h1>
              <p className={s.headerSubtitle}>Here's what's happening with your properties today.</p>
            </div>
            <div className={s.headerActions}>
              <button className={s.exportButton} onClick={handleExport}>Export Data</button>
              <Link to="/add-property" className={s.addButton}>+ Add New Property</Link>
            </div>
          </div>

          <div className={s.statsGrid}>
            {statCards.map((stat, idx) => (
              <div key={idx} className={s.statCard}>
                <div className={s.statIconWrapper} style={{ color: stat.color }}><stat.icon size={20} /></div>
                <div>
                  <div className={s.statTitle}>{stat.title}</div>
                  <div className={s.statValue}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={s.widgetsGrid}>
            <div className={s.inquiriesWidget}>
              <h3 className={s.widgetTitle}>Recent Inquiries</h3>
              <p className={s.widgetSubtitle}>Latest leads from interested buyers</p>
              {recentInquiries.length > 0 ? (
                <div className={s.inquiriesList}>
                  {recentInquiries.map((inq) => (
                    <div key={inq._id} className={s.inquiryItem}>
                      <div className={s.inquiryLeft}>
                        <div className={s.inquiryIcon}><HiOutlineUserGroup size={20} color="#0d9488" /></div>
                        <div>
                          <div className={s.inquiryName}>{inq.name}</div>
                          <div className={s.inquiryProperty}>{inq.property?.title}</div>
                        </div>
                      </div>
                      <div className={s.inquiryRight}>
                        <div className={s.inquiryDate}>{new Date(inq.createdAt).toLocaleDateString()}</div>
                        <span className={s.inquiryStatus(inq.status)}>{inq.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={s.noInquiries}>No recent inquiries</div>
              )}
            </div>

            <div className={s.tipsWidget}>
              <h3 className={s.widgetTitle}>Seller Success Tips</h3>
              <p className={s.widgetSubtitle}>Boost your property views and leads</p>
              <div className={s.tipsList}>
                <div className={s.tipCardHighViews}>
                  <div className={s.tipTitleHighViews}><HiOutlineEye /> High Quality Photos</div>
                  <div className={s.tipTextHighViews}>Listings with high-resolution photos get 40% more views.</div>
                </div>
                <div className={s.tipCardMarket}>
                  <div className={s.tipTitleMarket}>Market Pricing</div>
                  <div className={s.tipTextMarket}>Check local property rates to price your listing competitively.</div>
                </div>
              </div>
            </div>
          </div>

          <div className={s.listingsSection}>
            <div className={s.listingsHeader}>
              <h2 className={s.listingsTitle}>My Properties</h2>
              <div className={s.searchWrapper}>
                <HiSearch className={s.searchIcon} />
                <input type="text" placeholder="Search properties..." className={s.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            {filteredProperties.length > 0 ? (
              <div className={s.propertiesGrid}>
                {filteredProperties.map((property) => (
                  <div key={property._id} className="card-premium" style={{ width: "100%" }}>
                    <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                      <img src={property.images?.[0] || "https://via.placeholder.com/400x200?text=Property"} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span className={`badge ${property.status === "sale" ? "badge-sale" : "badge-rent"}`} style={{ position: "absolute", top: "12px", left: "12px" }}>{property.status}</span>
                    </div>
                    <div style={{ padding: "1.25rem" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{property.title}</h3>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>{property.area}, {property.city}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0d9488" }}>₹{property.price.toLocaleString("en-IN")}</div>
                        <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><HiOutlineEye /> {property.views || 0} views</div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => handleStatusChange(property._id, property.status)} className={s.statusButton(property.status)} title="Toggle Status">
                          {property.status === "sale" ? "Mark Sold" : "Re-list"}
                        </button>
                        <Link to={`/edit-property/${property._id}`} className={s.editButton}><HiPencil /></Link>
                        <button onClick={() => handleDelete(property._id)} className={s.deleteButton}><HiTrash /></button>
                        <Link to={`/property/${property._id}`} className={s.viewButton}><HiExternalLink /></Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={s.emptyListings}>No properties found matching your search.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
