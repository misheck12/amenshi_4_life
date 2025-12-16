# Projects Page Debugging Guide

## Check if Projects API is Working

### 1. Test Backend API Directly

Open browser and go to:
```
http://localhost:5000/api/projects
```

**Expected Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Water Well in Kamatipa Village",
      "description": "...",
      "location": "Kamatipa, Zambia",
      ...
    },
    ...
  ]
}
```

### 2. Check Frontend API Call

Open browser console (F12) on `/projects` page and run:
```javascript
fetch('http://localhost:5000/api/projects')
  .then(res => res.json())
  .then(data => console.log('Projects:', data))
```

Should show 5 projects.

### 3. Check React Query

In browser console on `/projects` page:
```javascript
// Check if data is cached
console.log('Query data:', window.__REACT_QUERY_STATE__)
```

### 4. Common Issues

**Issue: "No projects found" message**
- API not returning data
- React Query cache issue
- CORS blocking API call

**Issue: Loading spinner stuck**
- API call failing
- Check browser console for errors

**Issue: API returns 404**
- Backend not running
- Wrong API endpoint

### 5. Quick Fix

**Clear React Query cache:**
1. Hard refresh: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
2. Or clear browser cache
3. Restart frontend: Stop and `npm run dev` again

### 6. Verify Data Structure

The API should return:
```javascript
{
  data: {
    data: {
      success: true,
      data: [ /* array of projects */ ]
    }
  }
}
```

Projects page uses: `const projects = data?.data?.data || [];`

---

## Test Now:

1. Open: `http://localhost:5000/api/projects` in browser
2. Should see JSON with 5 projects
3. If you see projects in JSON, the backend works ✅
4. Then check frontend `/projects` page
5. Hard refresh (Ctrl + Shift + R)

If backend API shows projects but frontend doesn't, it's a frontend caching issue!
