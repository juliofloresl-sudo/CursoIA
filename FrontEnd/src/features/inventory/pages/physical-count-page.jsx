import { useState } from 'react';

const items = [
  { id: 1, name: 'Martillo', systemStock: 5, physicalStock: 4 },
  { id: 2, name: 'Clavos', systemStock: 3, physicalStock: 2 },
];

export default function PhysicalCountPage() {
  const [counts, setCounts] = useState(items);

  const handleChange = (id, value) => {
    setCounts((current) => current.map((item) => (item.id === id ? { ...item, physicalStock: Number(value) } : item)));
  };

  return (
    <div className="page">
      <h1>Conteo físico</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Teórico</th>
            <th>Real</th>
            <th>Diferencia</th>
          </tr>
        </thead>
        <tbody>
          {counts.map((item) => {
            const difference = item.physicalStock - item.systemStock;
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.systemStock}</td>
                <td>
                  <input type="number" value={item.physicalStock} onChange={(event) => handleChange(item.id, event.target.value)} />
                </td>
                <td className={difference < 0 ? 'negative' : ''}>{difference}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button type="button">Exportar PDF</button>
    </div>
  );
}
