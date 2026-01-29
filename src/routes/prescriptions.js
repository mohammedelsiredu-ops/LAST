const express = require('express');
const db = require('../db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get all prescriptions (with optional filter)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT pr.*, p.full_name as patient_name, p.national_id,
             u1.full_name as prescribed_by_name, u2.full_name as dispensed_by_name
      FROM prescriptions pr
      LEFT JOIN patients p ON pr.patient_id = p.id
      LEFT JOIN users u1 ON pr.created_by = u1.id
      LEFT JOIN users u2 ON pr.dispensed_by = u2.id
    `;
    let params = [];

    if (status) {
      query += ' WHERE pr.status = $1';
      params = [status];
    }

    query += ' ORDER BY pr.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الوصفات' });
  }
});

// Get prescriptions for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT pr.*, u1.full_name as prescribed_by_name, u2.full_name as dispensed_by_name
       FROM prescriptions pr
       LEFT JOIN users u1 ON pr.created_by = u1.id
       LEFT JOIN users u2 ON pr.dispensed_by = u2.id
       WHERE pr.patient_id = $1
       ORDER BY pr.created_at DESC`,
      [req.params.patientId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب وصفات المريض' });
  }
});

// Create prescription (doctor only)
router.post('/', roleMiddleware('doctor'), async (req, res) => {
  try {
    const { 
      patientId, medicineName, dosage, frequency, 
      duration, timing, notes 
    } = req.body;

    if (!patientId || !medicineName || !dosage || !frequency || !duration || !timing) {
      return res.status(400).json({ error: 'الرجاء ملء جميع الحقول المطلوبة' });
    }

    const result = await db.query(
      `INSERT INTO prescriptions 
       (patient_id, medicine_name, dosage, frequency, duration, timing, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [patientId, medicineName, dosage, frequency, duration, timing, notes, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة الوصفة' });
  }
});

// Update prescription status (pharmacy)
router.put('/:id', roleMiddleware('pharmacy'), async (req, res) => {
  try {
    const { status } = req.body;

    const result = await db.query(
      `UPDATE prescriptions 
       SET status = $1, dispensed_by = $2, dispensed_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الوصفة غير موجودة' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث الوصفة' });
  }
});

module.exports = router;
