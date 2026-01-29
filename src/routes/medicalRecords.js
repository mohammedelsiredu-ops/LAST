const express = require('express');
const db = require('../db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get medical records for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT mr.*, u.full_name as doctor_name 
       FROM medical_records mr
       LEFT JOIN users u ON mr.created_by = u.id
       WHERE mr.patient_id = $1
       ORDER BY mr.created_at DESC`,
      [req.params.patientId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب السجلات الطبية' });
  }
});

// Create medical record (doctor only)
router.post('/', roleMiddleware('doctor'), async (req, res) => {
  try {
    const { patientId, symptoms, diagnosis, treatment } = req.body;

    if (!patientId || !symptoms || !diagnosis) {
      return res.status(400).json({ error: 'الرجاء ملء الحقول المطلوبة' });
    }

    const result = await db.query(
      `INSERT INTO medical_records (patient_id, symptoms, diagnosis, treatment, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patientId, symptoms, diagnosis, treatment, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة السجل الطبي' });
  }
});

module.exports = router;
