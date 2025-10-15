import React, { useState } from 'react'
import FormCard from '../components/FormCard'
import Notification from '../components/Notification'

// Use Vite dev server proxy during development. Calls to /api will be proxied to backend.
const BASE = '/api'

export default function AltaClientes() {
  const [dni, setDni] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [respuesta, setRespuesta] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dni || !nombre || !apellido) {
      setRespuesta('Completa todos los campos')
      return
    }
    const url = `${BASE}/clientes/guardar/${encodeURIComponent(dni)}/${encodeURIComponent(nombre)}/${encodeURIComponent(apellido)}`
    try {
      setRespuesta('Guardando...')
      const res = await fetch(url)
      const text = await res.text()
      setRespuesta(text)
      setDni('')
      setNombre('')
      setApellido('')
    } catch (err) {
      setRespuesta('Error de red: ' + err.message)
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <FormCard 
        title="Registrar Nuevo Cliente" 
        subtitle="Ingresa los datos del cliente para agregarlo al sistema"
      >
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="form-label">
              <i className="bi bi-card-text me-1"></i>
              DNI
            </label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
              <input 
                className="form-control" 
                placeholder="Ej: 12345678" 
                value={dni} 
                onChange={e => setDni(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <i className="bi bi-person me-1"></i>
              Nombre
            </label>
            <input 
              className="form-control" 
              placeholder="Ej: Juan" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              <i className="bi bi-person-badge me-1"></i>
              Apellido
            </label>
            <input 
              className="form-control" 
              placeholder="Ej: Pérez" 
              value={apellido} 
              onChange={e => setApellido(e.target.value)}
              required
            />
          </div>
          <div className="col-12" style={{ marginTop: '24px' }}>
            <div className="d-flex gap-2 justify-content-end">
              <button 
                className="btn btn-ghost" 
                type="button"
                onClick={() => {
                  setDni('')
                  setNombre('')
                  setApellido('')
                  setRespuesta('')
                }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Limpiar
              </button>
              <button className="btn btn-primary px-4" type="submit">
                <i className="bi bi-check-circle me-1"></i>
                Guardar Cliente
              </button>
            </div>
          </div>
        </form>

        {respuesta && (
          <Notification type={respuesta.toLowerCase().includes('error') || respuesta.toLowerCase().includes('completa') ? 'error' : respuesta.toLowerCase().includes('guardando') ? 'info' : 'success'}>
            {respuesta}
          </Notification>
        )}
      </FormCard>
    </div>
  )
}
