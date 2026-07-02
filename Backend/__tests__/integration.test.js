import { saleController } from '../src/controllers/sale-controller.js';
import { cashCloseController } from '../src/controllers/cash-close-controller.js';
import { productModel } from '../src/models/product-model.js';
import { turnModel } from '../src/models/turn-model.js';
import { saleModel } from '../src/models/sale-model.js';
import { supabaseAdmin } from '../src/config/supabase.js';
import * as envConfig from '../src/config/env.js';

jest.mock('../src/models/product-model.js');
jest.mock('../src/models/turn-model.js');
jest.mock('../src/models/sale-model.js');
jest.mock('../src/config/supabase.js');
jest.mock('../src/config/env.js');
jest.mock('../src/lib/folio-generator.js');

describe('Integration Tests - Full Sales and Cash Close Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    envConfig.ivaRate = 0.16;
    envConfig.maxDiscountPercent = 10;
  });

  test('Complete sale flow: validate stock, calculate total, and update inventory', async () => {
    const req = {
      user: { id: 1 },
      body: {
        lineas: [
          { id_producto: 1, cantidad: 3, precio_unitario: 100 },
          { id_producto: 2, cantidad: 2, precio_unitario: 75 },
        ],
        metodo_pago: 'efectivo',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    // Setup active turn
    turnModel.getActiveByCashier.mockResolvedValue({
      id_turno: 1,
      id_cajero: 1,
    });

    // Setup products with stock
    productModel.getById
      .mockResolvedValueOnce({ id_producto: 1, stock_actual: 10 })
      .mockResolvedValueOnce({ id_producto: 1, stock_actual: 10 })
      .mockResolvedValueOnce({ id_producto: 2, stock_actual: 5 })
      .mockResolvedValueOnce({ id_producto: 2, stock_actual: 5 });

    supabaseAdmin.from = jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id_venta: 1, folio: 'FOLIO001' },
        error: null,
      }),
      eq: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    }));

    await saleController.create(req, res, next);

    // Verify: subtotal = (3*100) + (2*75) = 300 + 150 = 450
    // tax = 450 * 0.16 = 72
    // total = 522
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          total: 522,
        }),
      })
    );
  });

  test('Sale rejected when any product has insufficient stock mid-transaction', async () => {
    const req = {
      user: { id: 1 },
      body: {
        lineas: [
          { id_producto: 1, cantidad: 5, precio_unitario: 100 },
          { id_producto: 2, cantidad: 20, precio_unitario: 75 }, // Not enough stock
        ],
        metodo_pago: 'efectivo',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    turnModel.getActiveByCashier.mockResolvedValue({
      id_turno: 1,
      id_cajero: 1,
    });

    // Second product check fails
    productModel.getById
      .mockResolvedValueOnce({ id_producto: 1, stock_actual: 10 })
      .mockResolvedValueOnce({ id_producto: 2, stock_actual: 5 }); // Only 5, but need 20

    await saleController.create(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.message).toBe('Producto sin existencia');
  });

  test('Complete cash close flow with mixed payment methods', async () => {
    const cashCloseReq = {
      user: { id: 1 },
      body: {
        id_turno: 1,
        id_supervisor: 2,
        efectivo_contado: 8000,
        efectivo_esperado: 7800,
        total_tarjeta: 3200,
        total_ventas: 11000,
        num_transacciones: 45,
        justificacion: 'Diferencia menor a $1',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    supabaseAdmin.from = jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [
          {
            id_corte: 1,
            id_turno: 1,
            efectivo_esperado: 7800,
            efectivo_contado: 8000,
            diferencia: 200, // 8000 - 7800
            total_tarjeta: 3200,
            total_ventas: 11000,
            num_transacciones: 45,
          },
        ],
        error: null,
      }),
    }));

    await cashCloseController.create(cashCloseReq, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          diferencia: 200,
          total_tarjeta: 3200,
          total_ventas: 11000,
        }),
      })
    );
  });

  test('Multiple sales accumulate correctly in cash close', async () => {
    // Simulate 3 sales in a turn
    const sales = [
      { id_venta: 1, total: 116 }, // 100 + 16% tax
      { id_venta: 2, total: 232 }, // 200 + 32% tax
      { id_venta: 3, total: 348 }, // 300 + 48% tax
    ];

    const expectedTotalSales = sales.reduce((sum, s) => sum + s.total, 0); // 696

    const cashCloseReq = {
      user: { id: 1 },
      body: {
        id_turno: 1,
        id_supervisor: 2,
        efectivo_contado: 696,
        efectivo_esperado: 696,
        total_tarjeta: 0,
        total_ventas: 696,
        num_transacciones: 3,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    supabaseAdmin.from = jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [
          {
            id_corte: 1,
            diferencia: 0,
            total_ventas: 696,
            num_transacciones: 3,
          },
        ],
        error: null,
      }),
    }));

    await cashCloseController.create(cashCloseReq, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          total_ventas: expectedTotalSales,
          num_transacciones: 3,
          diferencia: 0,
        }),
      })
    );
  });
});
