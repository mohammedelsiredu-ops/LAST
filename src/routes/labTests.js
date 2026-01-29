const express = require('express');
const db = require('../db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get all lab tests (with optional filter)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT lt.*, p.full_name as patient_name, p.national_id,
             u1.full_name as ordered_by_name, u2.full_name as completed_by_name
      FROM lab_tests lt
      LEFT JOIN patients p ON lt.patient_id = p.id
      LEFT JOIN users u1 ON lt.created_by = u1.id
      LEFT JOIN users u2 ON lt.completed_by = u2.id
    `;
    let params = [];

    if (status) {
      query += ' WHERE lt.status = $1';
      params = [status];
    }

    query += ' ORDER BY lt.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get lab tests error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب التحاليل' });
  }
});

// Get lab tests for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT lt.*, u1.full_name as ordered_by_name, u2.full_name as completed_by_name
       FROM lab_tests lt
       LEFT JOIN users u1 ON lt.created_by = u1.id
       LEFT JOIN users u2 ON lt.completed_by = u2.id
       WHERE lt.patient_id = $1
       ORDER BY lt.created_at DESC`,
      [req.params.patientId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get patient lab tests error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب تحاليل المريض' });
  }
});

// Create lab test (doctor/nurse)
router.post('/', roleMiddleware('doctor', 'nurse'), async (req, res) => {
  try {
    const { patientId, testType, notes } = req.body;

    if (!patientId || !testType) {
      return res.status(400).json({ error: 'الرجاء ملء الحقول المطلوبة' });
    }

    const result = await db.query(
      `INSERT INTO lab_tests (patient_id, test_type, notes, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [patientId, testType, notes, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create lab test error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة التحليل' });
  }
});

// Update lab test status (lab tech)
router.put('/:id', roleMiddleware('lab'), async (req, res) => {
  try {
    const { status, result: testResult } = req.body;

    const completedAt = status === 'مكتمل' ? 'CURRENT_TIMESTAMP' : null;
    const completedBy = status === 'مكتمل' ? req.user.id : null;

    const queryResult = await db.query(
      `UPDATE lab_tests 
       SET status = $1, result = $2, completed_by = $3, 
           completed_at = ${status === 'مكتمل' ? 'CURRENT_TIMESTAMP' : 'completed_at'}
       WHERE id = $4
       RETURNING *`,
      [status, testResult, completedBy, req.params.id]
    );

    if (queryResult.rows.length === 0) {
      return res.status(404).json({ error: 'التحليل غير موجود' });
    }

    res.json(queryResult.rows[0]);
  } catch (error) {
    console.error('Update lab test error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تحديث التحليل' });
  }
});

module.exports = router;
