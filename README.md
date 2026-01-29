# NICOTINE - نظام إدارة العيادة الطبية 🏥

Multi-user Clinic Management System with PostgreSQL database.

## Features ✨

- **Multi-user Authentication**: Doctor, Nurse, Lab Technician, Pharmacy
- **Patient Management**: Complete patient records with medical history
- **Medical Records**: Track diagnoses, treatments, and symptoms
- **Lab Tests**: Order and track laboratory tests
- **Prescriptions**: Create and dispense medications
- **Dashboard**: Real-time statistics and analytics
- **Responsive Design**: Works on desktop and mobile

## Tech Stack 🛠️

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Quick Start 🚀

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd nicotine-clinic-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Initialize database**
```bash
npm run init-db
```

5. **Start the server**
```bash
npm start
# For development with auto-reload:
npm run dev
```

6. **Access the application**
Open http://localhost:3000

## Default Credentials 🔐

After running `npm run init-db`, use these credentials:

- **Username**: doctor, nurse, lab, or pharmacy
- **Password**: admin123

⚠️ **IMPORTANT**: Change these passwords in production!

## Deployment to Render.com 🌐

### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy on Render**
- Go to https://render.com
- Click "New +" → "Blueprint"
- Connect your GitHub repository
- Render will automatically detect `render.yaml`
- Click "Apply"

3. **Initialize Database**
After deployment, run in Render Shell:
```bash
npm run init-db
```

### Option 2: Manual Setup

1. **Create PostgreSQL Database**
- Go to Render Dashboard
- New → PostgreSQL
- Name: nicotine-clinic-db
- Copy the "Internal Database URL"

2. **Create Web Service**
- New → Web Service
- Connect your GitHub repo
- Settings:
  - Name: nicotine-clinic
  - Environment: Node
  - Build Command: `npm install`
  - Start Command: `npm start`

3. **Add Environment Variables**
```
NODE_ENV=production
DATABASE_URL=<your-postgres-internal-url>
SESSION_SECRET=<generate-random-string>
JWT_SECRET=<generate-random-string>
```

4. **Deploy and Initialize**
- Click "Create Web Service"
- After deployment, open Shell and run: `npm run init-db`

## Database Schema 📊

### Tables

- **users**: System users (doctors, nurses, lab, pharmacy)
- **patients**: Patient demographic information
- **medical_records**: Diagnosis and treatment records
- **lab_tests**: Laboratory test orders and results
- **prescriptions**: Medication prescriptions

## API Endpoints 📡

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Medical Records
- `GET /api/medical-records/patient/:patientId` - Get patient records
- `POST /api/medical-records` - Create medical record

### Lab Tests
- `GET /api/lab-tests` - List lab tests
- `GET /api/lab-tests/patient/:patientId` - Get patient lab tests
- `POST /api/lab-tests` - Create lab test order
- `PUT /api/lab-tests/:id` - Update lab test status

### Prescriptions
- `GET /api/prescriptions` - List prescriptions
- `GET /api/prescriptions/patient/:patientId` - Get patient prescriptions
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent` - Get recent activities

## Security 🔒

- JWT authentication
- Password hashing with bcrypt
- Session management
- Rate limiting
- Helmet.js security headers
- CORS configuration
- SQL injection protection (parameterized queries)

## Project Structure 📁

```
nicotine-clinic-app/
├── public/
│   └── index.html          # Frontend application
├── src/
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── medicalRecords.js
│   │   ├── labTests.js
│   │   ├── prescriptions.js
│   │   └── dashboard.js
│   ├── middleware/         # Express middleware
│   │   └── auth.js
│   ├── db.js              # Database configuration
│   └── initDb.js          # Database initialization
├── server.js              # Main server file
├── package.json
├── render.yaml           # Render deployment config
├── .env.example          # Environment variables template
└── README.md
```

## Troubleshooting 🔧

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if PostgreSQL is running
- Ensure network connectivity

### Authentication Errors
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify user credentials

### Deployment Issues
- Check Render logs for errors
- Ensure all environment variables are set
- Run `npm run init-db` after first deployment

## Support 💬

For issues or questions:
- Create an issue on GitHub
- Contact: your-email@example.com

## License 📄

MIT License

---

Made with ❤️ for healthcare professionals
