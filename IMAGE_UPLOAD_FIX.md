# Image Upload Fix Guide

## Issue
After uploading images, you were getting "site can't be reached" error.

## Root Cause
The upload route was trying to construct URLs dynamically using request headers, but this could fail in certain scenarios.

## Solution Applied

### 1. Updated Upload Route
- Added better error handling with `console.error`
- Made URL construction more robust with fallback
- Added support for `BASE_URL` environment variable

### 2. How It Works Now

**Option 1: Using Environment Variable (Recommended for Production)**
Add to your `.env` file:
```
BASE_URL=http://localhost:5000
```

**Option 2: Auto-detect (Development)**
If no `BASE_URL` is set, it automatically constructs from the request.

## Testing the Fix

1. **Restart the server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Test Upload:**
   - Go to `/admin/gallery` (or any manager)
   - Upload a photo
   - Should see success message
   - Photo should display in preview

3. **Check Public Page:**
   - Go to `/gallery`
   - Uploaded photos should display

## If Still Having Issues

### Check Server Console
Look for error messages when uploading. The route now logs errors.

### Verify Uploads Directory
```bash
cd server
dir uploads
```
Should show uploaded files.

### Check Image URL Format
Images should be saved as:
```
http://localhost:5000/uploads/1234567890-filename.jpg
```

### Alternative: Temporary Fix
If the dynamic URL still doesn't work, you can hardcode it:

In `server/routes/upload.js`, change line 13 to:
```javascript
const baseUrl = 'http://localhost:5000';
```

## For Production Deployment

Add to your production `.env`:
```
BASE_URL=https://yourdomain.com
```

This ensures images use the correct domain in production.

## Troubleshooting Commands

**Check if server is running:**
```bash
curl http://localhost:5000/health
```

**Test upload endpoint (requires auth token):**
```bash
# Get uploads folder contents
cd server
dir uploads
```

**Check server logs:**
Look at the terminal running `npm run dev` for any error messages.

---

**The upload should now work correctly!** 📸✨
