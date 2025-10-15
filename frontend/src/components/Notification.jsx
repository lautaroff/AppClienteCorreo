import React from 'react'

export default function Notification({ type = 'info', children }) {
  const config = {
    error: {
      cls: 'alert-danger',
      icon: 'bi-x-circle-fill',
      color: 'var(--danger)'
    },
    success: {
      cls: 'alert-success',
      icon: 'bi-check-circle-fill',
      color: 'var(--success)'
    },
    info: {
      cls: 'alert-info',
      icon: 'bi-info-circle-fill',
      color: 'var(--brand)'
    }
  }

  const { cls, icon, color } = config[type] || config.info

  return (
    <div className={`alert ${cls} mt-3 d-flex align-items-center gap-2`} role="alert" style={{ borderLeft: `4px solid ${color}` }}>
      <i className={`bi ${icon}`} style={{ fontSize: '1.25rem', color }}></i>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  )
}
