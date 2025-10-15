import React, { useState } from 'react'
import FormCard from '../components/FormCard'
import Notification from '../components/Notification'

// Use Vite dev server proxy during development. Calls to /api will be proxied to backend.
const BASE = '/api'

export default function AltaCorreos() {
  const [dni, setDni] = useState('')
  const [correo, setCorreo] = useState('')
  const [respuesta, setRespuesta] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dni || !correo) {
      setRespuesta('Completa todos los campos')
      return
    }
    // simple email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(correo)) {
      setRespuesta('El correo no tiene formato válido')
      return
    }
    const url = `${BASE}/correos/guardar/${encodeURIComponent(dni)}/${encodeURIComponent(correo)}`
    try {
  setRespuesta('Guardando...')
  const res = await fetch(url)
  const text = await res.text()
  setRespuesta(text)
  setDni('')
  setCorreo('')
    } catch (err) {
  setRespuesta('Error de red: ' + err.message)
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <FormCard 
        title="Agregar Correo Electrónico" 
        subtitle="Asocia un nuevo correo a un cliente existente"
      >
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-5">
            <label className="form-label">
              <i className="bi bi-card-text me-1"></i>
              DNI del Cliente
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
            <div className="small muted" style={{ marginTop: '6px' }}>
              <i className="bi bi-info-circle me-1"></i>
              El cliente debe estar registrado previamente
            </div>
          </div>
          <div className="col-md-7">
            <label className="form-label">
              <i className="bi bi-envelope me-1"></i>
              Correo Electrónico
            </label>
            <div className="input-group">
              <span className="input-group-text">@</span>
              <input 
                className="form-control" 
                type="email"
                placeholder="ejemplo@correo.com" 
                value={correo} 
                onChange={e => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-12" style={{ marginTop: '24px' }}>
            <div className="d-flex gap-2 justify-content-end">
              <button 
                className="btn btn-ghost" 
                type="button"
                onClick={() => {
                  setDni('')
                  setCorreo('')
                  setRespuesta('')
                }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Limpiar
              </button>
              <button className="btn btn-success px-4" type="submit">
                <i className="bi bi-envelope-check me-1"></i>
                Guardar Correo
              </button>
            </div>
          </div>
        </form>

        {respuesta && (
          <Notification type={
            respuesta.toLowerCase().includes('error') || 
            respuesta.toLowerCase().includes('completa') || 
            respuesta.toLowerCase().includes('válido') ||
            respuesta.toLowerCase().includes('no existe') ||
            respuesta.toLowerCase().includes('no se ha') ? 'error' : 
            respuesta.toLowerCase().includes('guardando') ? 'info' : 
            'success'
          }>
            {respuesta}
          </Notification>
        )}
      </FormCard>
    </div>
  )
}
