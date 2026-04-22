import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import { editPropertyStyles as s } from "../../assets/dummyStyles.js";
import { HiOutlineUpload, HiX } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "", description: "", price: "", city: "", area: "", pincode: "",
    propertyType: "flat", bhk: "", bathrooms: "", areaSize: "", furnishing: "unfurnished",
    status: "sale", amenities: []
  });

  const commonAmenities = ["Parking", "Pool", "Gym", "Security", "Wifi", "Power Backup", "Club House", "Garden"];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/property/${id}`);
        const p = res.data.property;
        setFormData({
          title: p.title || "", description: p.description || "", price: p.price || "",
          city: p.city || "", area: p.area || "", pincode: p.pincode || "",
          propertyType: p.propertyType || "flat", bhk: p.bhk || "", bathrooms: p.bathrooms || "",
          areaSize: p.areaSize || "", furnishing: p.furnishing || "unfurnished", status: p.status || "sale",
          amenities: p.amenities || []
        });
        setExistingImages(p.images || []);
      } catch (err) {
        setError("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const current = prev.amenities || [];
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newImages.length + files.length > 10) {
      alert("Maximum 10 images allowed in total");
      return;
    }
    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };

  const removeExistingImage = (srcToRemove) => {
    setExistingImages(prev => prev.filter(src => src !== srcToRemove));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      data.append("existingImages", JSON.stringify(existingImages));
      newImages.forEach(img => {
        data.append("images", img);
      });

      await axios.put(`${API_URL}/api/property/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update property");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

  return (
    <div className={s.pageContainer} style={{ paddingTop: "80px" }}>
      <div className={s.innerContainer}>
        <div className={s.headerWrapper}>
          <h1 className={s.pageTitle}>Edit Property</h1>
          <p className={s.pageSubtitle}>Update the details of your property listing</p>
        </div>
        
        {error && <div style={{ padding: "1rem", background: "#fee2e2", color: "#dc2626", borderRadius: "0.75rem", marginBottom: "2rem" }}>{error}</div>}

        <form onSubmit={handleSubmit} className={s.formContainer}>
          <div className={s.section}>
            <div className={s.sectionHeader}>
              <div className={s.sectionIndicator}></div>
              <h3 className={s.sectionTitle}>Basic Information</h3>
            </div>
            <div className={s.sectionContent}>
              <div>
                <label className={s.label}>Property Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className={s.input} required />
              </div>
              <div>
                <label className={s.label}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className={s.textarea} required></textarea>
              </div>
            </div>
          </div>

          <div className={s.twoColumnGrid}>
            <div>
              <div className={s.sectionHeader}>
                <div className={s.sectionIndicator}></div>
                <h3 className={s.sectionTitle}>Property Details</h3>
              </div>
              <div className={s.sectionContent}>
                <div>
                  <label className={s.label}>Property Type</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className={s.select}>
                    <option value="flat">Flat/Apartment</option>
                    <option value="villa">Independent House/Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div className={s.threeColumnGrid}>
                  <div><label className={s.label}>BHK</label><input type="number" name="bhk" value={formData.bhk} onChange={handleInputChange} className={s.input} /></div>
                  <div><label className={s.label}>Bathrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className={s.input} /></div>
                  <div><label className={s.label}>Area (Sq.Ft)</label><input type="number" name="areaSize" value={formData.areaSize} onChange={handleInputChange} className={s.input} required /></div>
                </div>
                <div className={s.twoColumnGridInner}>
                  <div>
                    <label className={s.label}>Furnishing</label>
                    <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className={s.select}>
                      <option value="unfurnished">Unfurnished</option><option value="semi-furnished">Semi-Furnished</option><option value="furnished">Fully Furnished</option>
                    </select>
                  </div>
                  <div>
                    <label className={s.label}>Listing Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className={s.select}>
                      <option value="sale">For Sale</option><option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className={s.sectionHeader}>
                <div className={s.sectionIndicator}></div>
                <h3 className={s.sectionTitle}>Pricing & Location</h3>
              </div>
              <div className={s.sectionContent}>
                <div><label className={s.label}>Price (₹)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} className={s.input} required /></div>
                <div className={s.twoColumnGridInner}>
                  <div><label className={s.label}>City</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className={s.input} required /></div>
                  <div><label className={s.label}>Pincode</label><input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className={s.input} required /></div>
                </div>
                <div><label className={s.label}>Specific Area</label><input type="text" name="area" value={formData.area} onChange={handleInputChange} className={s.input} required /></div>
              </div>
            </div>
          </div>

          <div className={s.section}>
            <div className={s.sectionHeader}>
              <div className={s.sectionIndicator}></div>
              <h3 className={s.sectionTitle}>Amenities</h3>
            </div>
            <div className={s.amenitiesGrid}>
              {commonAmenities.map(amenity => (
                <label key={amenity} className={s.amenityLabel(formData.amenities.includes(amenity))}>
                  <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className={s.amenityCheckbox} />
                  <span className={s.amenityText(formData.amenities.includes(amenity))}>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={s.section}>
            <div className={s.sectionHeader}>
              <div className={s.sectionIndicator}></div>
              <h3 className={s.sectionTitle}>Image Management</h3>
            </div>
            <div className={s.imageGrid}>
              {existingImages.map((src, i) => (
                <div key={`existing-${i}`} className={s.imageCard}>
                  <img src={src} alt="Existing" className={s.imageCardImg} />
                  <button type="button" onClick={() => removeExistingImage(src)} className={s.removeImageBtn}><HiX size={12} /></button>
                  <div className={s.imageBadgeExisting}>EXISTING</div>
                </div>
              ))}
              {newImagePreviews.map((src, i) => (
                <div key={`new-${i}`} className={s.imageCardNew}>
                  <img src={src} alt="New Preview" className={s.imageCardImg} />
                  <button type="button" onClick={() => removeNewImage(i)} className={s.removeImageBtn}><HiX size={12} /></button>
                  <div className={s.imageBadgeNew}>NEW</div>
                </div>
              ))}
              {existingImages.length + newImages.length < 10 && (
                <div className={s.uploadCard}>
                  <input type="file" multiple onChange={handleNewImageChange} className={s.uploadInput} accept="image/*" />
                  <HiOutlineUpload size={22} color="#64748b" />
                  <span className={s.uploadText}>Add Image</span>
                </div>
              )}
            </div>
          </div>

          <div className={s.formActions}>
            <button type="button" onClick={() => navigate("/dashboard")} className={s.cancelButton}>Cancel</button>
            <button type="submit" disabled={submitting} className={s.submitButton}>{submitting ? "Updating..." : "Update Property"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
