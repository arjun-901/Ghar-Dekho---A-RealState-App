import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      login(res.data.user, res.data.token);
      if (res.data.user.role === "admin") navigate("/admin-dashboard");
      else if (res.data.user.role === "seller") navigate("/dashboard");
      else navigate("/");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", paddingTop: "80px" }}>
      <div className="card-premium" style={{ padding: "3rem", width: "100%", maxWidth: "440px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Welcome Back</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "2rem" }}>Login to your account</p>
        {error && <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem", marginBottom: "1rem" }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} /></div>
          <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>{showPassword ? "Hide" : "Show"}</button>
            </div></div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "0.85rem" }}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#64748b" }}>Don't have an account? <a href="/register" style={{ color: "#0d9488", fontWeight: 600 }}>Sign Up</a></p>
      </div>
    </div>
  );
};
export default Login;