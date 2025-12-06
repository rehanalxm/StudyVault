# 🔧 Render Deployment - Quick Reference

## Step-by-Step Actions

### 1. Go to Render
🔗 Open: **https://render.com**
- Click "Get Started"
- Sign up with **GitHub** (easiest)
- Authorize Render

### 2. Create Web Service
- Click "New +" → "Web Service"
- Select repository: **StudyVault**
- Click "Connect"

### 3. Configuration Settings

Fill in exactly as shown:

| Setting | Value |
|---------|-------|
| **Name** | `studyvault-api` |
| **Region** | Singapore or closest to you |
| **Branch** | `master` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 4. Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these **3 variables**:

#### Variable 1: MONGODB_URI
```
mongodb+srv://pcrehan001_db_user:cTDmgfoNQpVUgfYQ@cluster0.tbgepbp.mongodb.net/studyvault?retryWrites=true&w=majority&appName=Cluster0
```

#### Variable 2: PORT
```
5000
```

#### Variable 3: JWT_SECRET
```
studyvault-secret-key-change-this-in-production-12345
```
(Or create your own random string)

### 5. Deploy!
- Click **"Create Web Service"**
- ⏳ Wait 5-10 minutes
- Watch logs for:
  - "Server running on..."
  - "MongoDB Connected"
  - "GridFS Bucket Initialized"

### 6. Get Your Backend URL
Once deployed, copy the URL shown at top:
```
https://studyvault-api-xxxx.onrender.com
```
**Save this! You'll need it for Vercel.**

### 7. Initialize Admin Account
- Go to "Shell" tab
- Type: `node setup-admin.js admin123`
- Press Enter
- Look for: "✅ Admin account created successfully!"

---

## ✅ Success Indicators

You'll know it worked when you see:
- 🟢 Green "Live" badge
- Logs show "MongoDB Connected"
- Shell command creates admin successfully

---

## 🆘 If Something Goes Wrong

**Build fails?**
- Check that Root Directory is `server`
- Verify Build Command is `npm install`

**MongoDB connection fails?**
- Double-check MONGODB_URI has no spaces
- Make sure password is correct
- Verify `/studyvault` is in the connection string

**Can't find Shell tab?**
- It appears after first successful deployment
- Try refreshing the page

---

## Next: Phase 3 (Vercel)
Once you have your Render backend URL, we'll deploy the frontend!
