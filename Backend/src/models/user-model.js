import { supabaseAdmin } from '../config/supabase.js';

export const userModel = {
  async getByEmail(email) {
    const { data, error } = await supabaseAdmin.from('usuarios').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin.from('usuarios').select('*').eq('id_usuario', id).maybeSingle();
    if (error) throw error;
    return data;
  }
};
