import { turnModel } from '../models/turn-model.js';

export const turnController = {
  async open(req, res, next) {
    try {
      const fondoInicial = Number(req.body.fondo_inicial || 0);
      if (fondoInicial < 0) {
        const error = new Error('El fondo inicial no puede ser negativo');
        error.statusCode = 400;
        throw error;
      }

      const existing = await turnModel.getActiveByCashier(req.user.id);
      if (existing) {
        const error = new Error('Ya existe un turno abierto para este cajero');
        error.statusCode = 409;
        throw error;
      }

      const turn = await turnModel.openTurn({
        id_cajero: req.user.id,
        id_supervisor: req.body.id_supervisor || null,
        fondo_inicial: fondoInicial,
        estado: 'abierto'
      });

      return res.status(201).json({ success: true, data: turn });
    } catch (error) {
      return next(error);
    }
  },

  async getActive(req, res, next) {
    try {
      const turn = await turnModel.getActiveByCashier(req.user.id);
      if (!turn) {
        const error = new Error('No existe un turno activo para este cajero');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ success: true, data: turn });
    } catch (error) {
      return next(error);
    }
  }
};
