import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import { HiOutlineHome, HiOutlineChatAlt2, HiOutlineHeart, HiOutlineUser } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "";

const BuyerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== "buyer") {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/inquiry/buyer`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInquiries(res.data.inquiries || []);
      } catch (err) {
        console.error("Failed to fetch buyer inquiries", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user, navigate]);

  if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingTop: "80px", paddingBottom: "40px" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", borderRadius: "20px", padding: "3rem", color: "#fff", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.4)" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Hello, {user?.name.split(" ")[0]}! 👋</h1>
            <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>Welcome to your EstateX Buyer Dashboard.</p>
          </div>
          <Link to="/properties" className="btn btn-outline" style={{ background: "#fff", color: "#0d9488", border: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}>
            Explore Properties
          </Link>
        </div>

        <div className="buyer-dashboard-grid" style={{ display: "grid", gap: "2rem" }}>
          
          {/* Sidebar Navigation */}
          <div className="card-premium" style={{ padding: "1.5rem", height: "fit-content" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "1.5rem", paddingLeft: "0.5rem" }}>Quick Links</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link to="/buyer-dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#f0fdfa", color: "#0d9488", borderRadius: "12px", fontWeight: 600, textDecoration: "none" }}>
                <HiOutlineHome size={20} /> My Dashboard
              </Link>
              <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", color: "#64748b", borderRadius: "12px", fontWeight: 500, textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={(e) => {e.target.style.background = "#f1f5f9"; e.target.style.color = "#0f172a";}} onMouseLeave={(e) => {e.target.style.background = "transparent"; e.target.style.color = "#64748b";}}>
                <HiOutlineUser size={20} /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div className="card-premium" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ background: "#f0fdfa", color: "#0d9488", padding: "1rem", borderRadius: "16px" }}>
                  <HiOutlineChatAlt2 size={32} />
                </div>
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{inquiries.length}</div>
                  <div style={{ color: "#64748b", fontWeight: 500, marginTop: "0.25rem" }}>Total Inquiries Sent</div>
                </div>
              </div>
            </div>

            {/* Inquiries Section */}
            <div className="card-premium" style={{ padding: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "1.5rem" }}>My Recent Inquiries</h2>
              
              {inquiries.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {inquiries.map((inq) => (
                    <div key={inq._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", border: "1px solid #e2e8f0", borderRadius: "16px", transition: "all 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0d9488"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}>
                      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                        <img src={inq.property?.images?.[0] || "https://via.placeholder.com/100"} alt="Property" style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover" }} />
                        <div>
                          <Link to={`/property/${inq.property?._id}`} style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>{inq.property?.title}</Link>
                          <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem" }}>{inq.property?.city} • ₹{inq.property?.price?.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.5rem" }}>Contacted Seller: {inq.seller?.name}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>{new Date(inq.createdAt).toLocaleDateString()}</div>
                        <div style={{ display: "inline-block", marginTop: "0.5rem", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, background: inq.status === "new" ? "#fef3c7" : "#dcfce7", color: inq.status === "new" ? "#d97706" : "#166534" }}>
                          {inq.status === "new" ? "Pending" : "Responded"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem", background: "#f8fafc", borderRadius: "16px" }}>
                  <HiOutlineChatAlt2 size={48} color="#cbd5e1" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ fontSize: "1.2rem", color: "#475569", marginBottom: "0.5rem" }}>No inquiries yet</h3>
                  <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Start exploring properties and contact sellers to see your inquiries here.</p>
                  <Link to="/properties" className="btn btn-primary">Browse Properties</Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
