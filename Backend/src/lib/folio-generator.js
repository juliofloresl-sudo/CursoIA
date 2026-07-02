export const generateFolio = async (client, tableName = 'ventas') => {
  const prefix = 'VTA-';
  const { data, error } = await client.from(tableName).select('folio').order('id_venta', { ascending: false }).limit(1);

  if (error) {
    throw error;
  }

  const lastFolio = data?.[0]?.folio || `${prefix}0000000`;
  const lastNumber = Number(lastFolio.replace(prefix, '')) || 0;
  const nextNumber = lastNumber + 1;

  return `${prefix}${String(nextNumber).padStart(7, '0')}`;
};
