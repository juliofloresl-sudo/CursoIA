import { saleController } from '../src/controllers/sale-controller.js';
import { productModel } from '../src/models/product-model.js';
import { turnModel } from '../src/models/turn-model.js';
import { supabaseAdmin } from '../src/config/supabase.js';
import * as envConfig from '../src/config/env.js';

jest.mock('../src/models/product-model.js');
jest.mock('../src/models/turn-model.js');
jest.mock('../src/config/supabase.js');
jest.mock('../src/config/env.js');
jest.mock('../src/lib/folio-generator.js');

describe('Sale Controller - Sales Total Calculation', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      user: { id: 1 },
      body: {
        lineas: [
          { id_producto: 1, cantidad: 2, precio_unitario: 100 },
          { id_producto: 2, cantidad: 1, precio_unitario: 50 },
        ],
        metodo_pago: 'efectivo',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    // Mock IVA rate (16%)
    envConfig.ivaRate = 0.16;
    envConfig.maxDiscountPercent = 10;
  });

  test('Should calculate total with correct subtotal, tax, and final total', async () => {
    // Setup mocks
    turnModel.getActiveByCashier.mockResolvedValue({
      id_turno: 1,
      id_cajero: 1,
    });

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

    // Expected calculation:
    // Line 1: 2 * 100 = 200
    // Line 2: 1 * 50 = 50
    // Subtotal = 250
    // Tax = 250 * 0.16 = 40
    // Total = 290

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          total: 290,
        }),
      })
    );
  });

  test('Should apply line-level tax calculation correctly', async () => {
    // Setup mocks with single item
    req.body.lineas = [
      { id_producto: 1, cantidad: 1, precio_unitario: 100 },
    ];

    turnModel.getActiveByCashier.mockResolvedValue({
      id_turno: 1,
      id_cajero: 1,
    });

    productModel.getById
      .mockResolvedValueOnce({ id_producto: 1, stock_actual: 10 })
      .mockResolvedValueOnce({ id_producto: 1, stock_actual: 10 });

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

    // Expected: 100 + (100 * 0.16) = 116
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          total: 116,
        }),
      })
    );
  });
});

describe('Sale Controller - Insufficient Stock Validation', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      user: { id: 1 },
      body: {
        lineas: [
          { id_producto: 1, cantidad: 20, precio_unitario: 100 },
        ],
        metodo_pago: 'efectivo',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    envConfig.ivaRate = 0.16;
    envConfig.maxDiscountPercent = 10;
  });

  test('Should reject sale when product has insufficient stock', async () => {
    // Setup: Active turn exists
    turnModel.getActiveByCashier.mockResolvedValue({
      id_turno: 1,
      id_cajero: 1,
    });

    // Setup: Product has only 5 units but 20 requested
    productModel.getById.mockResolvedValue({
      id_producto: 1,
      stock_actual: 5,
      nombre: 'Producto A',
    });

    await saleController.create(req, res, next);

    // Should call next() with error
    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.message).toBe('Producto sin existencia');
    expect(error.statusCode).toBe(409);
  });

  test('Should reject sale when product stock is zero', async () => {
    turnModel.getActiveByCashier.mockResolvedValue({
      id_turno: 1,
      id_cajero: 1,
    });

    // Product has zero stock
    productModel.getById.mockResolvedValue({
      id_producto: 1,
      stock_actual: 0,
      nombre: 'Producto Sin Stock',
    });

    await saleController.create(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.message).toBe('Producto sin existencia');
    expect(error.statusCode).toBe(409);
  });

  test('Should allow sale when product stock matches exactly requested quantity', async () => {
    req.body.lineas = [
      { id_producto: 1, cantidad: 10, precio_unitario: 100 },
    ];

    turnModel.getActiveByCashier.mockResolvedValue({
      id_turno: 1,
      id_cajero: 1,
    });

    // Product has exactly 10 units
    productModel.getById
      .mockResolvedValueOnce({ id_producto: 1, stock_actual: 10 })
      .mockResolvedValueOnce({ id_producto: 1, stock_actual: 10 });

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

    expect(res.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });

  test('Should reject sale when ANY line item has insufficient stock', async () => {
    req.body.lineas = [
      { id_producto: 1, cantidad: 5, precio_unitario: 100 },
      { id_producto: 2, cantidad: 100, precio_unitario: 50 }, // This one fails
    ];

    turnModel.getActiveByCashier.mockResolvedValue({
      id_turno: 1,
      id_cajero: 1,
    });

    productModel.getById
      .mockResolvedValueOnce({ id_producto: 1, stock_actual: 10 }) // OK
      .mockResolvedValueOnce({ id_producto: 2, stock_actual: 5 }); // FAIL - need 100, have 5

    await saleController.create(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.message).toBe('Producto sin existencia');
  });

  test('Should reject sale when no active turn exists', async () => {
    turnModel.getActiveByCashier.mockResolvedValue(null);

    await saleController.create(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error.message).toBe('El cajero no tiene un turno abierto');
    expect(error.statusCode).toBe(409);
  });
});
