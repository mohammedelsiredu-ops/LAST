const express = require('express');
const db = require('../db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all patients
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM patients ORDER BY created_at DESC';
    let params = [];

    if (search) {
      query = 'SELECT * FROM patients WHERE full_name ILIKE $1 OR national_id ILIKE $1 ORDER BY created_at DESC';
      params = [`%${search}%`];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب المرضى' });
  }
});

// Get single patient
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'المريض غير موجود' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب بيانات المريض' });
  }
});

// Create patient (doctor/nurse only)
router.post('/', roleMiddleware('doctor', 'nurse'), async (req, res) => {
  try {
    const {
      nationalId, fullName, age, gender, phone, address,
      bloodType, chronicDiseases, previousSurgeries, clinicId
    } = req.body;

    if (!nationalId || !fullName) {
      return res.status(400).json({ error: 'الرجاء ملء الحقول المطلوبة' });
    }

    const result = await db.query(
      `INSERT INTO patients 
       (national_id, full_name, age, gender, phone, address, blood_type, 
        chronic_diseases, previous_surgeries, clinic_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [nationalId, fullName, age, gender, phone, address, bloodType,
       chronicDiseases, previousSurgeries, clinicId, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create patient error:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'الرقم القومي موجود بالفعل' });
    }
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة المريض' });
  }
});

// Update patient
router.put('/:id', roleMiddleware('doctor', 'nurse'), async (req, res) => {
  try {
    const {
      nationalId, fullName, age, gender, phone, address,
      bloodType, chronicDiseases, previousSurgeries, clinicId
    } = req.body;

    const result = await db.query(
      `UPDATE patients 
       SET national_id = $1, full_name = $2, age = $3, gender = $4, 
           phone = $5, address = $6, blood_type = $7, 
           chronic_diseases = $8, previous_surgeries = $9, 
           clinic_id = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [nationalId, fullName, age, gender, phone, address, bloodType,
       chronicDiseases, previousSurgeries, clinicId, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'المريض غير موجود' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث بيانات المريض' });
  }
});

// Delete patient
router.delete('/:id', roleMiddleware('doctor'), async (req, res) => {
  try {
    const result = await db.query('DELETE FROM patients WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'المريض غير موجود' });
    }

    res.json({ success: true, message: 'تم حذف المريض بنجاح' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف المريض' });
  }
});

module.exports = router;
