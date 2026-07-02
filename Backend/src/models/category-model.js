import { supabaseAdmin } from '../config/supabase.js';

export const categoryModel = {
  async create(category) {
    const { data, error } = await supabaseAdmin.from('categorias').insert(category).select().single();
    if (error) throw error;
    return data;
  },

  async list() {
    const { data, error } = await supabaseAdmin.from('categorias').select('*').eq('activo', true).order('nombre');
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin.from('categorias').select('*').eq('id_categoria', id).single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabaseAdmin.from('categorias').update(updates).eq('id_categoria', id).select().single();
    if (error) throw error;
    return data;
  },

  async deactivate(id) {
    const { data, error } = await supabaseAdmin.from('categorias').update({ activo: false }).eq('id_categoria', id).select().single();
    if (error) throw error;
    return data;
  }
};
