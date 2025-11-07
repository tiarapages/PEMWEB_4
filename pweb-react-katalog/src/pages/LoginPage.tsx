import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Email dan password tidak boleh kosong.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password,
      });

      const token = response.data.data.access_token;
      localStorage.setItem('authToken', token);

      // Arahkan user ke halaman utama (daftar buku)
      navigate('/');
      
      // PAKSA RELOAD (Biar Navbar-nya ke-update)
      window.location.reload(); // <-- INI SATU BARIS TAMBAHANNYA

    } catch (err: any) {
      console.error('Login gagal:', err);
      setError('Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Halaman Login</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;