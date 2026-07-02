import { supabaseAdmin } from '../config/supabase.js';
import { productModel } from '../models/product-model.js';

export const inventoryController = {
  async createMovement(req, res, next) {
    try {
      const {
        id_producto: bodyIdProducto,
        producto_id,
        cantidad,
        motivo,
        referencia,
        nota
      } = req.body;
      const id_producto = Number(bodyIdProducto ?? producto_id);
      const cantidadNumber = Number(cantidad);

      if (!Number.isInteger(id_producto) || id_producto <= 0) {
        return res.status(400).json({ success: false, error: 'id_producto es requerido y debe ser un entero válido' });
      }
      if (Number.isNaN(cantidadNumber) || cantidadNumber <= 0) {
        return res.status(400).json({ success: false, error: 'cantidad es requerida y debe ser un número positivo' });
      }

      const product = await productModel.getById(id_producto);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }

      const nextStock = product.stock_actual + cantidadNumber;

      await supabaseAdmin.from('productos').update({ stock_actual: nextStock }).eq('id_producto', id_producto);
      const { data, error } = await supabaseAdmin.from('movimientos_inventario').insert({
        id_producto,
        id_usuario: req.user.id,
        tipo_movimiento: 'entrada',
        cantidad: cantidadNumber,
        stock_anterior: product.stock_actual,
        stock_nuevo: nextStock,
        referencia: referencia ?? nota,
        motivo
      }).select().single();
      if (error) throw error;

      return res.status(201).json({ success: true, data });
    } catch (error) {
      return next(error);
    }
  },

  async createAdjustment(req, res, next) {
    try {
      const {
        id_producto: bodyIdProducto,
        producto_id,
        cantidad,
        motivo,
        nota
      } = req.body;
      const id_producto = Number(bodyIdProducto ?? producto_id);
      const cantidadNumber = Number(cantidad);

      if (!Number.isInteger(id_producto) || id_producto <= 0) {
        return res.status(400).json({ success: false, error: 'id_producto es requerido y debe ser un entero válido' });
      }
      if (Number.isNaN(cantidadNumber)) {
        return res.status(400).json({ success: false, error: 'cantidad es requerida y debe ser un número' });
      }

      const product = await productModel.getById(id_producto);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Producto no encontrado' });
      }

      const nextStock = product.stock_actual + cantidadNumber;

      await supabaseAdmin.from('productos').update({ stock_actual: nextStock }).eq('id_producto', id_producto);
      const { data, error } = await supabaseAdmin.from('movimientos_inventario').insert({
        id_producto,
        id_usuario: req.user.id,
        tipo_movimiento: 'ajuste_conteo',
        cantidad: cantidadNumber,
        stock_anterior: product.stock_actual,
        stock_nuevo: nextStock,
        motivo: motivo ?? nota
      }).select().single();
      if (error) throw error;

      return res.status(201).json({ success: true, data });
    } catch (error) {
      return next(error);
    }
  },

  async lowStock(req, res, next) {
    try {
      const { data, error } = await supabaseAdmin.from('v_stock_bajo').select('*');
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return next(error);
    }
  }
};
