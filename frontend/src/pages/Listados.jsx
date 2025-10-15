import React, { useEffect, useState } from 'react'
import FormCard from '../components/FormCard'
import Notification from '../components/Notification'

// Use Vite dev server proxy during development. Calls to /api will be proxied to backend.
const BASE = '/api'

export default function Listados() {
  const [clientes, setClientes] = useState([])
  const [correos, setCorreos] = useState([])
  const [msg, setMsg] = useState('')
  const [expandedDni, setExpandedDni] = useState(null)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = () => {
    setMsg('')
    
    fetch(`${BASE}/clientes/listartodos`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then(text => {
        try {
          const data = text ? JSON.parse(text) : []
          setClientes(data)
        } catch (e) {
          console.error('Error parsing clientes:', text)
          setClientes([])
        }
      })
      .catch(e => {
        console.error('Error fetching clientes:', e)
        setMsg('Error al cargar clientes: ' + e.message)
        setClientes([])
      })
    
    fetch(`${BASE}/correos/listartodos`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then(text => {
        try {
          const data = text ? JSON.parse(text) : []
          setCorreos(data)
        } catch (e) {
          console.error('Error parsing correos:', text)
          setCorreos([])
        }
      })
      .catch(e => {
        console.error('Error fetching correos:', e)
        setMsg('Error al cargar correos: ' + e.message)
        setCorreos([])
      })
  }

  const emailsFor = (dni) => correos.filter(e => e.cliente06?.dni === dni)

  const handleDeleteEmail = async (id) => {
    if (!confirm('¿Eliminar este correo?')) return
    try {
      const res = await fetch(`${BASE}/correos/borrar/${encodeURIComponent(id)}`, { method: 'DELETE' })
      const text = await res.text()
      setMsg(text)
      refresh()
    } catch (e) {
      setMsg('Error al borrar: ' + e.message)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px', color: 'var(--text)' }}>
            <i className="bi bi-list-ul me-2"></i>
            Listados
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9375rem', margin: 0 }}>
            Gestiona todos tus clientes y correos electrónicos
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-ghost" onClick={refresh}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refrescar
          </button>
          <button className="btn btn-primary" onClick={() => window.location.href = '/alta-clientes'}>
            <i className="bi bi-plus-lg me-1"></i>
            Nuevo Cliente
          </button>
        </div>
      </div>

      {msg && <Notification type="info">{msg}</Notification>}

      <div style={{ 
        background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(249,115,22,0.05))', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '24px',
        border: '1px solid var(--border)'
      }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--brand)' }}>
              {clientes.length}
            </div>
            <div style={{ color: 'var(--text-light)', fontSize: '0.9375rem' }}>
              Clientes Registrados
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
              {correos.length}
            </div>
            <div style={{ color: 'var(--text-light)', fontSize: '0.9375rem' }}>
              Correos Totales
            </div>
          </div>
          <div style={{ fontSize: '3rem' }}>📊</div>
        </div>
      </div>

      {clientes.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }}>📭</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text)' }}>
            No hay clientes registrados
          </h3>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            Comienza agregando tu primer cliente al sistema
          </p>
          <div>
            <button className="btn btn-primary" onClick={() => window.location.href = '/alta-clientes'}>
              <i className="bi bi-person-plus me-1"></i>
              Agregar Primer Cliente
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {clientes.map(c => {
            const clientEmails = emailsFor(c.dni)
            const emailCount = clientEmails.length
            const isExpanded = expandedDni === c.dni
            
            return (
              <div key={c.dni} className="col-sm-6 col-lg-4">
                <div className="card h-100" style={{ overflow: 'hidden' }}>
                  <div className="card-body d-flex flex-column" style={{ padding: '20px' }}>
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div className="avatar-circle">
                        {String(c.nombre || '').charAt(0).toUpperCase()}
                        {String(c.apellido || '').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="fw-bold" style={{ fontSize: '1.0625rem', marginBottom: '2px' }}>
                          {c.nombre} {c.apellido}
                        </div>
                        <div className="muted small">
                          <i className="bi bi-card-text me-1"></i>
                          DNI: {c.dni}
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          <span className="badge bg-info">
                            <i className="bi bi-envelope me-1"></i>
                            {emailCount} {emailCount === 1 ? 'correo' : 'correos'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isExpanded && clientEmails.length > 0 && (
                      <div style={{ 
                        marginBottom: '16px', 
                        padding: '12px', 
                        background: 'var(--bg)', 
                        borderRadius: '10px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--muted)', marginBottom: '8px' }}>
                          CORREOS ELECTRÓNICOS
                        </div>
                        <div className="d-flex flex-column gap-2">
                          {clientEmails.map(email => (
                            <div key={email.idCorreo} className="email-pill">
                              <i className="bi bi-envelope" style={{ color: 'var(--brand)' }}></i>
                              <div className="email-text" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {email.correo}
                              </div>
                              <div className="email-actions d-flex gap-1">
                                <button 
                                  className="btn btn-sm btn-ghost" 
                                  onClick={() => { 
                                    navigator.clipboard?.writeText(email.correo); 
                                    setMsg('✓ Correo copiado al portapapeles') 
                                  }}
                                  title="Copiar correo"
                                >
                                  <i className="bi bi-clipboard"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger" 
                                  onClick={() => handleDeleteEmail(email.idCorreo)}
                                  title="Eliminar correo"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isExpanded && clientEmails.length === 0 && (
                      <div style={{ 
                        marginBottom: '16px', 
                        padding: '16px', 
                        background: 'var(--bg)', 
                        borderRadius: '10px',
                        textAlign: 'center',
                        color: 'var(--muted)',
                        fontSize: '0.875rem'
                      }}>
                        <i className="bi bi-inbox" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px', opacity: 0.5 }}></i>
                        No hay correos para este cliente
                      </div>
                    )}

                    <div className="mt-auto d-flex gap-2 flex-wrap">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => setExpandedDni(isExpanded ? null : c.dni)}
                        style={{ flex: 1 }}
                      >
                        <i className={`bi bi-${isExpanded ? 'eye-slash' : 'envelope'} me-1`}></i>
                        {isExpanded ? 'Ocultar' : 'Ver correos'}
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={() => { 
                          navigator.clipboard?.writeText(c.dni); 
                          setMsg('✓ DNI copiado al portapapeles') 
                        }}
                        title="Copiar DNI"
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
