# 🚀 QUICK DEPLOYMENT GUIDE

## Step 1: Push to GitHub

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Nicotine Clinic Management System"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Render.com

### Automatic (Recommended - Uses render.yaml)

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account and select your repository
4. Render will detect `render.yaml` automatically
5. Click **"Apply"**
6. Wait for deployment (5-10 minutes)

### Manual

1. **Create Database:**
   - New → PostgreSQL
   - Name: `nicotine-clinic-db`
   - Free plan
   - Create Database
   - Copy "Internal Database URL"

2. **Create Web Service:**
   - New → Web Service
   - Connect repository
   - Name: `nicotine-clinic`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     ```
     NODE_ENV=production
     DATABASE_URL=<paste-internal-database-url>
     SESSION_SECRET=<random-string>
     JWT_SECRET=<random-string>
     ```
   - Create Web Service

## Step 3: Initialize Database

After deployment completes:

1. Go to your Web Service dashboard
2. Click **"Shell"** tab
3. Run:
```bash
npm run init-db
```

## Step 4: Access Your App! 🎉

Your app URL: `https://nicotine-clinic.onrender.com` (or your custom URL)

### Default Login Credentials:

**Username:** doctor, nurse, lab, or pharmacy  
**Password:** admin123

⚠️ **CHANGE THESE IMMEDIATELY IN PRODUCTION!**

## Common Issues & Solutions

### Issue: Database connection failed
**Solution:** Check DATABASE_URL environment variable

### Issue: 404 on routes
**Solution:** Make sure build succeeded and server started

### Issue: Can't login
**Solution:** Run `npm run init-db` in Render Shell

## Updating the App

```bash
git add .
git commit -m "Update: description"
git push origin main
```

Render will automatically redeploy!

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgres://user:pass@host/db |
| NODE_ENV | Environment | production |
| SESSION_SECRET | Session encryption key | random-string-here |
| JWT_SECRET | JWT signing key | another-random-string |

## Next Steps

1. ✅ Change default passwords
2. ✅ Configure your domain (optional)
3. ✅ Set up monitoring
4. ✅ Backup database regularly
5. ✅ Add SSL certificate (Render provides free SSL)

---

Need help? Check README.md for detailed documentation!
