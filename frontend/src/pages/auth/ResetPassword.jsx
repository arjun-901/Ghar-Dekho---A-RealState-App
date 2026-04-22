import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    try {
      await axios.put(`${API_URL}/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) { setError(err.response?.data?.message || "Reset failed"); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div className="card-premium" style={{ padding: "3rem", width: "100%", maxWidth: "440px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Reset Password</h2>
        {success ? <p style={{ textAlign: "center", color: "#10b981" }}>Password reset! Redirecting to login...</p> : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {error && <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem" }}>{error}</div>}
            <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>New Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>{showPassword ? "Hide" : "Show"}</button>
              </div></div>
            <div><label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>{showConfirmPassword ? "Hide" : "Show"}</button>
              </div></div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>{loading ? "Resetting..." : "Reset Password"}</button>
          </form>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;