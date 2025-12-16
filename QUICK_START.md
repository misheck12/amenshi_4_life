# 🚀 QUICK START GUIDE

## You have 2 options:

### Option A: Start Frontend Only (Recommended to see it working)
While backend dependencies are done, you can test the frontend immediately!

```bash
# In new terminal:
cd client
npm run dev
```

Visit: http://localhost:5173

**Note:** Some features will show loading/errors without backend running.

---

### Option B: Full Stack (Complete Experience)

#### Step 1: Setup MongoDB

**MongoDB Atlas (Easy, Free, No Install):**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up free
3. Create cluster (choose free tier)
4. Create database user
5. Get connection string
6. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amenshi4life
   ```

#### Step 2: Start Backend
```bash
# Terminal 1:
cd server
npm run dev
```

You should see:
```
🚀 Server running in development mode on port 5000
✅ MongoDB Connected: ...
```

#### Step 3: Seed Database (Optional but recommended)
```bash
# In server directory:
node seeder.js
```

This creates:
- 3 sample projects
- 6 team members
- Organization statistics

#### Step 4: Create Admin Account
```bash
# Method 1: Via curl (if you have it)
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin\"}"

# Method 2: Via browser
# Just go to: http://localhost:5173/admin/login
# and follow instructions
```

#### Step 5: Start Frontend
```bash
# Terminal 2:
cd client
npm run dev
```

#### Step 6: Test Everything!

**Public Pages:**
- Home: http://localhost:5173
- Projects: http://localhost:5173/projects
- Contact: http://localhost:5173/contact (TRY THE FORM!)

**Admin Panel:**
- Login: http://localhost:5173/admin/login
  - Email: admin@amenshi4life.org
  - Password: Admin@123
- Dashboard: http://localhost:5173/admin/dashboard

---

## 🎯 What to Test

### Frontend Only:
- [x] Pages load
- [x] Navigation works
- [x] Responsive design
- [x] Links work

### With Backend:
- [x] Statistics show real numbers
- [x] Projects load from database
- [x] Team members display
- [x] Contact form submits
- [x] Admin login works
- [x] Dashboard shows data
- [x] Update statistics

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
→ Make sure backend server is running on port 5000

### "MongoDB connection error"
→ Check your MONGODB_URI in server/.env

### "npm run dev" fails
→ Make sure you ran `npm install` first

### Port already in use
→ Frontend: Change port in vite.config.js
→ Backend: Change PORT in server/.env

---

## 📝 Test Checklist

- [ ] Homepage loads
- [ ] Can navigate to all pages
- [ ] Contact form validates
- [ ] Contact form submits
- [ ] Projects page shows projects
- [ ] Can click on a project
- [ ] Gallery displays
- [ ] About page shows team
- [ ] Admin login works
- [ ] Dashboard shows stats
- [ ] Can view messages
- [ ] Can update statistics

---

## 🎉 Success Indicators

You'll know everything works when:

1. **Frontend running:** Console shows "VITE ready"
2. **Backend running:** Console shows "MongoDB Connected"
3. **Homepage:** Shows statistics (not loading spinner)
4. **Projects:** Shows project cards
5. **Contact form:** Submits successfully
6. **Admin:** Can login and see dashboard

---

## 💡 Pro Tips

1. **Use 2-3 terminals:**
   - Terminal 1: Backend (server)
   - Terminal 2: Frontend (client)
   - Terminal 3: Commands (seeder, curl, etc.)

2. **Browser DevTools:**
   - F12 to open
   - Network tab to see API calls
   - Console for errors

3. **Hot Reload:**
   - Both frontend & backend auto-reload on changes!
   - No need to restart

---

**Need help? Check:**
- COMPLETE_SUMMARY.md
- server/README.md
- client/README.md

**Let's go! 🚀**
