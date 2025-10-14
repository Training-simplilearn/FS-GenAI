import React from 'react'

export default function ModeToggle({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
      <label style={{ fontSize: '.9rem' }}>Mode:</label>
      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="local">Local</option>
        <option value="server">Server</option>
      </select>
    </div>
  )
}
