import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineViewGrid, HiCollection, HiCalendar, HiBadgeCheck, HiChatAlt, HiHeart, HiOutlineHeart, HiLocationMarker } from "react-icons/hi";
const API_URL = import.meta.env.VITE_API_URL || "";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiry, setInquiry] = useState({ message: "" });
  const [inquiryStatus, setInquiryStatus] = useState({ loading: false, success: false, error: null });
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/property/${id}`);
        setProperty(res.data.property);
        if (token) {
          const wRes = await axios.get(`${API_URL}/api/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
          setIsInWishlist((wRes.data.wishlist || []).some(w => (w._id || w) === id));
        }
      } catch { setError("Property not found"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, token]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault(); setInquiryStatus({ loading: true, success: false, error: null });
    try {
      await axios.post(`${API_URL}/api/inquiry`, { propertyId: id, sellerId: property.seller._id, name: user.name, email: user.email, phone: user.phone, message: inquiry.message }, { headers: { Authorization: `Bearer ${token}` } });
      setInquiryStatus({ loading: false, success: true, error: null }); setInquiry({ message: "" });
    } catch (err) { setInquiryStatus({ loading: false, success: false, error: "Failed to send" }); }
  };

  const handleChatStart = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await axios.post(`${API_URL}/api/chat/start`, { propertyId: id, sellerId: property.seller._id }, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/chat-messages");
    } catch {}
  };

  const toggleWishlist = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await axios.post(`${API_URL}/api/wishlist/toggle/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setIsInWishlist(!isInWishlist);
    } catch {}
  };

  if (loading) return <div className="loader-full-page"><div className="loader" /></div>;
  if (error || !property) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}><div className="card-premium" style={{ padding: "3rem", textAlign: "center" }}><h2>{error || "Not found"}</h2><Link to="/properties" className="btn btn-primary" style={{ marginTop: "1rem" }}>Browse Properties</Link></div></div>;

  const formattedPrice = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(property.price);
  const stats = [
    { label: "Bedrooms", value: property.bhk || "N/A", icon: HiOutlineHome },
    { label: "Bathrooms", value: property.bathrooms || Math.max(1, (parseInt(property.bhk) || 1) - 1), icon: HiOutlineUserGroup },
    { label: "Furnishing", value: property.furnishing || "N/A", icon: HiCollection },
    { label: "Area", value: `${property.areaSize || "N/A"} sqft`, icon: HiOutlineViewGrid },
    { label: "Type", value: property.propertyType, icon: HiCalendar },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "90px", paddingBottom: "3rem" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Images */}
        <div style={{ display: "grid", gridTemplateColumns: property.images?.length > 1 ? "2fr 1fr" : "1fr", gap: "0.5rem", borderRadius: "1.5rem", overflow: "hidden", marginBottom: "2rem", maxHeight: "400px" }}>
          {property.images?.slice(0, 3).map((img, i) => (
            <img key={i} src={img} alt={property.title} onClick={() => setLightboxIndex(i)}
              style={{ width: "100%", height: i === 0 ? "400px" : "198px", objectFit: "cover", cursor: "pointer", gridRow: i === 0 ? "1 / 3" : "auto" }} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
          {/* Left Content */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
              <div>
                <span className={`badge ${property.status === "sale" ? "badge-sale" : "badge-rent"}`} style={{ marginBottom: "0.5rem", display: "inline-block" }}>For {property.status}</span>
                <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{property.title}</h1>
                <p style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><HiLocationMarker /> {property.area}, {property.city} - {property.pincode}</p>
              </div>
              <button onClick={toggleWishlist} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem" }}>
                {isInWishlist ? <HiHeart color="#ef4444" size={28} /> : <HiOutlineHeart color="#64748b" size={28} />}
              </button>
            </div>

            {/* Stats */}
            <div className="card-premium" style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
              {stats.map((st, i) => (<div key={i} style={{ textAlign: "center" }}><st.icon size={22} color="#0d9488" /><div style={{ fontWeight: 700, margin: "0.25rem 0" }}>{st.value}</div><div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{st.label}</div></div>))}
            </div>

            {/* Description */}
            <div className="card-premium" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>Description</h3>
              <p style={{ color: "#475569", lineHeight: 1.7 }}>{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="card-premium" style={{ padding: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Amenities</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  {property.amenities.map((a, i) => (<span key={i} style={{ padding: "0.5rem 1rem", borderRadius: "2rem", background: "#f0fdfa", color: "#0d9488", fontWeight: 600, fontSize: "0.85rem" }}>{a}</span>))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="card-premium" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0d9488", marginBottom: "1rem" }}>{formattedPrice}</div>
              {/* Seller */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "1rem", marginBottom: "1rem" }}>
                <img src={property.seller?.profilePic || `https://ui-avatars.com/api/?name=${property.seller?.name || "Seller"}&background=0d6e59&color=fff`} alt="Seller" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <h4 style={{ margin: 0 }}>{property.seller?.name || "Seller"}</h4>
                  <div style={{ fontSize: "0.8rem", color: "#0d9488", display: "flex", alignItems: "center", gap: "4px" }}><HiBadgeCheck /> Verified</div>
                </div>
              </div>
              <button onClick={handleChatStart} className="btn btn-outline" style={{ width: "100%", marginBottom: "1rem" }}><HiChatAlt /> Chat with Seller</button>

              {/* Inquiry Form */}
              <h4 style={{ marginBottom: "0.75rem" }}>Send Inquiry</h4>
              {user?.role === "buyer" ? (
                <form onSubmit={handleInquirySubmit}>
                  <textarea placeholder="Your Message..." value={inquiry.message} onChange={e => setInquiry({ message: e.target.value })} required rows={4}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", resize: "none", outline: "none", marginBottom: "0.75rem", boxSizing: "border-box" }} />
                  <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={inquiryStatus.loading}>{inquiryStatus.loading ? "Sending..." : "Send Inquiry"}</button>
                  {inquiryStatus.success && <p style={{ color: "#10b981", marginTop: "0.5rem", textAlign: "center" }}>Inquiry sent!</p>}
                </form>
              ) : (
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{user ? "Only buyers can send inquiries." : "Please login as a buyer."}{!user && <Link to="/login" className="btn btn-primary" style={{ display: "block", marginTop: "0.5rem", textAlign: "center" }}>Login</Link>}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div onClick={() => setLightboxIndex(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={property.images[lightboxIndex]} alt="" style={{ maxWidth: "90%", maxHeight: "90%" }} />
        </div>
      )}
    </div>
  );
};
export default PropertyDetails;
