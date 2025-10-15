import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AltaClientes from './pages/AltaClientes'
import AltaCorreos from './pages/AltaCorreos'
import Listados from './pages/Listados'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <div className="app">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alta-clientes" element={<AltaClientes />} />
            <Route path="/alta-correos" element={<AltaCorreos />} />
            <Route path="/listados" element={<Listados />} />
          </Routes>
        </main>

        <footer className="footer">
          <div>
            Hecho con <span style={{ color: 'var(--danger)' }}>❤️</span> usando React + Spring Boot
          </div>
        </footer>
      </div>
    </>
  )
}

function Home() {
  return (
    <div className="hero">
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📧</div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
          Gestión de Clientes y Correos
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', marginBottom: '32px' }}>
          Sistema completo para administrar clientes y sus correos electrónicos de forma simple e intuitiva
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <a href="/alta-clientes" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <i className="bi bi-person-plus me-1"></i>
            Nuevo Cliente
          </a>
          <a href="/alta-correos" className="btn btn-success" style={{ textDecoration: 'none' }}>
            <i className="bi bi-envelope-plus me-1"></i>
            Nuevo Correo
          </a>
          <a href="/listados" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
            <i className="bi bi-list-ul me-1"></i>
            Ver Listados
          </a>
        </div>
        <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '8px' }}>
            <i className="bi bi-server me-1"></i>
            Backend conectado
          </div>
          <code style={{ fontSize: '0.875rem', color: 'var(--brand)', fontWeight: '600' }}>
            http://localhost:8083
          </code>
        </div>
      </div>
    </div>
  )
}
