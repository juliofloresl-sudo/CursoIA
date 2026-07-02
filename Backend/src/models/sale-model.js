import { supabaseAdmin } from '../config/supabase.js';
import { generateFolio } from '../lib/folio-generator.js';

export const saleModel = {
  async createSale(saleData) {
    const folio = await generateFolio(supabaseAdmin, 'ventas');
    const payload = { ...saleData, folio };
    const { data, error } = await supabaseAdmin.from('ventas').insert(payload).select().single();
    if (error) throw error;
    return data;
  },

  async createDetail(detail) {
    const { data, error } = await supabaseAdmin.from('detalle_venta').insert(detail).select().single();
    if (error) throw error;
    return data;
  },

  async createInventoryMovement(movement) {
    const { data, error } = await supabaseAdmin.from('movimientos_inventario').insert(movement).select().single();
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin.from('ventas').select('*').eq('id_venta', id).single();
    if (error) throw error;
    return data;
  },

  async getByFolio(folio) {
    const { data, error } = await supabaseAdmin.from('ventas').select('*').eq('folio', folio).maybeSingle();
    if (error) throw error;
    return data;
  },

  async getDetails(idVenta) {
    const { data, error } = await supabaseAdmin.from('detalle_venta').select('*').eq('id_venta', idVenta);
    if (error) throw error;
    return data || [];
  },

  async applyDiscount(discount) {
    const { data, error } = await supabaseAdmin.from('descuentos_aplicados').insert(discount).select().single();
    if (error) throw error;
    return data;
  }
};
