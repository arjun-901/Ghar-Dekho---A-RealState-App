import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import PropertyCard from "../../components/common/PropertyCard.jsx";
import { propertiesStyles as s } from "../../assets/dummyStyles.js";
import { HiAdjustments, HiX } from "react-icons/hi";
const API_URL = import.meta.env.VITE_API_URL || "";

const Properties = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "", propertyType: searchParams.get("propertyType") ? [searchParams.get("propertyType")] : [],
    bhk: "", maxPrice: 100000000, amenities: [], furnishing: [], sort: "latest",
  });

  const propertyTypes = [
    { label: "Flat/Apartment", value: "flat" }, { label: "Villa/House", value: "villa" },
    { label: "Penthouse", value: "penthouse" }, { label: "Commercial", value: "commercial" },
  ];
  const bhkOptions = ["1", "2", "3", "4", "5+"];
  const furnishingOptions = [
    { label: "Furnished", value: "furnished" }, { label: "Semi-Furnished", value: "semi-furnished" }, { label: "Unfurnished", value: "unfurnished" },
  ];

  const fetchTimer = useRef(null);

  const fetchProperties = async (f) => {
    try { setLoading(true);
      const params = new URLSearchParams();
      if (f.city) params.append("city", f.city);
      if (f.propertyType.length > 0) params.append("propertyType", f.propertyType.join(","));
      if (f.bhk) params.append("bhk", f.bhk);
      if (f.maxPrice) params.append("maxPrice", f.maxPrice);
      if (f.furnishing?.length > 0) params.append("furnishing", f.furnishing.join(","));
      if (f.sort) params.append("sort", f.sort);
      const res = await axios.get(`${API_URL}/api/property?${params.toString()}`);
      setProperties(res.data.properties); setError(null);
    } catch { setError("Failed to load properties."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(filters); }, []);
  useEffect(() => {
    if (token) {
      axios.get(`${API_URL}/api/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setWishlistedIds((res.data.wishlist || []).map(w => w._id || w))).catch(() => {});
    }
  }, [token]);

  const handleCheckboxChange = (category, value) => {
    const current = [...(filters[category] || [])];
    const idx = current.indexOf(value);
    if (idx === -1) current.push(value); else current.splice(idx, 1);
    const updated = { ...filters, [category]: current }; setFilters(updated); fetchProperties(updated);
  };
  const handlePriceChange = (e) => {
    const updated = { ...filters, maxPrice: parseInt(e.target.value) }; setFilters(updated);
    if (fetchTimer.current) clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => fetchProperties(updated), 500);
  };
  const handleBhkSelect = (v) => { const updated = { ...filters, bhk: filters.bhk === v ? "" : v }; setFilters(updated); fetchProperties(updated); };
  const handleSortChange = (e) => { const updated = { ...filters, sort: e.target.value }; setFilters(updated); fetchProperties(updated); };
  const resetFilters = () => {
    const reset = { city: "", propertyType: [], bhk: "", maxPrice: 100000000, amenities: [], furnishing: [], sort: "latest" };
    setFilters(reset); navigate("/properties"); fetchProperties(reset);
  };
  const handleToggleWishlist = async (id) => {
    if (!token) return navigate("/login");
    try { const res = await axios.post(`${API_URL}/api/wishlist/toggle/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setWishlistedIds(res.data.wishlist.map(w => w._id || w)); } catch {}
  };

  return (
    <div className={s.pageContainer}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem" }}>
          {/* Sidebar Filters */}
          <div className="card-premium" style={{ padding: "1.5rem", height: "fit-content", position: "sticky", top: "90px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0 }}>Filters</h3>
              <button onClick={resetFilters} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", fontWeight: 600 }}>Reset</button>
            </div>
            {/* City */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.85rem" }}>City</label>
              <input value={filters.city} onChange={e => { const u = {...filters, city: e.target.value}; setFilters(u); if(fetchTimer.current) clearTimeout(fetchTimer.current); fetchTimer.current = setTimeout(() => fetchProperties(u), 500); }}
                placeholder="Search city..." style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box" }} />
            </div>
            {/* Property Type */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.85rem" }}>Property Type</label>
              {propertyTypes.map(pt => (
                <label key={pt.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={filters.propertyType.includes(pt.value)} onChange={() => handleCheckboxChange("propertyType", pt.value)} style={{ accentColor: "#0d9488" }} /> {pt.label}
                </label>
              ))}
            </div>
            {/* BHK */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.85rem" }}>BHK</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {bhkOptions.map(b => (
                  <button key={b} onClick={() => handleBhkSelect(b)} style={{ padding: "0.4rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", background: filters.bhk === b ? "#0d9488" : "#fff", color: filters.bhk === b ? "#fff" : "#334155", cursor: "pointer", fontWeight: 600 }}>{b}</button>
                ))}
              </div>
            </div>
            {/* Price */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label style={{ fontWeight: 600, fontSize: "0.85rem" }}>Price Range</label>
                <span style={{ fontSize: "0.8rem", color: "#0d9488", fontWeight: 600 }}>{filters.maxPrice >= 10000000 ? `₹${(filters.maxPrice/10000000).toFixed(2)} Cr` : `₹${(filters.maxPrice/100000).toFixed(1)} L`}</span>
              </div>
              <input type="range" min="100000" max="100000000" step="500000" value={filters.maxPrice} onChange={handlePriceChange} style={{ width: "100%", accentColor: "#0d9488" }} />
            </div>
            {/* Furnishing */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.85rem" }}>Furnishing</label>
              {furnishingOptions.map(fo => (
                <label key={fo.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={(filters.furnishing||[]).includes(fo.value)} onChange={() => handleCheckboxChange("furnishing", fo.value)} style={{ accentColor: "#0d9488" }} /> {fo.label}
                </label>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <p style={{ color: "#64748b" }}>{properties.length} properties found</p>
              <select value={filters.sort} onChange={handleSortChange} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", outline: "none" }}>
                <option value="latest">Latest</option><option value="priceLow">Price: Low to High</option><option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
            {loading ? <div className="loader-container"><div className="loader" /></div> :
              error ? <div className="card-premium" style={{ padding: "3rem", textAlign: "center", color: "#dc2626" }}>{error}</div> :
              properties.length === 0 ? <div className="card-premium" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>No properties found</div> :
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {properties.map(p => <PropertyCard key={p._id} property={p} isWishlisted={wishlistedIds.includes(String(p._id))} onToggleWishlist={handleToggleWishlist} />)}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default Properties;
