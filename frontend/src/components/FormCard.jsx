import React from 'react'

export default function FormCard({ title, subtitle, children, footer }) {
  return (
    <div className="card p-0 mb-4 shadow-sm form-card">
      <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
        <div>
          <div className="card-title mb-0">{title}</div>
          {subtitle && <div className="card-subtitle muted small">{subtitle}</div>}
        </div>
        {footer ? (
          <div className="card-actions">{footer}</div>
        ) : null}
      </div>
      <div className="card-body px-4 py-3">
        {children}
      </div>
    </div>
  )
}
