import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const RegisterPage: React.FC = () => {
  // 1. Ganti 'name' jadi 'username'
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    // Validasi
    if (!username || !email || !password) {
      setError('Username, email, dan password tidak boleh kosong.');
      setLoading(false);
      return;
    }

    try {
      // 2. Kirim data ke backend (sesuai Postman)
      await api.post('/auth/register', {
        username: username, // <-- Ganti ini
        email: email,
        password: password,
      });

      // 3. Jika sukses...
      setLoading(false);
      alert('Registrasi berhasil! Silakan login.');
      
      // 4. Arahkan user ke halaman LOGIN
      navigate('/login'); 
      
    } catch (err: any) {
      // 5. Tangani error
      console.error('Registrasi gagal:', err);
      // Cek apakah ada pesan error spesifik dari backend
      const errMsg = err.response?.data?.message || 'Registrasi gagal. Email/Username mungkin sudah dipakai.';
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Halaman Registrasi</h1>
      
      <form onSubmit={handleSubmit}>
        {/* 6. Ganti form field 'name' jadi 'username' */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Mendaftar...' : 'Register'}
        </button>
      </form>
      
      {/* 7. Link untuk kembali ke Login */}
      <p style={{ marginTop: '20px' }}>
        Sudah punya akun? 
        <Link to="/login"> Login di sini</Link>
      </p>
    </div>
  );
};

export default RegisterPage;