import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import PropertyCard from "../../components/common/PropertyCard.jsx";
import { landingPageStyles as s } from "../../assets/dummyStyles.js";
import { HiSearch, HiOfficeBuilding, HiHome, HiShieldCheck, HiLightningBolt, HiCurrencyDollar, HiVideoCamera, HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import bannerImage from "../../assets/bannerimage.png";
const API_URL = import.meta.env.VITE_API_URL || "";

const LandingPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("Select Type");
  const [properties, setProperties] = useState([]);
  const [propertyCounts, setPropertyCounts] = useState({});
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, countRes] = await Promise.all([
          axios.get(`${API_URL}/api/property`),
          axios.get(`${API_URL}/api/property/stats/counts`),
        ]);
        setProperties(propRes.data.properties || []);
        setPropertyCounts(countRes.data.counts || {});
        if (token) {
          const wishRes = await axios.get(`${API_URL}/api/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
          setWishlistedIds((wishRes.data.wishlist || []).map(w => w._id || w));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (propertyType !== "Select Type") params.append("propertyType", propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const handleToggleWishlist = async (id) => {
    if (!token) return navigate("/login");
    try {
      const res = await axios.post(`${API_URL}/api/wishlist/toggle/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setWishlistedIds(res.data.wishlist.map(w => w._id || w));
    } catch (err) { console.error(err); }
  };

  const categories = [
    { name: "Modern Flats", count: propertyCounts.flat || 0, icon: <HiOfficeBuilding size={32} />, type: "flat" },
    { name: "Luxury Villas", count: propertyCounts.villa || 0, icon: <HiHome size={32} />, type: "villa" },
    { name: "Penthouse", count: propertyCounts.penthouse || 0, icon: <HiOfficeBuilding size={32} />, type: "penthouse" },
    { name: "Commercial", count: propertyCounts.commercial || 0, icon: <HiOfficeBuilding size={32} />, type: "commercial" },
  ];

  const features = [
    { title: "Verified Trust", desc: "Every listing is audited for ownership, condition, and legality.", icon: <HiShieldCheck size={24} /> },
    { title: "Smart Search", desc: "AI-driven algorithms find the best matches for your preferences.", icon: <HiLightningBolt size={24} /> },
    { title: "Best Value", desc: "Direct-from-owner listings with zero-commission options.", icon: <HiCurrencyDollar size={24} /> },
    { title: "Virtual Tours", desc: "High-definition 3D tours from the comfort of your home.", icon: <HiVideoCamera size={24} /> },
  ];

  return (
    <div className={s.bgMain}>
      {/* Hero */}
      <section className={s.heroSection}>
        <div className={s.heroContent}>
          <span className={s.badge}>🏡 #1 Real Estate Platform</span>
          <h1 className={s.heroTitle}>Find Your <span className={s.textGradient}>Dream Home</span></h1>
          <p className={s.heroSubtitle}>Discover verified properties with transparent pricing and trusted sellers across India.</p>
          <form className={s.searchForm} onSubmit={handleSearch}>
            <div className={s.searchField}>
              <HiSearch className={s.textPrimary} size={20} />
              <div className={s.flexCol}>
                <span className={s.labelSmall}>Location</span>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Enter city..." className={s.inputTransparent} />
              </div>
            </div>
            <div className={s.searchDivider} />
            <div className={s.searchField}>
              <HiHome className={s.textPrimary} size={20} />
              <div className={s.flexCol}>
                <span className={s.labelSmall}>Property Type</span>
                <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className={`${s.inputTransparent} cursor-pointer`}>
                  <option value="Select Type">Select Type</option>
                  <option value="flat">Flat/Apartment</option>
                  <option value="villa">Villa/House</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            <button type="submit" className={s.searchButton}><HiSearch size={20} /> Search</button>
          </form>
          <div className={s.statsContainer}>
            <div className={s.statItemFlex}><div className={s.statNumber}>2,500+</div><div className={s.statLabel}>Properties</div></div>
            <div className={s.statItemBorder}><div className={s.statNumber}>1,200+</div><div className={s.statLabel}>Happy Clients</div></div>
            <div className={s.statItemBorder}><div className={s.statNumber}>50+</div><div className={s.statLabel}>Cities</div></div>
          </div>
        </div>
        <div className={s.heroImageContainer}>
          <div className={s.imageWrapper}><img src={bannerImage} alt="Dream Home" className={s.heroImage} /></div>
        </div>
      </section>

      {/* Categories */}
      <section className={s.categorySection}>
        <div className="container">
          <div className={s.categoryHeader}>
            <div className={s.categoryHeaderText}><h2 className={s.categoryTitle}>Browse by Category</h2><p className={s.categoryDesc}>Explore our diverse property types</p></div>
          </div>
          <div className={s.categoryGrid}>
            {categories.map((cat, i) => (
              <div key={i} className={s.categoryCard} onClick={() => navigate(`/properties?propertyType=${cat.type}`)}>
                <div className={s.categoryIconWrapper}>{cat.icon}</div>
                <h3 className={s.categoryName}>{cat.name}</h3>
                <p className={s.categoryCount}>{cat.count} Properties</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={s.featuresSection}>
        <div className={s.featuresContainer}>
          <div className={s.featuresList}>
            {features.map((f, i) => (
              <div key={i} className={s.featureCard}>
                <div className={s.featureIconWrapper}>{f.icon}</div>
                <h3 className={s.featureTitle}>{f.title}</h3>
                <p className={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className={s.featuresContent}>
            <h2 className={s.featuresHeading}>Why Choose <span className="text-gradient">ReeState</span>?</h2>
            <p className={s.featuresSubtext}>We've reinvented the property search experience from the ground up with transparency, technology, and user-centric design.</p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className={s.featuredSection}>
        <div className="container">
          <div className={s.featuredHeader}>
            <span className={s.featuredBadge}>Featured</span>
            <h2 className={s.featuredTitle}>Latest Properties</h2>
            <p className={s.featuredSubtitle}>Handpicked listings just for you</p>
          </div>
          {loading ? <div className={s.loadingContainer}><div className="loader" /></div> : (
            <div className={s.propertiesGrid}>
              {properties.filter(p => p).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6).map(property => (
                <PropertyCard key={property._id} property={property} isWishlisted={wishlistedIds.includes(String(property._id))} onToggleWishlist={handleToggleWishlist} />
              ))}
            </div>
          )}
          <div className={s.discoverButtonContainer}><button className={s.discoverButton} onClick={() => navigate("/properties")}>View All Properties</button></div>
        </div>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <div className="container">
          <div className={s.footerMainGrid}>
            <div className={s.footerBrand}>
              <div className={s.brandLogo}><span className={s.brandIcon}>R</span>ReeState</div>
              <p className={s.brandDesc}>Your trusted partner in finding the perfect property.</p>
              <div className={s.socialIcons}>
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                  <a key={idx} href="#" className={s.socialIcon}><Icon size={16} /></a>
                ))}
              </div>
            </div>
            <div><h4 className={s.footerHeading}>Company</h4>
              <ul className={s.footerLinks}>
                <li><a href="/" className={s.footerLink}>Home</a></li>
                <li><a href="/properties" className={s.footerLink}>Property</a></li>
                <li><a href="/contact" className={s.footerLink}>Contact</a></li>
              </ul>
            </div>
            <div><h4 className={s.footerHeading}>Support</h4>
              <ul className={s.footerLinks}>
                <li className={s.contactInfo}><HiMail className="text-primary text-xl" /> contact@reestate.com</li>
                <li className={s.contactInfo}><HiPhone className="text-primary text-xl" /> +91 1234567890</li>
                <li className={s.contactInfoStart}><HiLocationMarker className={`text-primary ${s.contactIcon}`} /> 123 Business Hub, India</li>
              </ul>
            </div>
          </div>
          <div className={s.bottomBar}>
            <div className={s.bottomBarFlex}><span>© 2026 Final Year Project, GIHSM Lucknow </span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
