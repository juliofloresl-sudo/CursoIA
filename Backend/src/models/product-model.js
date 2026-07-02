import { supabaseAdmin } from '../config/supabase.js';

export const productModel = {
  async create(product) {
    const { data, error } = await supabaseAdmin.from('productos').insert(product).select().single();
    if (error) throw error;
    return data;
  },

  async list(filters = {}) {
    let query = supabaseAdmin.from('productos').select('*').eq('activo', true);

    if (filters.busqueda) {
      const search = filters.busqueda.trim();
      query = query.or(`nombre.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    if (filters.categoria) {
      query = query.eq('id_categoria', filters.categoria);
    }

    if (!filters.incluirInactivos) {
      query = query.eq('activo', true);
    }

    const { data, error } = await query.order('nombre');
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin.from('productos').select('*').eq('id_producto', id).single();
    if (error) throw error;
    return data;
  },

  async getBySku(sku) {
    const { data, error } = await supabaseAdmin.from('productos').select('*').eq('sku', sku).maybeSingle();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabaseAdmin.from('productos').update(updates).eq('id_producto', id).select().single();
    if (error) throw error;
    return data;
  },

  async deactivate(id) {
    const { data, error } = await supabaseAdmin.from('productos').update({ activo: false }).eq('id_producto', id).select().single();
    if (error) throw error;
    return data;
  }
};
