// src/pages/AddBookPage.tsx (REVISI)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

// Tipe data untuk Genre
interface Genre {
  id: number;
  name: string;
}

// 1. Tipe data untuk Form (SESUAIKAN DENGAN API)
interface BookFormData {
  title: string;
  writer: string;
  publisher: string;
  publication_year: number; // Dulu 'publication_date' (string), ganti jadi number
  price: number;
  stock_quantity: number; // Dulu 'stock', ganti jadi stock_quantity
  genre_id: number; // Tetap, sesuai requirement "fetch dari /genres"
  condition: 'Baru' | 'Bekas'; // Tetap, sesuai requirement
  isbn?: string; 
  description?: string; 
}

const AddBookPage: React.FC = () => {
  // == STATE ==
  const [genres, setGenres] = useState<Genre[]>([]); // Untuk dropdown
  const [formData, setFormData] = useState<BookFormData>({
    // 2. Sesuaikan state awal
    title: '',
    writer: '',
    publisher: '',
    publication_year: new Date().getFullYear(), // Default tahun sekarang
    price: 0,
    stock_quantity: 1, // Ganti nama
    genre_id: 0, 
    condition: 'Baru',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // == LOGIKA ==

  // 3. Ambil data Genre untuk dropdown (Sesuai Requirement)
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // ‼️ PENTING: Cek Postman! Endpoint-mu mungkin /genres, /api/genres?
        const response = await api.get('/genre'); 
        
        // ‼️ Sesuaikan 'response.data.data' dengan API-mu
        const genreData = response.data.data || [];
        setGenres(genreData); 
        
        if (genreData.length > 0) {
          setFormData(prev => ({ ...prev, genre_id: genreData[0].id }));
        }
      } catch (err) {
        console.error('Gagal mengambil genres:', err);
        setError('Gagal memuat data genre.');
      }
    };
    fetchGenres();
  }, []);

  // 4. Fungsi handle change (sudah otomatis handle 'number')
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'stock_quantity' || name === 'genre_id' || name === 'publication_year') 
               ? Number(value) 
               : value,
    }));
  };

  // 5. Fungsi submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.genre_id === 0 || !formData.title || !formData.writer) {
      setError('Judul, Penulis, dan Genre wajib diisi.');
      setLoading(false);
      return;
    }

    // ... (kode validasi) ...

    try {
      // === TAMBAHKAN "SULAP" DATA DI SINI ===
      const dataToSend = {
        ...formData, // Salin semua data dari form
        genreId: formData.genre_id, // 1. Buat key 'genreId' (camelCase) yg baru
        genre_id: undefined       // 2. Hapus key 'genre_id' (snake_case) yg lama
      };
      // ======================================

      // ‼️ PENTING: Cek Postman! Endpoint-mu 'POST /books'?
      await api.post('/books', dataToSend); // 3. Kirim data yang sudah disulap

      alert('Buku baru berhasil ditambahkan!');
      navigate('/'); // Kembali ke halaman daftar buku

    } catch (err: any) {
// ... (dst)
    }
  };

  // == TAMPILAN (JSX) ==
  return (
    <div>
      <h1>Form Tambah Buku Baru</h1>
      
      <form onSubmit={handleSubmit}>
        <Field label="Judul" name="title" value={formData.title} onChange={handleChange} required />
        <Field label="Penulis" name="writer" value={formData.writer} onChange={handleChange} required />
        <Field label="Penerbit" name="publisher" value={formData.publisher} onChange={handleChange} />
        <Field label="ISBN (Opsional)" name="isbn" value={formData.isbn} onChange={handleChange} />
        
        {/* 6. Ganti input 'date' jadi 'number' */}
        <Field 
          label="Tahun Terbit" 
          name="publication_year" 
          type="number" // Ganti type
          placeholder="Contoh: 2025"
          value={formData.publication_year} 
          onChange={handleChange} 
        />
        
        <Field label="Harga (Rp)" name="price" type="number" value={formData.price} onChange={handleChange} />
        {/* 7. Ganti 'name' jadi 'stock_quantity' */}
        <Field label="Stok" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} min={0} />

        {/* Dropdown Kondisi */}
        <div style={fieldStyle}>
          <label htmlFor="condition">Kondisi</label>
          <select name="condition" id="condition" value={formData.condition} onChange={handleChange}>
            <option value="Baru">Baru</option>
            <option value="Bekas">Bekas</option>
          </select>
        </div>

        {/* Dropdown Genre (dari API) */}
        <div style={fieldStyle}>
          <label htmlFor="genre_id">Genre</label>
          <select name="genre_id" id="genre_id" value={formData.genre_id} onChange={handleChange} disabled={genres.length === 0}>
            <option value={0} disabled>-- Pilih Genre --</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {genres.length === 0 && <small> Loading genre...</small>}
        </div>

        {/* Text Area */}
        <div style={fieldStyle}>
          <label htmlFor="description">Deskripsi (Opsional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%' }}
          />
        </div>

        {/* Error & Submit Button */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Menyimpan...' : 'Simpan Buku'}
        </button>
      </form>
    </div>
  );
};

// Komponen helper (tidak berubah)
const Field: React.FC<any> = ({ label, ...props }) => (
  <div style={fieldStyle}>
    <label htmlFor={props.name}>{label}</label>
    <input id={props.name} {...props} style={{ width: '100%' }} />
  </div>
);

const fieldStyle: React.CSSProperties = {
  marginBottom: '15px',
  width: '100%',
  maxWidth: '500px'
};

export default AddBookPage;