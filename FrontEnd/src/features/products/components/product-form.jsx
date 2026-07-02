import { useState } from 'react';
import { z } from 'zod';

const productSchema = z.object({
  precioVenta: z.number().positive('El precio debe ser mayor a cero'),
});

export default function ProductForm() {
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsed = productSchema.safeParse({ precioVenta: Number(price) });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setError('');
    alert('Precio actualizado');
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Editar precio</h2>
      <label htmlFor="price">Precio de venta</label>
      <input id="price" value={price} onChange={(event) => setPrice(event.target.value)} className={error ? 'input-error' : ''} />
      {error ? <div className="alert error">{error}</div> : null}
      <button type="submit">Guardar</button>
    </form>
  );
}
