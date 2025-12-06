# 🚀 StudyVault Deployment Guide

This guide will help you deploy StudyVault to make it accessible to users online.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ MongoDB Atlas account (free tier available)
- ✅ GitHub account
- ✅ Vercel/Netlify account (for frontend)
- ✅ Render/Railway account (for backend)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create a Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a **FREE** M0 cluster
4. Choose a cloud provider and region (closest to your users)
5. Click "Create Cluster"

### 1.2 Create Database User
1. Go to **Database Access**
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `studyvault-admin` (or your choice)
5. Create a **strong password** and save it
6. User Privileges: **Atlas Admin**
7. Click "Add User"

### 1.3 Configure Network Access
1. Go to **Network Access**
2. Click "Add IP Address"
3. For testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IPs of your deployment platforms
5. Click "Confirm"

### 1.4 Get Connection String
1. Go to **Database** → Click "Connect"
2. Choose "Connect your application"
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your credentials
6. Add database name: `studyvault` after the hostname:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/studyvault?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Deploy Backend (Server)

### Option A: Deploy on Render (Recommended)

#### 2.1 Create Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub

#### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the `StudyVault` repository
4. Configure:
   - **Name**: `studyvault-api` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

#### 2.3 Add Environment Variables
Click "Advanced" → "Add Environment Variable":

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/studyvault?retryWrites=true&w=majority
PORT = 5000
JWT_SECRET = your-super-secret-jwt-key-change-this-123456789
```

> ⚠️ **Important**: Use a strong, random JWT_SECRET!

#### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your API URL will be: `https://studyvault-api.onrender.com`
4. **Save this URL** - you'll need it for the frontend!

#### 2.5 Initialize Admin Account
After deployment:
1. Go to Render Dashboard → Your Service → "Shell"
2. Run: `node setup-admin.js yourpassword`
3. Or use the default password by running: `node setup-admin.js`

---

### Option B: Deploy on Railway

#### Create Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub

#### Deploy
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your repository
3. Configure:
   - Root Directory: `server`
   - Start Command: `npm start`
4. Add environment variables (same as Render)
5. Deploy!

Your API URL: `https://your-project.up.railway.app`

---

## 🌐 Step 3: Deploy Frontend (Client)

### Option A: Deploy on Vercel (Recommended)

#### 3.1 Create Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub

#### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - Click "Edit" next to Build and Output Settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`

#### 3.3 Add Environment Variable
Under "Environment Variables":
```
VITE_API_URL = https://your-backend-url.onrender.com/api
```
> Replace with your actual backend URL from Step 2!

#### 3.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live at: `https://your-project.vercel.app`

#### 3.5 Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

### Option B: Deploy on Netlify

#### Deploy
1. Go to [Netlify.com](https://netlify.com)
2. Drag and drop your `client/dist` folder
   - First run `npm run build` in the client folder
3. Or connect GitHub repository:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Base Directory: `client`

#### Environment Variables
Go to Site Settings → Environment Variables:
```
VITE_API_URL = https://your-backend-url.onrender.com/api
```

---

## ✅ Step 4: Post-Deployment Setup

### 4.1 Initialize Admin Account
1. Connect to your backend (via Render Shell or Railway CLI)
2. Run: `node setup-admin.js yourpassword`
3. Or manually insert into MongoDB Atlas:
   - Database: `studyvault`
   - Collection: `admins`
   - Document:
     ```json
     {
       "username": "admin",
       "password": "$2a$10$hashed_password_here"
     }
     ```

### 4.2 Test Your Application
1. Open your frontend URL
2. Navigate to `/admin`
3. Login with your credentials
4. Try adding a subject and uploading a material

### 4.3 Update CORS (if needed)
If you face CORS errors, add your frontend URL to allowed origins in `server/index.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-frontend.vercel.app']
}));
```

---

## 🔒 Security Checklist

Before going live:

- [ ] Changed default admin password
- [ ] Using strong JWT_SECRET
- [ ] MongoDB network access is configured
- [ ] .env files are in .gitignore
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on Vercel/Render)

---

## 📊 Monitoring

### Render
- View logs: Dashboard → Service → Logs
- Monitor usage: Dashboard → Service → Metrics

### Vercel
- Analytics: Project → Analytics
- Deployment logs: Project → Deployments → [Select] → View Function Logs

### MongoDB Atlas
- Monitor database: Cluster → Metrics
- View logs: Cluster → Logs

---

## 🆘 Troubleshooting

### Issue: "Failed to fetch" or CORS errors
**Solution**: 
1. Check `VITE_API_URL` in frontend environment variables
2. Verify CORS configuration in backend
3. Ensure both frontend and backend are deployed successfully

### Issue: Admin login not working
**Solution**:
1. Verify admin account exists in MongoDB
2. Check JWT_SECRET is set correctly
3. Clear browser localStorage and try again

### Issue: File uploads failing
**Solution**:
1. Verify MongoDB URI is correct
2. Check GridFS bucket initialization in logs
3. Ensure file size limits are appropriate

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:
- **Push to GitHub** → Automatic deployment!
- Check deployment status in respective dashboards

---

## 💰 Cost Estimate

All services have generous **FREE** tiers:

| Service | Free Tier | Limits |
|---------|-----------|--------|
| MongoDB Atlas | M0 Cluster | 512 MB storage |
| Render | Free Plan | 750 hours/month |
| Vercel | Hobby | Unlimited personal projects |

**Total Cost**: $0/month for small-medium usage! 🎉

---

## 📝 Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Connection string obtained
- [ ] Backend deployed (Render/Railway)
- [ ] Backend environment variables set
- [ ] Admin account initialized
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Frontend environment variable set (VITE_API_URL)
- [ ] Application tested end-to-end
- [ ] Custom domain configured (optional)

---

## 🎉 You're Live!

Share your StudyVault URL with students:
- **Frontend**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin`

Happy teaching! 📚
