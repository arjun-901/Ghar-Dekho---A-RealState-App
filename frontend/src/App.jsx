import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/common/Navbar.jsx";

// Pages - Shared
import LandingPage from "./pages/shared/LandingPage.jsx";
import Properties from "./pages/shared/Properties.jsx";
import PropertyDetails from "./pages/shared/PropertyDetails.jsx";
import Contact from "./pages/shared/Contact.jsx";
import Profile from "./pages/shared/Profile.jsx";
import ChatMessages from "./pages/shared/ChatMessages.jsx";

// Pages - Auth
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

// Pages - Buyer
import BuyerDashboard from "./pages/buyer/BuyerDashboard.jsx";

// Pages - Seller
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import AddProperty from "./pages/seller/AddProperty.jsx";
import EditProperty from "./pages/seller/EditProperty.jsx";

// Pages - Admin
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminProperties from "./pages/admin/AdminProperties.jsx";
import AdminContacts from "./pages/admin/AdminContacts.jsx";

function App() {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    return () => {
      document.body.style.overflowX = "";
      document.documentElement.style.overflowX = "";
    };
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat-messages" element={<ChatMessages />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Buyer */}
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />

        {/* Seller */}
        <Route path="/dashboard" element={<SellerDashboard />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/properties" element={<AdminProperties />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
      </Routes>
    </>
  );
}

export default App;
