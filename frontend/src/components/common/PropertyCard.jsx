import { Link } from "react-router-dom";
import { HiOutlineHome, HiOutlineUserGroup, HiArrowsExpand, HiShieldCheck, HiLocationMarker, HiOutlineHeart, HiHeart } from "react-icons/hi";
import { propertyCardStyles as s } from "../../assets/dummyStyles.js";

const PropertyCard = ({ property, isWishlisted, onToggleWishlist, renderActions }) => {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(property.price);

  const isCommercial = ["commercial", "office", "plot"].includes(property.propertyType);

  return (
    <div className="card-premium" style={{ width: "100%", maxWidth: "400px" }}>
      {/* Image */}
      <Link to={`/property/${property._id}`} style={{ display: "block", position: "relative", height: "220px", overflow: "hidden" }}>
        <img
          src={property.images?.[0] || "https://via.placeholder.com/400x220?text=Property"}
          alt={property.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span className={`badge ${property.status === "sale" ? "badge-sale" : "badge-rent"}`}
          style={{ position: "absolute", top: "12px", left: "12px" }}>
          For {property.status}
        </span>
        {onToggleWishlist && (
          <button onClick={(e) => { e.preventDefault(); onToggleWishlist(property._id); }}
            style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {isWishlisted ? <HiHeart color="#ef4444" size={20} /> : <HiOutlineHeart color="#64748b" size={20} />}
          </button>
        )}
      </Link>

      {/* Content */}
      <div style={{ padding: "1.25rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            <Link to={`/property/${property._id}`} style={{ color: "#111827", textDecoration: "none" }}>{property.title}</Link>
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
            <HiLocationMarker size={14} /> {property.area}, {property.city}
          </p>
        </div>

        {/* Specs */}
        <div style={{ display: "flex", justifyContent: "space-around", padding: "0.75rem 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", margin: "0.75rem 0" }}>
          {isCommercial ? (
            <>
              <div style={{ textAlign: "center" }}>
                <HiOutlineHome size={18} color="#0d9488" />
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{property.propertyType}</div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Type</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <HiArrowsExpand size={18} color="#0d9488" />
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{property.areaSize || "N/A"}</div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Sq Ft</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center" }}>
                <HiOutlineHome size={18} color="#0d9488" />
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{property.bhk || "N/A"}</div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Beds</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <HiOutlineUserGroup size={18} color="#0d9488" />
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{property.bathrooms || Math.max(1, parseInt(property.bhk) - 1 || 0)}</div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Baths</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <HiArrowsExpand size={18} color="#0d9488" />
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{property.areaSize || "N/A"}</div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Sq Ft</div>
              </div>
            </>
          )}
        </div>

        {/* Price & Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0d9488" }}>{formattedPrice}</div>
          {renderActions ? renderActions(property) : (
            <Link to={`/property/${property._id}`} className="btn btn-outline" style={{ padding: "6px 16px", fontSize: "0.8rem" }}>
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;