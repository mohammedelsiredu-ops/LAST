require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('doctor', 'nurse', 'lab', 'pharmacy')),
        full_name VARCHAR(200) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create patients table
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        national_id VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        age INTEGER,
        gender VARCHAR(10),
        phone VARCHAR(20),
        address TEXT,
        blood_type VARCHAR(5),
        chronic_diseases TEXT,
        previous_surgeries TEXT,
        clinic_id VARCHAR(50),
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create medical records table
    await db.query(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        symptoms TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        treatment TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create lab tests table
    await db.query(`
      CREATE TABLE IF NOT EXISTS lab_tests (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        test_type VARCHAR(200) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'معلق' CHECK (status IN ('معلق', 'قيد الإجراء', 'مكتمل')),
        result TEXT,
        created_by INTEGER REFERENCES users(id),
        completed_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );
    `);

    // Create prescriptions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
        medicine_name VARCHAR(200) NOT NULL,
        dosage VARCHAR(100) NOT NULL,
        frequency VARCHAR(100) NOT NULL,
        duration INTEGER NOT NULL,
        timing VARCHAR(100) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'نشط' CHECK (status IN ('نشط', 'منتهي')),
        created_by INTEGER REFERENCES users(id),
        dispensed_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        dispensed_at TIMESTAMP
      );
    `);

    // Create indexes
    await db.query(`CREATE INDEX IF NOT EXISTS idx_patients_national_id ON patients(national_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_lab_tests_patient ON lab_tests(patient_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);`);

    console.log('✅ Tables created successfully');

    // Check if default users exist
    const userCheck = await db.query('SELECT COUNT(*) FROM users');
    
    if (parseInt(userCheck.rows[0].count) === 0) {
      console.log('👤 Creating default users...');
      
      const defaultPassword = await bcrypt.hash('admin123', 10);
      
      await db.query(`
        INSERT INTO users (username, password, role, full_name) VALUES
        ('doctor', $1, 'doctor', 'د. محمد أحمد'),
        ('nurse', $1, 'nurse', 'ممرضة فاطمة'),
        ('lab', $1, 'lab', 'فني مختبر علي'),
        ('pharmacy', $1, 'pharmacy', 'صيدلي سارة')
      `, [defaultPassword]);
      
      console.log('✅ Default users created');
      console.log('📝 Default credentials:');
      console.log('   Username: doctor, nurse, lab, or pharmacy');
      console.log('   Password: admin123');
      console.log('   ⚠️  CHANGE THESE IN PRODUCTION!');
    } else {
      console.log('👤 Users already exist');
    }

    console.log('🎉 Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
