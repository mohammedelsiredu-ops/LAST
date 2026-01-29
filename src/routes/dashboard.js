const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {};

    // Total patients
    const patientsResult = await db.query('SELECT COUNT(*) FROM patients');
    stats.totalPatients = parseInt(patientsResult.rows[0].count);

    // Pending lab tests
    const pendingLabsResult = await db.query(
      "SELECT COUNT(*) FROM lab_tests WHERE status = 'معلق'"
    );
    stats.pendingLabs = parseInt(pendingLabsResult.rows[0].count);

    // Active prescriptions
    const activePrescriptionsResult = await db.query(
      "SELECT COUNT(*) FROM prescriptions WHERE status = 'نشط'"
    );
    stats.activePrescriptions = parseInt(activePrescriptionsResult.rows[0].count);

    // Today's appointments (medical records created today)
    const todayAppointmentsResult = await db.query(
      "SELECT COUNT(*) FROM medical_records WHERE DATE(created_at) = CURRENT_DATE"
    );
    stats.todayAppointments = parseInt(todayAppointmentsResult.rows[0].count);

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الإحصائيات' });
  }
});

// Get recent activities
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await db.query(
      `SELECT 'patient' as type, p.full_name as title, p.created_at as date
       FROM patients p
       UNION ALL
       SELECT 'lab' as type, CONCAT(lt.test_type, ' - ', p.full_name) as title, lt.created_at as date
       FROM lab_tests lt
       JOIN patients p ON lt.patient_id = p.id
       UNION ALL
       SELECT 'prescription' as type, CONCAT(pr.medicine_name, ' - ', p.full_name) as title, pr.created_at as date
       FROM prescriptions pr
       JOIN patients p ON pr.patient_id = p.id
       ORDER BY date DESC
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الأنشطة الأخيرة' });
  }
});

module.exports = router;
