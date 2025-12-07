Perfect — here’s a **clean, final, security-safe README** you can drop straight into your repo ✅
All sensitive data is removed, wording is professional, and it won’t raise any red flags for recruiters or security reviewers.

---

# 📚 StudyVault

A modern full-stack web application for managing and accessing academic study materials. Students can browse Notes, Syllabus, and Previous Year Questions (PYQ) organized by year and subject, while administrators can upload and manage content through a secure admin panel.

![StudyVault Banner](https://img.shields.io/badge/StudyVault-Academic%20Resource%20Hub-6366f1?style=for-the-badge)

---

## 🔗 Live Demo

**🌐 Live Application:**
[https://study-vault-k85kp0u4z-rehanalxms-projects.vercel.app

> 🔐 **Admin panel is available at `/admin` and requires valid credentials created during setup.**

---

## ✨ Features

### 👨‍🎓 For Students

* **Year-wise Navigation** – Browse materials organized by academic year
* **Subject Selection** – Simple and intuitive subject browsing
* **Material Types** – Notes, Syllabus, and Previous Year Questions (PDF)
* **Notice Board** – Important announcements and updates
* **Responsive Design** – Optimized for desktop, tablet, and mobile

### 👨‍💼 For Administrators

* **Secure Authentication** – JWT-based login
* **Subject Management** – Add and remove subjects with year/semester
* **Material Upload** – Upload PDFs with metadata
* **Notice Management** – Create and manage notices with priority and expiry
* **Content Control** – View and delete uploaded materials
* **Password Management** – Secure password updates

---

## 🛠️ Tech Stack

### Frontend

* React (v19)
* React Router
* Vite
* TailwindCSS
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* GridFS
* Multer GridFS Storage
* bcryptjs
* JWT (JSON Web Tokens)
* CORS

---

## 📋 Prerequisites

Make sure you have the following installed:

* Node.js (v14 or higher)
* MongoDB (Local or MongoDB Atlas)
* Git

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/StudyVault.git
cd StudyVault
```

---

### 2. Server Setup

```bash
cd server
npm install
cp .env.example .env
```

**Server `.env` Example**

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=generate_a_strong_random_secret
``

---

### 3. Client Setup

```bash
cd client
npm install
cp .env.example .env
```

**Client `.env` Example**

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Admin Account Initialization

An admin account must be created manually in the database.

Example (MongoDB Shell / Compass):

```js
db.admins.insertOne({
  username: "your_admin_username",
  password: "bcrypt_hashed_password"
})
```

* Passwords must be hashed using **bcrypt (10 salt rounds recommended)**
* Admin credentials are **not hardcoded**

---

## ▶️ Running the Application

**Start Backend**

```bash
cd server
npm start
```

**Start Frontend**

```bash
cd client
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Admin Panel: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 📁 Project Structure

```
StudyVault/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)

**Vercel**

```bash
cd client
vercel
```

**Netlify**

```bash
npm run build
```

Update frontend environment variable:

```env
VITE_API_URL=https://your-backend-url.com/api
```

---

### Backend (Render / Railway / Heroku)

Set the following environment variables:

* `MONGODB_URI`
* `JWT_SECRET`
* `PORT` (auto-assigned on most platforms)

**MongoDB Atlas Notes**

* Whitelist only trusted IPs
* Avoid using `0.0.0.0/0` in production
* Store credentials securely

---

## 🐛 Troubleshooting

**MongoDB Connection Issues**

* Ensure MongoDB is running
* Verify Atlas network access

**CORS Errors**

* Confirm API URLs match on client & server
* Check CORS configuration in backend

**File Upload Issues**

* Ensure GridFS is initialized
* Verify file size limits

---

## 🔐 Security Notes

* JWT-based authentication
* Passwords hashed using bcrypt
* Environment variables for secrets
* Protected admin routes
* CORS configured for trusted origins

---

## 🤝 Contributing

Contributions are welcome:

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Rehan**
Portfolio: [https://rehanalxm.github.io/My-Portfolio/](https://rehanalxm.github.io/My-Portfolio/)

---

⭐ If you find this project helpful, please consider giving it a star!

