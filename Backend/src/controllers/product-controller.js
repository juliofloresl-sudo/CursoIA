import { productModel } from '../models/product-model.js';
import { supabaseAdmin } from '../config/supabase.js';
import { ivaRate } from '../config/env.js';

export const productController = {
  async list(req, res, next) {
    try {
      const filters = {
        busqueda: req.query.busqueda,
        categoria: req.query.categoria,
        incluirInactivos: req.query.incluirInactivos === 'true'
      };
      const products = await productModel.list(filters);
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const product = await productModel.getById(req.params.id);
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const existing = await productModel.getBySku(req.body.sku);
      if (existing) {
        const error = new Error('El SKU ya está registrado');
        error.statusCode = 409;
        throw error;
      }

      const product = await productModel.create({
        ...req.body,
        stock_actual: 0,
        activo: true,
        precio_venta: Number(req.body.precio_venta),
        precio_costo: Number(req.body.precio_costo)
      });

      return res.status(201).json({ success: true, data: product });
    } catch (error) {
      return next(error);
    }
  },

  async updatePrice(req, res, next) {
    try {
      if (Number(req.body.precio_venta) <= 0) {
        const error = new Error('El precio debe ser mayor a cero');
        error.statusCode = 400;
        throw error;
      }

      const product = await productModel.getById(req.params.id);
      const updated = await supabaseAdmin.from('productos').update({ precio_venta: Number(req.body.precio_venta) }).eq('id_producto', product.id_producto).select().single();
      if (updated.error) throw updated.error;

      return res.status(200).json({ success: true, data: updated.data });
    } catch (error) {
      return next(error);
    }
  },

  async deactivate(req, res, next) {
    try {
      const product = await productModel.deactivate(req.params.id);
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      return next(error);
    }
  },

  async calculateTotals(req, res, next) {
    try {
      const { lineas } = req.body;
      let subtotal = 0;
      const details = lineas.map((linea) => {
        const unitPrice = Number(linea.precio_unitario);
        const quantity = Number(linea.cantidad);
        const lineSubtotal = unitPrice * quantity;
        const impuesto = lineSubtotal * ivaRate;
        const total = lineSubtotal + impuesto;
        subtotal += lineSubtotal;
        return { ...linea, subtotal_linea: lineSubtotal, impuesto_linea: impuesto, total_linea: total };
      });

      return res.status(200).json({ success: true, data: { subtotal, impuesto: subtotal * ivaRate, total: subtotal + subtotal * ivaRate, lineas: details } });
    } catch (error) {
      return next(error);
    }
  }
};
