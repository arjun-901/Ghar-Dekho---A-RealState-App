import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import { profileStyles as s } from "../../assets/dummyStyles.js";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCamera, HiBadgeCheck, HiOutlineKey } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "";

const Profile = () => {
  const { user, token, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewPic, setPreviewPic] = useState(user?.profilePic || "");

  if (!user) return <div style={{ paddingTop: "80px", textAlign: "center" }}>Please login to view profile</div>;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
      setPreviewPic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      if (profilePicFile) data.append("profilePic", profilePicFile);

      const res = await axios.put(`${API_URL}/api/auth/update-profile`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setUser(res.data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.pageContainer} style={{ paddingTop: "80px", minHeight: "100vh", background: "#f8fafc" }}>
      <div className={s.innerContainer} style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#0f172a" }}>My Profile</h1>
        
        <div className="card-premium" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", padding: "2rem", background: "#fff", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
          {/* Left Column - Avatar & Summary */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid #e2e8f0", paddingRight: "2rem" }}>
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <img src={previewPic || `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff&size=150`} alt="Profile" style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)" }} />
              <label style={{ position: "absolute", bottom: 0, right: "10px", background: "#0d9488", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
                <HiOutlineCamera size={20} />
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            </div>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>{user.name}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", marginBottom: "1rem" }}>
              {user.role === 'seller' ? <span style={{ background: "#e0e7ff", color: "#4338ca", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Seller</span> : <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 600 }}>Buyer</span>}
              {user.isApproved && user.role === 'seller' && <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "2px", fontSize: "0.85rem" }}><HiBadgeCheck /> Verified</span>}
            </div>
            <div style={{ width: "100%", background: "#f8fafc", padding: "1rem", borderRadius: "0.5rem", marginTop: "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "0.9rem", marginBottom: "0.5rem" }}><HiOutlineMail /> {user.email}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "0.9rem" }}><HiOutlineKey /> Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div>
            <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>Personal Information</h3>
            {error && <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.5rem", marginBottom: "1rem" }}>{error}</div>}
            {success && <div style={{ padding: "0.75rem", background: "#dcfce7", color: "#166534", borderRadius: "0.5rem", marginBottom: "1rem" }}>Profile updated successfully!</div>}
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#334155" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <HiOutlineUser style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#334155" }}>Phone Number</label>
                <div style={{ position: "relative" }}>
                  <HiOutlinePhone style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 9876543210" style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#334155" }}>Address</label>
                <div style={{ position: "relative" }}>
                  <HiOutlineLocationMarker style={{ position: "absolute", left: "12px", top: "12px", color: "#94a3b8" }} size={20} />
                  <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Your full address..." rows={3} style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box", resize: "none" }} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: "1rem", padding: "0.75rem" }}>
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;