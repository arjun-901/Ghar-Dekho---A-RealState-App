# EstateX - Premium Real Estate Platform 🏡

**Created by: Arjun Maurya**

EstateX is a modern, full-stack, and responsive real estate application built with the MERN stack. It allows users to browse, list, and manage properties seamlessly across different user roles.

## 🚀 Live Demo
[https://ghar-dekho-a-real-state-app.vercel.app/](https://ghar-dekho-a-real-state-app.vercel.app/)

## 🛠️ Technologies Used
- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
- **Storage & Media:** Cloudinary (for property and profile images)
- **Emails:** Brevo (Sendinblue) API for Password Resets

## 👥 User Roles & Features

The platform provides a customized dashboard and feature set based on the user's role:

### 1. Buyer
- Browse and search for available properties.
- Filter properties based on location, type, and budget.
- Contact sellers directly regarding properties.
- View personal dashboard with history of inquiries.

### 2. Seller
- Dedicated Seller Dashboard to manage property listings.
- Add, edit, mark as sold, or delete properties.
- Upload high-quality property images.
- Receive and manage inquiries from interested buyers.

### 3. Admin
- Dedicated Admin Dashboard to oversee the entire platform.
- Manage all users (Block/Unblock or Delete accounts).
- Oversee all properties and listings.
- View and manage system-wide contacts and messages.

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arjun-901/Ghar-Dekho---A-RealState-App.git
   cd Ghar-Dekho---A-RealState-App
   ```

2. **Install Dependencies:**
   ```bash
   # Install Backend dependencies
   cd backend
   npm install

   # Install Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Variables:**
   - Copy `.env.example` to `.env` in the `backend` folder.
   - Fill in your actual MongoDB URI, Cloudinary keys, and Brevo API key.

4. **Run the Application:**
   ```bash
   # Run Backend (from backend folder)
   npm run dev

   # Run Frontend (from frontend folder)
   npm run dev
   ```

## 📝 Admin Credentials
If you need to access the Admin panel in your local setup, you can login with the pre-configured admin account (ensure your database is seeded):
