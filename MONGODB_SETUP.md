# 🗄️ MongoDB Atlas Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Account
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Google account (easiest), OR
   - Email + password

### Step 2: Create Free Cluster
1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
   - ✅ 512 MB storage
   - ✅ Shared RAM
   - ✅ Perfect for development & production
3. Select provider & region:
   - **Provider:** AWS (recommended)
   - **Region:** Choose closest to you or your users
     - For Zambia/Africa: Europe (Ireland) or Asia-Pacific
     - For USA: us-east-1 (N. Virginia)
4. **Cluster Name:** Leave as "Cluster0" or rename to "amenshi4life"
5. Click **"Create"**
6. Wait 2-3 minutes for cluster creation ⏳

### Step 3: Create Database User
1. You'll see a security quickstart
2. **Authentication Method:** Username and Password
3. **Username:** `amenshi_admin`
4. **Password:** Click "Autogenerate Secure Password" 
   - **⚠️ COPY THIS PASSWORD!** Save it somewhere safe
   - Or create your own strong password
5. Click **"Create User"**

### Step 4: Set Network Access
1. **Add IP Address**
2. Two options:

   **Option A - Development (Easiest):**
   - Click **"Add My Current IP Address"**
   - Or click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For development only, not production!

   **Option B - Production:**
   - Add specific IP addresses of your servers
   
3. Click **"Finish and Close"**

### Step 5: Get Connection String
1. Click **"Connect"** on your cluster
2. Click **"Drivers"**
3. Select:
   - **Driver:** Node.js
   - **Version:** 4.1 or later
4. Copy the connection string:
   ```
   mongodb+srv://amenshi_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Configure Your Application

1. **Replace `<password>`** with your actual password
2. **Add database name** after `.net/`
3. **Final connection string:**
   ```
   mongodb+srv://amenshi_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/amenshi4life?retryWrites=true&w=majority
   ```

4. **Update `server/.env`:**
   ```env
   MONGODB_URI=mongodb+srv://amenshi_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/amenshi4life?retryWrites=true&w=majority
   ```

---

## 🧪 Test Connection

### Option 1: Start the server
```bash
cd server
npm run dev
```

**Success looks like:**
```
🚀 Server running in development mode on port 5000
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

**Error looks like:**
```
❌ Error: connect ECONNREFUSED
```
→ Check your connection string and password

### Option 2: Use connection string tester
```bash
cd server
node -e "require('mongoose').connect('YOUR_CONNECTION_STRING').then(() => console.log('✅ Connected!')).catch(err => console.log('❌ Error:', err.message))"
```

---

## 🌱 Seed Your Database

Once connected, add sample data:

```bash
cd server
node seeder.js
```

**Output:**
```
✅ Sample data imported successfully
   - 3 projects created
   - 6 team members added
   - Statistics initialized
```

---

## 🎯 Create First Admin

**Method 1: Using curl (if installed)**
```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin\"}"
```

**Method 2: Using PowerShell**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/setup" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Admin"}'
```

**Method 3: Using the frontend**
1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Go to: http://localhost:5173/admin/login
4. If no admin exists, you'll see instructions

**Default credentials (from server/.env):**
- Email: `admin@amenshi4life.org`
- Password: `Admin@123`

⚠️ **Change password immediately after first login!**

---

## 🔍 View Your Data

### In MongoDB Atlas Dashboard:
1. Click **"Browse Collections"**
2. You'll see your database: `amenshi4life`
3. Collections:
   - `projects`
   - `teams`
   - `contacts`
   - `statistics`
   - `admins`

---

## 🐛 Troubleshooting

### "Authentication failed"
→ Check your username and password in connection string

### "Network error" / "ECONNREFUSED"
→ Check IP whitelist in Network Access

### "Database not found"
→ Add database name after `.net/` in connection string

### "MongooseServerSelectionError"
→ Wrong cluster name or connection string

### Still having issues?
1. Double-check connection string format
2. Verify password has no special characters that need encoding
3. Try "Allow Access from Anywhere" in Network Access
4. Check if firewall is blocking port 27017

---

## 📊 Connection String Format

```
mongodb+srv://[username]:[password]@[cluster-url]/[database]?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://amenshi_admin:MyP@ssw0rd@cluster0.abc123.mongodb.net/amenshi4life?retryWrites=true&w=majority
```

**Note:** If password has special characters (`@`, `#`, `!`, etc.), encode them:
- `@` → `%40`
- `#` → `%23`
- `!` → `%21`

Or use a simpler password without special characters.

---

## ✅ Success Checklist

- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] `server/.env` updated
- [ ] Server starts successfully
- [ ] "MongoDB Connected" message appears
- [ ] Database seeded
- [ ] Admin account created
- [ ] Can login to admin panel

---

## 🎉 Next Steps After Setup

1. **Test the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000/api
   - Admin: http://localhost:5173/admin/login

2. **Verify data:**
   - Projects show on homepage
   - Statistics display
   - Team members appear
   - Contact form works

3. **Add your content:**
   - Upload real images
   - Add actual projects
   - Update team members
   - Customize statistics

---

**Need help? Check the connection string format and make sure:**
1. Password is correct (no typos)
2. Database name is included
3. IP is whitelisted
4. Server is running

Ready to continue! 🚀
