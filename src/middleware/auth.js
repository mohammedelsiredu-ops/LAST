const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nicotine-clinic-jwt-secret-change-in-production';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.session.token;

  if (!token) {
    return res.status(401).json({ error: 'غير مصرح - الرجاء تسجيل الدخول' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'رمز غير صالح' });
  }
}

function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'غير مصرح' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'ليس لديك صلاحية للوصول' });
    }

    next();
  };
}

module.exports = { authMiddleware, roleMiddleware, JWT_SECRET };
