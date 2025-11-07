// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// <-- "Penjaga"

// Import semua halaman
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import AddBookPage from './pages/AddBookPage';
import TransactionListPage from './pages/TransactionListPage'; // (Halaman Transaksi)

function App() {
  return (
    <div>
      <Navbar /> 
      <main style={{ padding: '1rem' }}>
        <Routes>
          {/* == Rute Publik (Siapapun boleh) == */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* == Rute Terproteksi (Harus Login) == */}

          
        </Routes>
      </main>
    </div>
  )
}

export default App