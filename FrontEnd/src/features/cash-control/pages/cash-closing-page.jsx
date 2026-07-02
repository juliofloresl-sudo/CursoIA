import { useState } from 'react';

export default function CashClosingPage() {
  const [counted, setCounted] = useState('');
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (Number(counted) < 1000) {
      setError('Por favor, ingrese una nota de justificación para la diferencia detectada');
      return;
    }
    setError('');
    alert('Corte de caja confirmado');
  };

  return (
    <div className="page">
      <h1>Cierre de turno</h1>
      <form className="card" onSubmit={handleSubmit}>
        <label htmlFor="counted">Efectivo contado</label>
        <input id="counted" type="number" value={counted} onChange={(event) => setCounted(event.target.value)} />
        {error ? <div className="alert error">{error}</div> : null}
        <label htmlFor="justification">Nota de justificación</label>
        <textarea id="justification" value={justification} onChange={(event) => setJustification(event.target.value)} />
        <button type="submit">Confirmar corte de caja</button>
      </form>
    </div>
  );
}
