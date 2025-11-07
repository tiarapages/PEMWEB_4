// src/pages/BookListPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

// Tipe Data Buku (Sesuai 'getAllBookController' kamu)
interface Book {
  id: string;
  title: string;
  writer: string;
  price: number;
  stock_quantity: number;
  genre: string | null;
  publication_year: number;
}

// Tipe Data 'meta' (Pagination)
interface Meta {
  page: number;
  limit: number;
  prev_page: number | null;
  next_page: number | null;
}

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  
  // State untuk Fitur (Req #2)
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title'); // Default 'title'
  const [page, setPage] = useState(1);
  
  // State untuk UX
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data buku
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Kirim state fitur ke backend (sesuai controller baru)
        const response = await api.get('/books', {
          params: {
            search: search || undefined,
            sortBy: sortBy,
            page: page,
            limit: 10
          }
        });

        // Simpan data (sesuai struktur JSON kamu)
        setBooks(response.data.data || []);
        setMeta(response.data.meta || null);

      } catch (err: any) {
        console.error("Gagal mengambil buku:", err);
        setError("Gagal memuat data buku. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [search, sortBy, page]); // <-- Jalan lagi jika filter berubah

  // Fungsi Hapus (Req #5)
  const handleDelete = async (id: string, title: string) => {
    // Konfirmasi
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`);

    if (isConfirmed) {
      try {
        setLoading(true);
        // Panggil API (sesuai backend: /books/:book_id)
        await api.delete(`/books/${id}`);
        
        alert('Buku berhasil dihapus.');
        // Muat ulang data
        setPage(1); // Balik ke halaman 1

      } catch (err) {
        alert('Gagal menghapus buku.');
        console.error("Error hapus:", err);
        setLoading(false);
      }
    }
  };

  // Tampilan (JSX)
  if (loading && books.length === 0) return <div>Loading data buku...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1>Manajemen Buku</h1>
      
      {/* Link ke Halaman Tambah Buku (Req #4) */}
      <Link to="/add-book"><button>+ Tambah Buku Baru</button></Link>

      {/* Fitur (Req #2) */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Cari judul..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
        />
        
        {/* Filter 'condition' TIDAK ADA karena backend-mu tidak mendukungnya */}
        
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
        >
          <option value="title">Urutkan (Judul A-Z)</option>
          <option value="publication_year">Urutkan (Tahun Terbit)</option>
        </select>
      </div>

      {/* Daftar Buku (Req #2) */}
      {books.length === 0 && !loading ? (
        <div>Tidak ada buku yang ditemukan.</div>
      ) : (
        <>
          <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Judul</th>
                <th>Penulis</th>
                <th>Genre</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    {/* Link ke Detail (Req #3) */}
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </td>
                  <td>{book.writer}</td>
                  <td>{book.genre || 'N/A'}</td>
                  <td>Rp{book.price.toLocaleString('id-ID')}</td>
                  <td>{book.stock_quantity}</td>
                  <td>
                    {/* Tombol Hapus (Req #5) */}
                    <button onClick={() => handleDelete(book.id, book.title)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination (Req #2) */}
          {meta && (
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={meta.prev_page === null}
              >
                &lt; Sebelumnya
              </button>
              <span style={{ margin: '0 10px' }}>Halaman {meta.page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={meta.next_page === null}
              >
                Berikutnya &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookListPage;