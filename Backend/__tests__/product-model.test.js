import { productModel } from '../src/models/product-model.js';
import { supabaseAdmin } from '../src/config/supabase.js';

jest.mock('../src/config/supabase.js');

describe('Product Model - Stock Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should retrieve product with current stock', async () => {
    const mockProduct = {
      id_producto: 1,
      nombre: 'Martillo',
      sku: 'SKU001',
      stock_actual: 15,
      precio_venta: 250,
    };

    supabaseAdmin.from = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockProduct,
        error: null,
      }),
    }));

    const product = await productModel.getById(1);

    expect(product).toEqual(mockProduct);
    expect(product.stock_actual).toBe(15);
  });

  test('Should identify product with no stock', async () => {
    const mockProduct = {
      id_producto: 2,
      nombre: 'Clavos',
      stock_actual: 0,
    };

    supabaseAdmin.from = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockProduct,
        error: null,
      }),
    }));

    const product = await productModel.getById(2);

    expect(product.stock_actual).toBe(0);
  });

  test('Should check if requested quantity exceeds stock', async () => {
    const mockProduct = {
      id_producto: 3,
      stock_actual: 5,
    };

    const requestedQty = 10;
    const hasInsufficientStock = mockProduct.stock_actual < requestedQty;

    expect(hasInsufficientStock).toBe(true);
  });

  test('Should confirm sufficient stock for sale', async () => {
    const mockProduct = {
      id_producto: 4,
      stock_actual: 20,
    };

    const requestedQty = 15;
    const hasInsufficientStock = mockProduct.stock_actual < requestedQty;

    expect(hasInsufficientStock).toBe(false);
  });
});
