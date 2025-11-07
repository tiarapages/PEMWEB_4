// src/pages/BookDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

// Tipe Data (Sesuai 'getBookDetailController' kamu)
interface BookDetail {
  id: string;
  title: string;
  writer: string;
  publisher: string;
  price: number;
  stock_quantity: number;
  genre: string | null;
  description: string | null;
  publication_year: number;
}

const BookDetailPage: React.FC = () => {
  // Ambil 'book_id' dari URL (sesuai App.tsx)
  const { book_id } = useParams<{ book_id: string }>(); 
  
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!book_id) return; 
    const fetchBookDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Panggil API 'Get Book by ID' (sesuai backend: /books/:book_id)
        const response = await api.get(`/books/${book_id}`);
        // Simpan data (sesuai struktur: res.data.data)
        setBook(response.data.data || null); 

      } catch (err: any) {
        setError("Gagal memuat data buku.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [book_id]); // Jalan tiap 'book_id' di URL berubah

  // Tampilan
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!book) return <div>Buku tidak ditemukan.</div>;

  return (
    <div>
      <Link to="/">&lt; Kembali ke Daftar Buku</Link>
      
      <h1>{book.title}</h1>
      <p>oleh: <strong>{book.writer}</strong></p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Kolom Kiri: Detail */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h3>Detail:</h3>
          <p><strong>Penerbit:</strong> {book.publisher}</p>
          <p><strong>Tahun Terbit:</strong> {book.publication_year}</p>
          <p><strong>Genre:</strong> {book.genre || 'N/A'}</p>
        </div>
        {/* Kolom Kanan: Beli */}
        <div style={{ flex: 1, minWidth: '200px', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h3>Beli</h3>
          <h2 style={{ marginTop: 0 }}>Rp{book.price.toLocaleString('id-ID')}</h2>
          <p>Stok: {book.stock_quantity}</p>
          <button style={{ width: '100%' }} disabled={book.stock_quantity === 0}>
            {book.stock_quantity === 0 ? 'Stok Habis' : 'Masukkan Keranjang'}
          </button>
        </div>
      </div>
      
      <h3>Deskripsi:</h3>
      <p>{book.description || 'Tidak ada deskripsi.'}</p>
    </div>
  );
};

export default BookDetailPage;