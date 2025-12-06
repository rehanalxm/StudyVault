# 📚 StudyVault

A modern full-stack web application for managing and accessing academic study materials. Students can browse Notes, Syllabus, and Previous Year Questions (PYQ) organized by year and subject, while administrators can easily upload and manage content through a secure admin panel.

![StudyVault Banner](https://img.shields.io/badge/StudyVault-Academic%20Resource%20Hub-6366f1?style=for-the-badge)

## 🔗 Live Demo

**🌐 [Live Application](https://study-vault-k85kp0u4z-rehanalxms-projects.vercel.app)** | **🔐 [Admin Panel](https://study-vault-k85kp0u4z-rehanalxms-projects.vercel.app/admin)** | **📖 [Deployment Guide](DEPLOYMENT.md)**

> **Admin Credentials:** Username: `admin` | Password: `admin123`

## ✨ Features

### 👨‍🎓 For Students
- **Year-wise Navigation**: Browse materials organized by academic year (1st, 2nd, 3rd Year)
- **Subject Selection**: Easy-to-use interface to select subjects
- **Material Types**: Access Notes, Syllabus, and PYQs in PDF format
- **Notice Board**: Stay updated with important announcements
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 👨‍💼 For Administrators
- **Secure Login**: Password-protected admin panel
- **Subject Management**: Add and remove subjects with year and semester information
- **Material Upload**: Upload PDF files with metadata (title, type, subject)
- **Notice Management**: Post and manage notices with priority levels and expiry dates
- **Material Overview**: View and delete uploaded materials
- **Password Management**: Change admin password securely

## 🛠️ Tech Stack

### Frontend
- **React** (v19) - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **GridFS** - File storage system for PDFs
- **Multer GridFS Storage** - File upload middleware
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)
- [Git](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/StudyVault.git
cd StudyVault
```

### 2. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (see .env.example)
# Add your MongoDB URI, port, and JWT secret
cp .env.example .env

# Edit .env with your configuration
```

**Server `.env` Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/studyvault
PORT=5000
JWT_SECRET=your_secret_key_change_this
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studyvault?retryWrites=true&w=majority
```

### 3. Client Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env

# The default configuration should work for local development
```

**Client `.env` Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Initialize Admin Account

You need to create an admin account in MongoDB. You can do this by:

**Option 1: Using MongoDB Compass or MongoDB Shell**
```javascript
// Connect to your database and run:
use studyvault

// Hash a password (e.g., "admin123")
// You'll need to hash it using bcrypt with 10 salt rounds
// Hash for "admin123": $2a$10$...

db.admins.insertOne({
  username: "admin",
  password: "$2a$10$YourHashedPasswordHere"
})
```

**Option 2: Create a setup script** (I can help you create this)

### 5. Start the Application

**Terminal 1 - Start Server:**
```bash
cd server
npm start
```
Server will run on `http://localhost:5000`

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```
Client will run on `http://localhost:5173`

### 6. Access the Application

- **Student Portal**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin
- **Notice Board**: http://localhost:5173/notices

## 📁 Project Structure

```
StudyVault/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── .env               # Environment variables (not in git)
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   │   ├── Admin.js
│   │   ├── Material.js
│   │   ├── Notice.js
│   │   └── Subject.js
│   ├── routes/
│   │   └── api.js        # API routes
│   ├── index.js          # Server entry point
│   ├── .env              # Environment variables (not in git)
│   └── package.json
│
└── README.md             # This file
```

## 🔐 Admin Panel

### Default Credentials
- **Username**: admin
- **Password**: Set during admin account initialization

### Admin Features
1. **Add Subject**: Create subjects with name, year, and semester
2. **Upload Material**: Upload PDFs with title, type, and subject association
3. **Manage Notices**: Post important announcements with priority and expiry
4. **Delete Content**: Remove subjects and materials
5. **Change Password**: Update admin password for security

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
cd client
vercel
```

**Netlify:**
```bash
cd client
npm run build
# Upload the 'dist' folder to Netlify
```

**Important**: Update your `.env` file with the production API URL:
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Backend Deployment (Render/Railway/Heroku)

**Environment Variables to Set:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `PORT` - Will be automatically set by most platforms
- `JWT_SECRET` - Your secret key for JWT tokens

**MongoDB Atlas Setup:**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
4. Get your connection string
5. Update `MONGODB_URI` in your deployment platform

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify network access settings in MongoDB Atlas

**2. CORS Errors**
- Check that `VITE_API_URL` in client `.env` matches your server URL
- Ensure CORS is properly configured in `server/index.js`

**3. File Upload Issues**
- Verify GridFS bucket is initialized
- Check file size limits in your configuration
- Ensure proper permissions for file uploads

**4. Admin Dashboard Not Showing**
- Clear localStorage and try logging in again
- Check browser console for JavaScript errors
- Verify all icons are properly imported in components

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Rehan**
- Portfolio: [rehanalxm.github.io/My-Portfolio](https://rehanalxm.github.io/My-Portfolio/)

## 🙏 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- UI inspiration from modern web design patterns
- Built with love for students ❤️

---

⭐ If you find this project helpful, please give it a star on GitHub!
