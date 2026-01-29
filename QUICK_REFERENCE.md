# ⚡ QUICK REFERENCE CARD

## 🚀 Deploy in 3 Steps

### Step 1: GitHub (3 min)
```bash
cd nicotine-clinic-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Render (5 min)
1. render.com → New + → Blueprint
2. Connect GitHub repo
3. Click "Apply"

### Step 3: Initialize (2 min)
In Render Shell:
```bash
npm run init-db
```

**Done! 🎉**

---

## 🔑 Default Login

**URL**: https://your-app.onrender.com

| Role | Username | Password |
|------|----------|----------|
| Doctor | doctor | admin123 |
| Nurse | nurse | admin123 |
| Lab | lab | admin123 |
| Pharmacy | pharmacy | admin123 |

---

## 📝 Common Commands

**Local Development:**
```bash
npm install          # Install dependencies
npm start           # Start server
npm run dev         # Start with auto-reload
npm run init-db     # Initialize database
```

**Git Commands:**
```bash
git status          # Check changes
git add .           # Stage all changes
git commit -m "msg" # Commit
git push           # Deploy to Render
```

---

## 🔧 Environment Variables

```env
DATABASE_URL=postgresql://...
NODE_ENV=production
SESSION_SECRET=random-string
JWT_SECRET=random-string
PORT=3000
```

---

## 🌐 API Quick Reference

**Auth:**
- POST /api/auth/login
- POST /api/auth/logout

**Patients:**
- GET /api/patients
- POST /api/patients
- PUT /api/patients/:id

**Medical Records:**
- GET /api/medical-records/patient/:id
- POST /api/medical-records

**Lab Tests:**
- GET /api/lab-tests
- POST /api/lab-tests
- PUT /api/lab-tests/:id

**Prescriptions:**
- GET /api/prescriptions
- POST /api/prescriptions
- PUT /api/prescriptions/:id

**Dashboard:**
- GET /api/dashboard/stats

---

## ⚠️ Important URLs

- **Render Dashboard**: https://dashboard.render.com
- **GitHub**: https://github.com
- **Documentation**: Check README.md

---

## 🆘 Troubleshooting

**Can't login?**
→ Run `npm run init-db` in Render Shell

**Database error?**
→ Check DATABASE_URL environment variable

**404 errors?**
→ Verify deployment succeeded in Render

**Slow loading?**
→ Free tier spins down after 15 min (upgrade to paid)

---

## 💡 Tips

✅ Change passwords immediately in production
✅ Backup database regularly
✅ Monitor Render logs
✅ Upgrade to paid for production use
✅ Use strong SESSION_SECRET and JWT_SECRET

---

## 📞 Files to Read

1. **CHECKLIST.md** - Launch checklist
2. **DEPLOYMENT.md** - Full deployment guide  
3. **README.md** - Complete documentation
4. **PROJECT_SUMMARY.md** - Project overview

---

**Need more help?** Read the documentation files!
