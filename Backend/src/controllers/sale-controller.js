import { saleModel } from '../models/sale-model.js';
import { productModel } from '../models/product-model.js';
import { turnModel } from '../models/turn-model.js';
import { supabaseAdmin } from '../config/supabase.js';
import { ivaRate, maxDiscountPercent } from '../config/env.js';
import { generateFolio } from '../lib/folio-generator.js';

export const saleController = {
  async create(req, res, next) {
    try {
      const activeTurn = await turnModel.getActiveByCashier(req.user.id);
      if (!activeTurn) {
        const error = new Error('El cajero no tiene un turno abierto');
        error.statusCode = 409;
        throw error;
      }

      const lineas = req.body.lineas || [];
      for (const linea of lineas) {
        const product = await productModel.getById(linea.id_producto);
        if (!product || product.stock_actual < linea.cantidad) {
          const error = new Error('Producto sin existencia');
          error.statusCode = 409;
          throw error;
        }
      }

      const subtotal = lineas.reduce((sum, linea) => sum + Number(linea.precio_unitario) * Number(linea.cantidad), 0);
      const impuesto = subtotal * ivaRate;
      const total = subtotal + impuesto;
      const folio = await generateFolio(supabaseAdmin, 'ventas');

      const { data: sale, error: saleError } = await supabaseAdmin.from('ventas').insert({
        id_turno: activeTurn.id_turno,
        id_cajero: req.user.id,
        folio,
        metodo_pago: req.body.metodo_pago || 'efectivo',
        subtotal,
        impuesto,
        descuento_total: 0,
        total,
        monto_pagado: total,
        cambio: 0,
        estado: 'completada'
      }).select().single();
      if (saleError) throw saleError;

      for (const linea of lineas) {
        const product = await productModel.getById(linea.id_producto);
        const lineSubtotal = Number(linea.precio_unitario) * Number(linea.cantidad);
        const lineImpuesto = lineSubtotal * ivaRate;
        const lineTotal = lineSubtotal + lineImpuesto;
        await supabaseAdmin.from('detalle_venta').insert({
          id_venta: sale.id_venta,
          id_producto: linea.id_producto,
          cantidad: linea.cantidad,
          precio_unitario: linea.precio_unitario,
          subtotal_linea: lineSubtotal,
          impuesto_linea: lineImpuesto,
          total_linea: lineTotal
        });

        await supabaseAdmin.from('productos').update({ stock_actual: product.stock_actual - Number(linea.cantidad) }).eq('id_producto', linea.id_producto);
        await supabaseAdmin.from('movimientos_inventario').insert({
          id_producto: linea.id_producto,
          id_usuario: req.user.id,
          tipo_movimiento: 'salida_venta',
          cantidad: -Number(linea.cantidad),
          stock_anterior: product.stock_actual,
          stock_nuevo: product.stock_actual - Number(linea.cantidad),
          referencia: folio,
          motivo: 'Venta registrada'
        });
      }

      return res.status(201).json({ success: true, data: { sale, folio, total } });
    } catch (error) {
      return next(error);
    }
  },

  async applyDiscount(req, res, next) {
    try {
      const sale = await saleModel.getById(req.params.id);
      const discountPercent = Number(req.body.valor || 0);
      const authorized = req.body.id_autorizo && req.body.id_autorizo !== '';

      if (discountPercent > maxDiscountPercent && !authorized) {
        const error = new Error('Descuento fuera del límite permitido');
        error.statusCode = 403;
        throw error;
      }

      const discountAmount = sale.total * (discountPercent / 100);
      const updatedSale = await supabaseAdmin.from('ventas').update({ descuento_total: discountAmount, total: sale.total - discountAmount }).eq('id_venta', sale.id_venta).select().single();
      if (updatedSale.error) throw updatedSale.error;

      if (discountPercent > maxDiscountPercent) {
        await saleModel.applyDiscount({
          id_venta: sale.id_venta,
          id_autorizo: req.body.id_autorizo,
          tipo: 'porcentaje',
          valor: discountPercent,
          monto_aplicado: discountAmount
        });
      }

      return res.status(200).json({ success: true, data: { sale: updatedSale.data, descuento: discountAmount } });
    } catch (error) {
      return next(error);
    }
  },

  async getTicket(req, res, next) {
    try {
      const sale = await saleModel.getById(req.params.id);
      if (!sale) {
        const error = new Error('Venta no encontrada');
        error.statusCode = 404;
        throw error;
      }
      const details = await saleModel.getDetails(sale.id_venta);
      return res.status(200).json({ success: true, data: { reimpresion: true, venta: sale, detalle: details } });
    } catch (error) {
      return next(error);
    }
  },

  async createReturn(req, res, next) {
    try {
      const { folio, id_autorizo, lineas } = req.body;
      const originalSale = await saleModel.getByFolio(folio);
      if (!originalSale) {
        const error = new Error('Venta no encontrada');
        error.statusCode = 404;
        throw error;
      }

      const createdAt = new Date(originalSale.creado_en);
      const now = new Date();
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      if (diffDays > 30) {
        const error = new Error('La devolución excede los 30 días permitidos');
        error.statusCode = 409;
        throw error;
      }

      if (!id_autorizo) {
        const error = new Error('Se requiere autorización de supervisor');
        error.statusCode = 403;
        throw error;
      }

      const folioReturn = await generateFolio(supabaseAdmin, 'ventas');
      const { data: returnSale, error: returnError } = await supabaseAdmin.from('ventas').insert({
        id_turno: originalSale.id_turno,
        id_cajero: req.user.id,
        folio: folioReturn,
        metodo_pago: originalSale.metodo_pago,
        subtotal: 0,
        impuesto: 0,
        descuento_total: 0,
        total: 0,
        monto_pagado: 0,
        cambio: 0,
        estado: 'devuelta',
        es_devolucion: true,
        id_venta_origen: originalSale.id_venta
      }).select().single();
      if (returnError) throw returnError;

      for (const linea of lineas || []) {
        const product = await productModel.getById(linea.id_producto);
        await supabaseAdmin.from('productos').update({ stock_actual: product.stock_actual + Number(linea.cantidad) }).eq('id_producto', linea.id_producto);
        await supabaseAdmin.from('movimientos_inventario').insert({
          id_producto: linea.id_producto,
          id_usuario: req.user.id,
          tipo_movimiento: 'devolucion',
          cantidad: Number(linea.cantidad),
          stock_anterior: product.stock_actual,
          stock_nuevo: product.stock_actual + Number(linea.cantidad),
          referencia: folioReturn,
          motivo: 'Devolución'
        });
      }

      return res.status(201).json({ success: true, data: { folio: folioReturn, devolucion: returnSale } });
    } catch (error) {
      return next(error);
    }
  }
};
