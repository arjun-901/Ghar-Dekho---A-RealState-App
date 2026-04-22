import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "seller" ? "/dashboard" : "/");
    } catch (err) { setError(err.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", paddingTop: "80px" }}>
      <div className="card-premium" style={{ padding: "3rem", width: "100%", maxWidth: "440px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Create Account</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "2rem" }}>Join ReeState today</p>
        {error && <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem", marginBottom: "1rem" }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={6} style={inputStyle} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>{showPassword ? "Hide" : "Show"}</button>
            </div></div>
          <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>I am a</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{...inputStyle, cursor: "pointer"}}>
              <option value="buyer">Buyer</option><option value="seller">Seller</option></select></div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "0.85rem" }}>{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#64748b" }}>Already have an account? <a href="/login" style={{ color: "#0d9488", fontWeight: 600 }}>Login</a></p>
      </div>
    </div>
  );
};
export default Register;