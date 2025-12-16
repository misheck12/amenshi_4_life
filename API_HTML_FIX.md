# Fix: API Returning HTML Instead of JSON

## Problem
When accessing `http://localhost:5000/api/projects`, you're getting HTML instead of JSON.

## Likely Causes

### 1. Server Not Running on Port 5000
Check if another process is using port 5000.

**Solution:**
```bash
# Stop the current server (Ctrl+C)
# Check what's on port 5000
netstat -ano | findstr :5000

# Kill the process if needed
taskkill /PID <process_id> /F

# Restart server
npm run dev
```

### 2. Route Loading Error
The projects route might have a syntax error.

**Test:**
```bash
cd server
node routes/projects.js
```

If there's an error, it will show here.

### 3. Wrong URL
Make sure you're accessing the BACKEND, not frontend.

**Backend:** `http://localhost:5000/api/projects` ← Should return JSON
**Frontend:** `http://localhost:5173/api/projects` ← Returns HTML (wrong!)

### 4. Server Crashed silently
Check server terminal for errors.

## Quick Fix Steps

**1. Restart Backend Server:**
```bash
cd server
# Stop if running (Ctrl+C)
npm run dev
```

**2. Check Server Logs:**
Look for:
- ✅ "Server running on port 5000"
- ✅ "MongoDB Connected"
- ❌ Any red error messages

**3. Test API:**
```bash
# In new terminal
curl http://localhost:5000/api/projects
```

Should return JSON with projects data.

**4. If Still Getting HTML:**

The port might be wrong. Check your terminal:
- Look for "Server running on port XXXX"
- Use that port number instead of 5000

## Expected Response

```json
{
  "success": true,
  "count": 5,
  "total": 5,
 "data": [
    {
      "_id": "...",
      "title": "Water Well in Kamatipa Village",
      ...
    },
    ...
  ]
}
```

## If You See This HTML:
```html
<!DOCTYPE html>
<html>...
```

You're hitting the FRONTEND (port 5173), not backend (port 5000)!

---

## Action Required:

1. Check server terminal - what port is it running on?
2. Make sure you access: `http://localhost:5000/api/projects` (note the 5000)
3. Share any error messages from server terminal
