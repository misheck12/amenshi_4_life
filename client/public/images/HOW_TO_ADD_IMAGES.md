# 📸 How to Add Your Real Images

## ✅ Placeholder Images Created

I've created placeholder images for all pages. You should now see:
- ✅ Colored boxes with labels
- ✅ All pages loading properly
- ✅ No broken image links

## 🎯 To Add Your Real Photos:

### 1. **Collect Your Photos**
Organize your photos in folders:
- Water well drilling/repairs
- Community celebrations
- Team members
- Babies at Somone House
- Education programs
- General gallery photos

### 2. **Optimize Your Images**

**Recommended sizes:**
- Hero background: 1920x1080px (landscape)
- Section images: 800x600px (landscape)
- Gallery photos: 800x800px (square)
- Team photos: 400x400px (square)

**Compress images:**
- Use: https://tinypng.com or https://squoosh.app
- Target: 80-90% quality
- Keep file size under 500KB each

### 3. **Replace Placeholder Images**

Navigate to: `client/public/images/`

**Replace these files:**
```
client/public/images/
├── hero-bg.jpg          ← Homepage hero background
├── about-us.jpg         ← About page main image
├── mission.jpg          ← Mission section photo
├── wells.jpg            ← Water wells ministry
├── babies.jpg           ← Somone House babies
├── education.jpg        ← Education program
└── gallery/
    ├── 1.jpg           ← Gallery photo 1
    ├── 2.jpg           ← Gallery photo 2
    ├── 3.jpg           ← Gallery photo 3
    ├── 4.jpg           ← Gallery photo 4
    ├── 5.jpg           ← Gallery photo 5
    └── 6.jpg           ← Gallery photo 6
```

### 4. **Add Team Member Photos**

Team photos are stored in the database. To add them:

**Option A: Via API** (recommended after you have images online)
```javascript
// Update team member with photo URL
PUT /api/team/:id
{
  "image": "https://your-image-url.com/photo.jpg"
}
```

**Option B: Local images**
1. Add photos to: `client/public/images/team/`
2. Update database with local paths: `/images/team/nancy.jpg`

### 5. **Add Project Images**

Projects can have multiple images:

**Via database:**
```javascript
// When creating/updating project
{
  "title": "Kamatipa Drilling",
  "images": [
    "https://your-cdn.com/project1.jpg",
    "https://your-cdn.com/project2.jpg"
  ]
}
```

## 🎨 Image Tips

### Best Practices:
1. **Use JPEG** for photos
2. **Use PNG** for logos/graphics with transparency
3. **Compress** before uploading
4. **Name files clearly**: `kamatipa-well-drilling.jpg`
5. **Avoid spaces** in filenames (use hyphens)

### Image Dimensions:
- **Hero (hero-bg.jpg):** 1920x1080px or larger
- **Section images:** 800x600px minimum
- **Gallery:** 800x800px (square looks best)
- **Team photos:** 400x400px (square headshots)

### Where to Host Images:
**For production (free options):**
- Cloudinary (free tier: 25GB)
- ImgBB (free unlimited)
- GitHub (if small files)
- Your server (if you have space)

## 🚀 Quick Start

**To test with your first image:**

1. Find a good photo of your water well project
2. Resize to 800x600px
3. Compress at https://tinypng.com
4. Save as: `wells.jpg`
5. Replace: `client/public/images/wells.jpg`
6. Refresh browser - you'll see it!

## 📁 Current Structure

```
client/public/images/
├── README.md            ← This guide
├── hero-bg.jpg         ← SVG placeholder
├── about-us.jpg        ← SVG placeholder
├── mission.jpg         ← SVG placeholder
├── wells.jpg           ← SVG placeholder
├── babies.jpg          ← SVG placeholder
├── education.jpg       ← SVG placeholder
└── gallery/
    ├── 1.jpg          ← SVG placeholder
    ├── 2.jpg          ← SVG placeholder
    ├── 3.jpg          ← SVG placeholder
    ├── 4.jpg          ← SVG placeholder
    ├── 5.jpg          ← SVG placeholder
    └── 6.jpg          ← SVG placeholder
```

## 💡 Pro Tips

1. **Start small**: Replace 1-2 images first to see how it works
2. **Backup originals**: Keep high-res originals in a safe place
3. **Batch process**: Use tools to resize/compress multiple images at once
4. **Test on mobile**: Make sure images look good on phones too
5. **Update alt text**: For accessibility, update image alt text in the code

## 🔧 Troubleshooting

**Image not showing?**
- Check filename matches exactly (case-sensitive)
- Check file is in correct folder
- Hard refresh browser (Ctrl+F5)
- Check browser console for errors

**Image too large/slow?**
- Compress more
- Reduce dimensions
- Convert to WebP format (modern)

---

**Your website will look amazing with real photos! 📸✨**

Replace the placeholders when you're ready!
