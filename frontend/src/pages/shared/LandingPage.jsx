import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import {
  HiSearch, HiOfficeBuilding, HiHome, HiShieldCheck,
  HiLightningBolt, HiCurrencyDollar, HiVideoCamera,
  HiMail, HiPhone, HiLocationMarker, HiArrowRight, HiHeart
} from "react-icons/hi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "";

/* ─── PREMIUM ROTATING IMAGES ─── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
];

const LandingPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [properties, setProperties] = useState([]);
  const [propertyCounts, setPropertyCounts] = useState({});
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  /* Auto-Rotate Hero Images */
  useEffect(() => {
    const timer = setInterval(() => setCurrentImg(prev => (prev + 1) % HERO_IMAGES.length), 3500);
    return () => clearInterval(timer);
  }, []);

  /* Fetch Data */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, countRes] = await Promise.all([
          axios.get(`${API_URL}/api/property`),
          axios.get(`${API_URL}/api/property/stats/counts`)
        ]);
        setProperties(propRes.data.properties || []);
        setPropertyCounts(countRes.data.counts || {});
        
        if (token) {
          try {
            const wishRes = await axios.get(`${API_URL}/api/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
            setWishlistedIds((wishRes.data.wishlist || []).map((w) => w._id || w));
          } catch (wishErr) {
            console.error("Failed to fetch wishlist:", wishErr);
          }
        }
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (propertyType) params.append("propertyType", propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const handleToggleWishlist = async (id, e) => {
    e.stopPropagation();
    if (!token) return navigate("/login");
    try {
      const res = await axios.post(`${API_URL}/api/wishlist/toggle/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setWishlistedIds(res.data.wishlist.map((w) => w._id || w));
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    { name: "Modern Flats", icon: <HiOfficeBuilding size={28} />, type: "flat", count: propertyCounts.flat || 0, color: "#3b82f6", bg: "#eff6ff" },
    { name: "Luxury Villas", icon: <HiHome size={28} />, type: "villa", count: propertyCounts.villa || 0, color: "#10b981", bg: "#ecfdf5" },
    { name: "Penthouses", icon: <HiOfficeBuilding size={28} />, type: "penthouse", count: propertyCounts.penthouse || 0, color: "#8b5cf6", bg: "#f5f3ff" },
    { name: "Commercial", icon: <HiOfficeBuilding size={28} />, type: "commercial", count: propertyCounts.commercial || 0, color: "#f59e0b", bg: "#fffbeb" },
  ];

  const features = [
    { title: "Verified Listings", desc: "Every property is strictly audited for ownership and quality.", icon: <HiShieldCheck size={26} />, color: "#4f46e5" },
    { title: "AI Matchmaking", desc: "Our algorithm finds the perfect home tailored to your lifestyle.", icon: <HiLightningBolt size={26} />, color: "#e11d48" },
    { title: "Zero Commission", desc: "Connect directly with owners and save big on brokerage fees.", icon: <HiCurrencyDollar size={26} />, color: "#059669" },
    { title: "3D Virtual Tours", desc: "Experience properties in immersive high-definition 3D.", icon: <HiVideoCamera size={26} />, color: "#d97706" },
  ];

  const sortedProperties = [...properties].filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  const formatPrice = (n) => {
    if (!n) return "On Request";
    if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + " L";
    return "₹" + n.toLocaleString();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        :root {
          --primary: #4f46e5;
          --primary-dark: #3730a3;
          --dark: #0f172a;
          --light: #f8fafc;
          --gray: #64748b;
        }

        body { font-family: 'Outfit', sans-serif; background: var(--light); color: var(--dark); overflow-x: hidden; }
        * { box-sizing: border-box; }
        
        .container-xl { max-width: 1400px; margin: 0 auto; padding: 0 5%; }

        /* HERO SECTION */
        .hero-section {
          padding-top: 140px; padding-bottom: 80px;
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px;
          align-items: center; min-height: 100vh;
        }
        
        .hero-title {
          font-size: clamp(3rem, 5vw, 4.5rem); font-weight: 800; line-height: 1.1;
          margin-bottom: 24px; color: var(--dark); letter-spacing: -0.03em;
        }
        .hero-title span {
          background: linear-gradient(135deg, var(--primary), #ec4899);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        
        .hero-desc {
          font-size: 1.1rem; color: var(--gray); line-height: 1.6; margin-bottom: 40px; max-width: 500px;
        }

        /* SEARCH BAR */
        .search-glass {
          background: #fff; padding: 16px; border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08);
          display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
        }
        .search-input-group {
          flex: 1; min-width: 200px; padding: 12px 20px;
          background: var(--light); border-radius: 16px;
          display: flex; align-items: center; gap: 12px;
          transition: all 0.3s; border: 1px solid transparent;
        }
        .search-input-group:focus-within { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 4px rgba(79,70,229,0.1); }
        .search-input-group input, .search-input-group select {
          border: none; background: transparent; outline: none; font-family: inherit; font-size: 1rem; width: 100%; color: var(--dark); font-weight: 500;
        }
        .search-btn {
          background: var(--primary); color: #fff; padding: 16px 32px; border-radius: 16px; font-weight: 600;
          border: none; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; font-family: inherit; font-size: 1rem;
        }
        .search-btn:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(79,70,229,0.3); }

        /* ROTATING IMAGES */
        .hero-images-wrapper {
          position: relative; width: 100%; height: 600px;
          border-radius: 40px; overflow: hidden;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.25);
        }
        .hero-image {
          width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0;
        }
        .floating-badge {
          position: absolute; bottom: 40px; left: -30px; background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px); padding: 20px 30px; border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1); z-index: 10;
          display: flex; align-items: center; gap: 16px;
        }

        /* CATEGORIES */
        .section-padding { padding: 100px 0; }
        .section-title { font-size: 2.5rem; font-weight: 800; color: var(--dark); margin-bottom: 16px; letter-spacing: -0.02em; }
        .section-subtitle { color: var(--gray); font-size: 1.1rem; margin-bottom: 60px; max-width: 600px; }
        
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
        .cat-card {
          background: #fff; padding: 40px 30px; border-radius: 24px;
          text-align: center; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0,0,0,0.03); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }
        .cat-card:hover { transform: translateY(-10px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08); border-color: rgba(79,70,229,0.2); }
        .cat-icon {
          width: 70px; height: 70px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; transition: transform 0.3s;
        }
        .cat-card:hover .cat-icon { transform: scale(1.1) rotate(5deg); }

        /* PROPERTIES GRID (NEW TALL ASPECT RATIO) */
        .prop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
        .prop-card {
          background: #fff; border-radius: 28px; overflow: hidden;
          transition: all 0.4s; position: relative; border: 1px solid rgba(0,0,0,0.04);
        }
        .prop-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1); }
        
        /* TALL IMAGE */
        .prop-img-box { position: relative; height: 380px; overflow: hidden; padding: 12px 12px 0 12px; }
        .prop-img { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; transition: transform 0.7s ease; }
        .prop-card:hover .prop-img { transform: scale(1.05); }
        
        .wishlist-btn {
          position: absolute; top: 24px; right: 24px; width: 44px; height: 44px;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.2s; z-index: 10;
        }
        .wishlist-btn:hover { transform: scale(1.1); }

        .prop-content { padding: 24px; }
        .prop-price { font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 8px; letter-spacing: -0.02em; }
        .prop-title { font-size: 1.2rem; font-weight: 600; color: var(--dark); margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .prop-location { display: flex; align-items: center; gap: 6px; color: var(--gray); font-size: 0.95rem; margin-bottom: 20px; }
        
        .prop-meta { display: flex; gap: 16px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        .meta-item { display: flex; flex-direction: column; }
        .meta-value { font-weight: 700; color: var(--dark); font-size: 1.1rem; }
        .meta-label { font-size: 0.8rem; color: var(--gray); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }

        /* FEATURES SPLIT */
        .features-section { background: #fff; padding: 100px 0; border-top: 1px solid rgba(0,0,0,0.03); border-bottom: 1px solid rgba(0,0,0,0.03); }
        .feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .feat-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .feat-card { background: var(--light); padding: 32px; border-radius: 24px; transition: all 0.3s; }
        .feat-card:hover { background: #fff; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); transform: translateY(-5px); }

        /* FOOTER */
        .footer { background: var(--dark); color: #fff; padding: 80px 0 40px; margin-top: 80px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
        .footer-link { color: #94a3b8; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s; }
        .footer-link:hover { color: #fff; }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .hero-section { grid-template-columns: 1fr; padding-top: 120px; text-align: center; }
          .hero-desc { margin: 0 auto 40px; }
          .floating-badge { display: none; }
          .feat-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 600px) {
          .search-glass { flex-direction: column; }
          .feat-cards { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="hero-section container-xl">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ display: "inline-flex", background: "rgba(79,70,229,0.1)", color: "var(--primary)", padding: "8px 16px", borderRadius: "100px", fontSize: "0.9rem", fontWeight: 600, marginBottom: "24px", alignItems: "center", gap: "8px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)" }}></span>
            Premium Properties Across India
          </div>
          <h1 className="hero-title">Discover A Place<br/>You'll Love To <span>Live</span></h1>
          <p className="hero-desc">Elevate your living experience. Explore thousands of hand-picked, verified properties designed to match your unique lifestyle.</p>
          
          <form className="search-glass" onSubmit={handleSearch}>
            <div className="search-input-group">
              <HiLocationMarker size={22} color="var(--gray)" />
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="City, Area, or Landmark" />
            </div>
            <div className="search-input-group">
              <HiHome size={22} color="var(--gray)" />
              <select value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                <option value="">Any Property Type</option>
                <option value="flat">Flat / Apartment</option>
                <option value="villa">Villa / House</option>
                <option value="penthouse">Penthouse</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <button type="submit" className="search-btn">Search <HiArrowRight/></button>
          </form>

          <div style={{ display: "flex", gap: "40px", marginTop: "40px", flexWrap: "wrap", justifyContent: "center" }}>
            <div><div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--dark)" }}>10K+</div><div style={{ color: "var(--gray)", fontSize: "0.9rem" }}>Active Listings</div></div>
            <div><div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--dark)" }}>2.5K</div><div style={{ color: "var(--gray)", fontSize: "0.9rem" }}>Happy Customers</div></div>
            <div><div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--dark)" }}>50+</div><div style={{ color: "var(--gray)", fontSize: "0.9rem" }}>Cities Covered</div></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={{ position: "relative" }}>
          <div className="hero-images-wrapper">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={HERO_IMAGES[currentImg]}
                alt="Luxury Property"
                className="hero-image"
                initial={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>
          
          <motion.div 
            className="floating-badge"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div style={{ width: 50, height: 50, background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <HiShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--dark)" }}>100% Verified</div>
              <div style={{ color: "var(--gray)", fontSize: "0.9rem" }}>Safe & Secure Listings</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="section-padding" style={{ background: "#fff" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center" }}>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-subtitle" style={{ margin: "0 auto 60px" }}>Browse our extensive portfolio of property types to find exactly what you're looking for.</p>
          </div>
          
          <div className="cat-grid">
            {categories.map((cat, i) => (
              <div key={i} className="cat-card" onClick={() => navigate(`/properties?propertyType=${cat.type}`)}>
                <div className="cat-icon" style={{ background: cat.bg, color: cat.color }}>{cat.icon}</div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px" }}>{cat.name}</h3>
                <p style={{ color: "var(--gray)", fontWeight: 500 }}>{cat.count} Properties</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW TALL PROPERTIES GRID */}
      <section className="section-padding">
        <div className="container-xl">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h2 className="section-title">Featured Listings</h2>
              <p className="section-subtitle" style={{ margin: 0 }}>Hand-picked premium properties updated daily.</p>
            </div>
            <button className="search-btn" style={{ borderRadius: "100px", padding: "12px 24px" }} onClick={() => navigate("/properties")}>
              View All <HiArrowRight/>
            </button>
          </div>

          {loading ? (
             <div style={{ textAlign: "center", padding: "100px", color: "var(--gray)" }}>Loading premium properties...</div>
          ) : (
            <div className="prop-grid">
              {sortedProperties.map(property => {
                const isWished = wishlistedIds.includes(String(property._id));
                const imgSrc = property.images?.[0] || property.img || HERO_IMAGES[0];
                return (
                  <div key={property._id} className="prop-card" onClick={() => navigate(`/property/${property._id}`)} style={{ cursor: "pointer" }}>
                    <div className="prop-img-box">
                      <img src={imgSrc} alt={property.title} className="prop-img" loading="lazy" />
                      <button className="wishlist-btn" onClick={(e) => handleToggleWishlist(property._id, e)}>
                        <HiHeart size={24} color={isWished ? "#e11d48" : "#cbd5e1"} style={{ transition: "all 0.2s" }} />
                      </button>
                      <div style={{ position: "absolute", top: "30px", left: "30px", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)", color: "#fff", padding: "6px 14px", borderRadius: "10px", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                        {property.propertyType || property.type}
                      </div>
                    </div>
                    
                    <div className="prop-content">
                      <div className="prop-price">{formatPrice(property.price)}</div>
                      <div className="prop-title">{property.title}</div>
                      <div className="prop-location"><HiLocationMarker color="var(--primary)" /> {property.city}</div>
                      
                      <div className="prop-meta">
                        {property.bedrooms && (
                          <div className="meta-item">
                            <span className="meta-value">{property.bedrooms}</span>
                            <span className="meta-label">Beds</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="meta-item">
                            <span className="meta-value">{property.bathrooms}</span>
                            <span className="meta-label">Baths</span>
                          </div>
                        )}
                        {property.area && (
                          <div className="meta-item">
                            <span className="meta-value">{Number(property.area).toLocaleString()}</span>
                            <span className="meta-label">Sq Ft</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SPLIT SECTION */}
      <section className="features-section">
        <div className="container-xl feat-grid">
          <div>
            <div style={{ color: "var(--primary)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Why Choose EstateX</div>
            <h2 className="section-title">The New Standard In Real Estate.</h2>
            <p className="section-subtitle">We've completely redesigned the property search experience. No brokers, no hidden fees, just seamless technology connecting buyers and sellers.</p>
            
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "20px", marginTop: "40px" }}>
              {["100% Verified Legal Documents", "Direct Seller Communication", "Instant Home Loan Approvals"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "1.1rem", fontWeight: 600, color: "var(--dark)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><HiShieldCheck size={18} /></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="feat-cards">
            {features.map((f, i) => (
              <div key={i} className="feat-card">
                <div style={{ width: 56, height: 56, borderRadius: "16px", background: f.color + "15", color: f.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px", color: "var(--dark)" }}>{f.title}</h3>
                <p style={{ color: "var(--gray)", fontSize: "0.95rem", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container-xl">
          <div className="footer-grid">
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: "20px" }}>
                <span style={{ color: "var(--primary)" }}>E</span>stateX
              </div>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, maxWidth: "350px", marginBottom: "30px" }}>
                The premier digital real estate platform in India. Connecting dreams to reality with transparency and trust.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                  <a key={idx} href="#" style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--primary)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "24px" }}>Quick Links</h4>
              <a href="/" className="footer-link">Home</a>
              <a href="/properties" className="footer-link">Properties</a>
              <a href="/contact" className="footer-link">Contact Us</a>
              <a href="/login" className="footer-link">Login</a>
            </div>

            <div>
              <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "24px" }}>Contact Info</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", marginBottom: "16px" }}>
                <HiLocationMarker size={20} color="var(--primary)" /> 123 Tech Park, India
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8", marginBottom: "16px" }}>
                <HiPhone size={20} color="var(--primary)" /> +91 98765 43210
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#94a3b8" }}>
                <HiMail size={20} color="var(--primary)" /> contact@estatex.com
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", textAlign: "center", color: "#64748b", fontSize: "0.9rem" }}>
            © {new Date().getFullYear()} EstateX Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
