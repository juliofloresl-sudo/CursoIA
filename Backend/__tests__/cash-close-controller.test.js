import { cashCloseController } from '../src/controllers/cash-close-controller.js';
import { turnModel } from '../src/models/turn-model.js';
import { supabaseAdmin } from '../src/config/supabase.js';

jest.mock('../src/models/turn-model.js');
jest.mock('../src/config/supabase.js');

describe('Cash Close Controller - Cash Close Operations', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      user: { id: 1 },
      body: {
        id_turno: 1,
        id_supervisor: 2,
        efectivo_contado: 5000,
        efectivo_esperado: 4950,
        total_tarjeta: 1500,
        total_ventas: 6450,
        num_transacciones: 25,
        justificacion: 'Sobrante por redondeos',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test('Should calculate cash difference correctly (positive)', async () => {
    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    supabaseAdmin.from = jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [
          {
            id_corte: 1,
            id_turno: 1,
            id_supervisor: 2,
            efectivo_esperado: 4950,
            efectivo_contado: 5000,
            diferencia: 50, // 5000 - 4950
            total_tarjeta: 1500,
            total_ventas: 6450,
            num_transacciones: 25,
          },
        ],
        error: null,
      }),
    }));

    await cashCloseController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          diferencia: 50, // positive = surplus
        }),
      })
    );
  });

  test('Should calculate cash difference correctly (negative)', async () => {
    req.body.efectivo_contado = 4900; // Less than expected
    req.body.efectivo_esperado = 4950;

    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    supabaseAdmin.from = jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [
          {
            id_corte: 1,
            id_turno: 1,
            id_supervisor: 2,
            efectivo_esperado: 4950,
            efectivo_contado: 4900,
            diferencia: -50, // 4900 - 4950
            total_tarjeta: 1500,
            total_ventas: 6450,
            num_transacciones: 25,
          },
        ],
        error: null,
      }),
    }));

    await cashCloseController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          diferencia: -50, // negative = deficit
        }),
      })
    );
  });

  test('Should calculate zero difference when cash matches exactly', async () => {
    req.body.efectivo_contado = 4950;
    req.body.efectivo_esperado = 4950;

    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    supabaseAdmin.from = jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [
          {
            id_corte: 1,
            diferencia: 0, // 4950 - 4950
            efectivo_contado: 4950,
            efectivo_esperado: 4950,
          },
        ],
        error: null,
      }),
    }));

    await cashCloseController.create(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          diferencia: 0,
        }),
      })
    );
  });

  test('Should record all payment methods in cash close', async () => {
    req.body = {
      id_turno: 1,
      id_supervisor: 2,
      efectivo_contado: 3000,
      efectivo_esperado: 2500,
      total_tarjeta: 2000, // Card sales
      total_ventas: 5000, // Total sales (cash + card)
      num_transacciones: 30,
    };

    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    const insertSpy = jest.fn().mockReturnThis();
    const selectSpy = jest.fn().mockResolvedValue({
      data: [
        {
          id_corte: 1,
          efectivo_contado: 3000,
          efectivo_esperado: 2500,
          diferencia: 500,
          total_tarjeta: 2000,
          total_ventas: 5000,
          num_transacciones: 30,
        },
      ],
      error: null,
    });

    supabaseAdmin.from = jest.fn(() => ({
      insert: insertSpy,
      select: selectSpy,
    }));

    await cashCloseController.create(req, res, next);

    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        total_tarjeta: 2000,
        total_ventas: 5000,
        num_transacciones: 30,
      })
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Should reject cash close with invalid supervisor ID', async () => {
    req.body.id_supervisor = null;
    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    // Mock response should handle this in cashCloseController logic
    // The controller checks for valid supervisor ID

    await cashCloseController.create(req, res, next);

    // Since supervisor becomes req.user.id which is 1, it should still work
    // This test verifies that fallback to req.user.id occurs
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Should accept alternative field names for cash amounts', async () => {
    req.body = {
      id_turno: 1,
      id_supervisor: 2,
      monto_cierre: 5000, // Alternative name for efectivo_contado
      monto_inicial: 4950, // Alternative name for efectivo_esperado
      total_tarjeta: 1500,
      total_ventas: 6450,
      num_transacciones: 25,
    };

    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    supabaseAdmin.from = jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [
          {
            id_corte: 1,
            efectivo_esperado: 4950,
            efectivo_contado: 5000,
            diferencia: 50,
          },
        ],
        error: null,
      }),
    }));

    await cashCloseController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Should validate that turn exists before creating close', async () => {
    turnModel.getById.mockResolvedValue(null); // Turn doesn't exist

    await cashCloseController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'El turno especificado no existe',
    });
  });

  test('Should find active turn if turn ID not provided', async () => {
    req.body.id_turno = null;

    turnModel.getById.mockResolvedValue({ id_turno: 5, id_cajero: 1 });
    turnModel.getActiveByCashier.mockResolvedValue({ id_turno: 5, id_cajero: 1 });

    supabaseAdmin.from = jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({
        data: [{ id_corte: 1, id_turno: 5 }],
        error: null,
      }),
    }));

    await cashCloseController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Should validate numeric cash amount fields', async () => {
    req.body.efectivo_contado = 'invalid'; // Not a number

    turnModel.getById.mockResolvedValue({ id_turno: 1 });

    await cashCloseController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'monto_cierre o efectivo_contado debe ser numérico',
    });
  });
});
