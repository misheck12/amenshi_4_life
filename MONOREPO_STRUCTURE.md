# 📂 Monorepo Structure Guide for GitHub Actions

## Your Project Structure

```
amenshi_4_life/
├── client/                    # React Frontend
│   ├── src/
│   ├── package.json          ← Has its own dependencies
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── routes/
│   ├── models/
│   ├── package.json          ← Has its own dependencies
│   ├── package-lock.json
│   └── server.js
│
└── .github/
    └── workflows/
        ├── deploy.yml
        ├── deploy-rsync.yml
        └── pr-checks.yml
```

## ✅ How GitHub Actions Handles This

### 1️⃣ **Build & Test Stage (Matrix Strategy)**

The workflows use a **matrix** to process both directories in parallel:

```yaml
strategy:
  matrix:
    app: [client, server]
```

**This creates 2 parallel jobs:**

```
Job 1: Build client          Job 2: Build server
├─ Checkout code            ├─ Checkout code
├─ Setup Node.js            ├─ Setup Node.js
├─ cd client/               ├─ cd server/
├─ npm ci                   ├─ npm ci
├─ npm run lint             ├─ (skip lint)
└─ npm run build            └─ (validation only)
```

### 2️⃣ **Working Directory Handling**

Each step specifies the correct directory:

```yaml
- name: Install Dependencies
  working-directory: ./${{ matrix.app }}  # ./client or ./server
  run: npm ci
```

**Translates to:**
- For client: `cd ./client && npm ci`
- For server: `cd ./server && npm ci`

### 3️⃣ **Cache Configuration**

Npm cache is configured for both package-lock files:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: 'npm'
    cache-dependency-path: ${{ matrix.app }}/package-lock.json
```

**Results in:**
- Client job caches: `client/package-lock.json`
- Server job caches: `server/package-lock.json`

### 4️⃣ **Conditional Steps**

Some steps only run for specific directories:

```yaml
# Linter - CLIENT ONLY
- name: Run Linter (Client Only)
  if: matrix.app == 'client'
  working-directory: ./client
  run: npm run lint

# Build - CLIENT ONLY
- name: Build Application
  working-directory: ./${{ matrix.app }}
  run: |
    if [ "${{ matrix.app }}" == "client" ]; then
      npm run build
    fi

# Upload Artifacts - CLIENT ONLY
- name: Upload Build Artifacts (Client)
  if: matrix.app == 'client' && github.ref == 'refs/heads/main'
  uses: actions/upload-artifact@v4
  with:
    path: client/dist
```

## 🚀 Deployment Flow

### On Your VM, the workflow:

```bash
# 1. Navigate to project
cd $VM_PROJECT_PATH  # e.g., /home/ubuntu/amenshi_4_life

# 2. Pull latest code
git pull origin main

# 3. Handle SERVER
cd server
npm ci --production
pm2 restart amenshi4life-server

# 4. Handle CLIENT
cd ../client
npm ci
npm run build
sudo cp -r dist/* /var/www/amenshi4life/

# 5. Reload web server
sudo systemctl reload nginx
```

## 📦 Package.json Requirements

### ✅ CLIENT (client/package.json)

Must have these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",      ← Required for CI/CD
    "preview": "vite preview",
    "lint": "eslint ..."        ← Required for CI/CD
  }
}
```

### ✅ SERVER (server/package.json)

Must have these scripts:

```json
{
  "scripts": {
    "start": "node server.js",   ← Required for PM2
    "dev": "nodemon server.js"
  }
}
```

## 🔍 Verification Steps

### Check if your structure is compatible:

```bash
# 1. Verify both package.json files exist
ls client/package.json
ls server/package.json

# 2. Verify client has build script
cd client
npm run build  # Should work

# 3. Verify server can start
cd ../server
npm start  # Should work
```

## 🎯 Benefits of This Setup

✅ **Parallel Builds**: Client and server build simultaneously
✅ **Independent Caching**: Each has its own dependency cache
✅ **Selective Testing**: Only lint client, not server
✅ **Efficient**: Only builds what needs building
✅ **Scalable**: Easy to add more apps (e.g., `admin`, `mobile`)

## 🔧 Customization Options

### Add More Apps to the Matrix

If you add more directories (e.g., `admin/`):

```yaml
strategy:
  matrix:
    app: [client, server, admin]
```

### Different Node Versions per App

```yaml
strategy:
  matrix:
    include:
      - app: client
        node: '18.x'
      - app: server
        node: '20.x'
```

### App-Specific Environment Variables

```yaml
- name: Build Application
  working-directory: ./${{ matrix.app }}
  env:
    VITE_API_URL: ${{ secrets.API_URL }}  # Client only uses this
  run: npm run build
```

## 🐛 Common Issues & Solutions

### Issue 1: "npm ci failed" in one directory

**Cause**: Missing or outdated `package-lock.json`

**Solution**:
```bash
cd client  # or server
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Issue 2: Build works locally but fails in CI

**Cause**: Different Node versions or missing dependencies

**Solution**: Check Node version matches:
```bash
# Locally
node -v  # Should match workflow (18.x)

# Update if needed
nvm install 18
nvm use 18
```

### Issue 3: Cache not working

**Cause**: package-lock.json path incorrect

**Solution**: Verify the path in workflow matches your structure:
```yaml
cache-dependency-path: client/package-lock.json  # ✅ Correct
cache-dependency-path: package-lock.json         # ❌ Wrong for monorepo
```

## 📊 How It Appears in GitHub Actions

When you push code, you'll see:

```
CI/CD Pipeline
├─ Build and Test (client)  ✅ 2m 15s
├─ Build and Test (server)  ✅ 1m 45s
├─ Deploy to VM             ✅ 3m 30s
└─ Health Check             ✅ 15s

Total: ~5-6 minutes
```

## 💡 Pro Tips

### 1. Fail Fast Strategy
If one app fails, stop the others:

```yaml
strategy:
  fail-fast: true  # Stop all if one fails
  matrix:
    app: [client, server]
```

### 2. Separate Deployment Jobs
Deploy client and server independently:

```yaml
jobs:
  deploy-client:
    # ... deploy only client
  
  deploy-server:
    # ... deploy only server
```

### 3. Path-Based Triggers
Only run workflows when specific directories change:

```yaml
on:
  push:
    paths:
      - 'client/**'      # Only trigger on client changes
      - 'server/**'      # Or server changes
      - '.github/**'     # Or workflow changes
```

## ✅ Your Setup is Ready!

The workflows are **already optimized** for your `client` + `server` structure. No changes needed!

### What's Already Working:

✅ Separate dependency installation
✅ Independent builds
✅ Proper caching
✅ Conditional steps (lint only client)
✅ Correct working directories
✅ Efficient deployment

---

**You're all set! The workflows understand your monorepo structure perfectly.** 🎉
