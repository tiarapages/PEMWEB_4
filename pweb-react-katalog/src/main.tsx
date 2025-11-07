import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <-- 1. IMPORT TAMBAHAN

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. TAMBAHKAN TAG PEMBUKA */}
      <App /> {/* <-- 3. <App /> sekarang ada DI DALAMNYA */}
    </BrowserRouter> {/* <-- 4. TAMBAHKAN TAG PENUTUP */}
  </React.StrictMode>,
)