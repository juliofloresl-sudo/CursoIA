import { supabaseAdmin } from '../config/supabase.js';

export const turnModel = {
  async openTurn(turn) {
    const { data, error } = await supabaseAdmin.from('turnos').insert(turn).select().single();
    if (error) throw error;
    return data;
  },

  async getActiveByCashier(idCajero) {
    const { data, error } = await supabaseAdmin
      .from('turnos')
      .select('*')
      .eq('id_cajero', idCajero)
      .eq('estado', 'abierto')
      .order('apertura', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabaseAdmin
      .from('turnos')
      .select('*')
      .eq('id_turno', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};
