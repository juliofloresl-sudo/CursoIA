import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { userModel } from '../models/user-model.js';

export const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.getByEmail(email);

      if (!user) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      }

      const passwordMatches = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatches) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      }

      const token = jwt.sign({ id: user.id_usuario, email: user.email, rol: user.rol }, env.JWT_SECRET, { expiresIn: '8h' });

      return res.status(200).json({ success: true, data: { token, user: { id: user.id_usuario, nombre: user.nombre, email: user.email, rol: user.rol } } });
    } catch (error) {
      return next(error);
    }
  },

  async me(req, res, next) {
    try {
      const user = await userModel.getById(req.user.id);
      return res.status(200).json({ success: true, data: { id: user.id_usuario, nombre: user.nombre, email: user.email, rol: user.rol } });
    } catch (error) {
      return next(error);
    }
  }
};
