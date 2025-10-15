import React from 'react'

export function Toast({ message, onClose }) {
  return (
    <div className="toast">
      <div>{message}</div>
      <button onClick={onClose} className="toast-close">✕</button>
    </div>
  )
}

export default function ToastContainer({ toasts, remove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} onClose={() => remove(t.id)} />
      ))}
    </div>
  )
}
