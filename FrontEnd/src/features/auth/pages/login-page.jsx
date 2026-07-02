import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/pos');
    } catch (error) {
      setErrorMessage('Error: Credenciales inválidas');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <p>Accede al sistema de punto de venta.</p>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Correo" />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contraseña" />
        {errorMessage ? <div className="alert error">{errorMessage}</div> : null}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
