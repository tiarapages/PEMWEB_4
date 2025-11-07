import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  // 1. Bikin state untuk nyimpen status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 2. useEffect: Kode ini akan jalan SETIAP KALI 
  //    komponen Navbar dimuat atau di-refresh.
  useEffect(() => {
    // Cek apakah ada 'authToken' di local storage
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // [] artinya: "Jalankan ini sekali pas komponen dimuat"

  // 3. Fungsi untuk handle Logout
  const handleLogout = () => {
    // Sesuai requirement: Hapus token dari local storage
    localStorage.removeItem('authToken');
    
    // Update state & arahkan ke halaman login
    setIsLoggedIn(false);
    navigate('/login');
    window.location.reload(); // Paksa reload biar lebih pasti
  };

  // --- Style Sederhana (Biar rapi) ---
  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between', // Bikin elemen ke Kiri & Kanan
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#333',
    color: 'white',
  };

  const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    marginRight: '1rem',
  };
  // ------------------------------------

  return (
    <nav style={navStyle}>
      {/* Bagian Kiri: Link Halaman */}
      <div>
        <Link to="/" style={linkStyle}>
          Daftar Buku
        </Link>
        <Link to="/transactions" style={linkStyle}>
          Transaksiku
        </Link>
      </div>

      {/* Bagian Kanan: Login / Logout */}
      <div>
        {isLoggedIn ? (
          // 4. TAMPILAN JIKA SUDAH LOGIN
          <>
            <span style={{ marginRight: '1rem' }}>
              Halo, User! {/* Nanti kita ganti ini dgn email */}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          // 5. TAMPILAN JIKA BELUM LOGIN
          <div>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;