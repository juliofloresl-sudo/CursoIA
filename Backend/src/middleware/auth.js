import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  const userRole = req.user?.rol;
  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({ success: false, error: 'Acceso denegado' });
  }
  return next();
};
