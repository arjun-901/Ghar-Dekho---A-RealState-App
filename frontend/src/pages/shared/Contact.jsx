import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import { contactStyles as s } from "../../assets/dummyStyles.js";
import { HiMail, HiPhone, HiLocationMarker, HiCheckCircle } from "react-icons/hi";
const API_URL = import.meta.env.VITE_API_URL || "";

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", message: "", role: user?.role || "buyer" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await axios.post(`${API_URL}/api/contact`, formData);
      setSuccess(true);
    } catch (err) { setError(err.response?.data?.message || "Failed to send"); }
    finally { setLoading(false); }
  };

  return (
    <div className={s.container}>
      <div className={s.mainContainer}>
        <div className={s.header}>
          <h1 className={s.heading}>Get In Touch</h1>
          <p className={s.subheading}>Have questions? We'd love to hear from you.</p>
        </div>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="card-premium" style={{ padding: "2.5rem" }}>
            {success ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <HiCheckCircle size={48} color="#0d9488" />
                <h3 style={{ margin: "1rem 0" }}>Message Sent!</h3>
                <p style={{ color: "#64748b" }}>We'll get back to you soon.</p>
                <button className="btn btn-primary" style={{ marginTop: "1.5rem" }} onClick={() => setSuccess(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {error && <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem" }}>{error}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Name</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className={s.input} /></div>
                  <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className={s.input} /></div>
                </div>
                <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={s.input} /></div>
                <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Message</label>
                  <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required rows={5} className={s.input} style={{ resize: "none" }} /></div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>{loading ? "Sending..." : "Send Message"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;