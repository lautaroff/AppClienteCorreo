import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <div className="logo d-flex align-items-center gap-2">
            <div className="brand-icon">📧</div>
            <div>
              <div className="brand fw-bold" style={{ fontSize: '1.25rem' }}>ClienteCorreo</div>
              <div className="muted small">Sistema de Gestión</div>
            </div>
          </div>
        </NavLink>

        <nav className="d-flex gap-2 align-items-center">
          <NavLink to="/" className={({isActive}) => 'nav-link-modern' + (isActive ? ' active' : '')}>
            <i className="bi bi-house-door me-1"></i>
            Inicio
          </NavLink>
          <NavLink to="/alta-clientes" className={({isActive}) => 'nav-link-modern' + (isActive ? ' active' : '')}>
            <i className="bi bi-person-plus me-1"></i>
            Clientes
          </NavLink>
          <NavLink to="/alta-correos" className={({isActive}) => 'nav-link-modern' + (isActive ? ' active' : '')}>
            <i className="bi bi-envelope-plus me-1"></i>
            Correos
          </NavLink>
          <NavLink to="/listados" className={({isActive}) => 'nav-link-modern' + (isActive ? ' active' : '')}>
            <i className="bi bi-list-ul me-1"></i>
            Listados
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
