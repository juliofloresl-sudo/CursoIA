import { supabaseAdmin } from '../config/supabase.js';
import { turnModel } from '../models/turn-model.js';

export const cashCloseController = {
  async create(req, res, next) {
    try {
      const {
        id_turno: bodyIdTurno,
        id_supervisor: bodyIdSupervisor,
        efectivo_contado,
        efectivo_esperado,
        total_tarjeta,
        total_ventas,
        num_transacciones,
        justificacion,
        monto_cierre,
        monto_inicial
      } = req.body;

      const turnId = Number(bodyIdTurno);
      const supervisorId = bodyIdSupervisor ? Number(bodyIdSupervisor) : Number(req.user?.id ?? 0);
      const efectivoContado = Number(efectivo_contado ?? monto_cierre ?? 0);
      const efectivoEsperado = Number(efectivo_esperado ?? monto_inicial ?? 0);
      const totalTarjeta = Number(total_tarjeta ?? 0);
      const totalVentas = Number(total_ventas ?? 0);
      const numTransacciones = Number(num_transacciones ?? 0);

      if (!Number.isInteger(supervisorId) || supervisorId <= 0) {
        return res.status(400).json({ success: false, error: 'id_supervisor es requerido y debe ser un entero válido' });
      }

      let validTurnId = turnId;
      if (!Number.isInteger(validTurnId) || validTurnId <= 0) {
        const activeTurn = await turnModel.getActiveByCashier(req.user.id);
        validTurnId = activeTurn?.id_turno;
      }

      if (!Number.isInteger(validTurnId) || validTurnId <= 0) {
        return res.status(400).json({ success: false, error: 'id_turno es requerido o no existe un turno activo para este usuario' });
      }

      const existingTurn = await turnModel.getById(validTurnId);
      if (!existingTurn) {
        return res.status(400).json({ success: false, error: 'El turno especificado no existe' });
      }

      if (Number.isNaN(efectivoContado)) {
        return res.status(400).json({ success: false, error: 'monto_cierre o efectivo_contado debe ser numérico' });
      }
      if (Number.isNaN(efectivoEsperado)) {
        return res.status(400).json({ success: false, error: 'monto_inicial o efectivo_esperado debe ser numérico' });
      }

      const { data, error } = await supabaseAdmin.from('cortes_caja').insert({
        id_turno: validTurnId,
        id_supervisor: supervisorId,
        efectivo_esperado: efectivoEsperado,
        efectivo_contado: efectivoContado,
        diferencia: efectivoContado - efectivoEsperado,
        total_tarjeta: totalTarjeta,
        total_ventas: totalVentas,
        num_transacciones: numTransacciones,
        justificacion
      }).select();
      if (error) throw error;
      const result = Array.isArray(data) ? data[0] : data;
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  },

  async history(req, res, next) {
    try {
      const { data, error } = await supabaseAdmin.from('cortes_caja').select('*').order('creado_en', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return next(error);
    }
  }
};
