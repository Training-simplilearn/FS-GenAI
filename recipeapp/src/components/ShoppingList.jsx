import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatFraction } from '../utils/units'

export default function ShoppingList() {
  const [list, setList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shoppingList') || '[]') } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem('shoppingList', JSON.stringify(list)) } catch { /* ignore persist errors intentionally */ }
  }, [list])

  function clearList() { setList([]) }

  const displayList = useMemo(() => {
    return (list || []).map(item => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object') {
        const qty = item.quantity != null ? formatFraction(Number(item.quantity), 4) : ''
        const unit = item.unit ? ` ${item.unit}` : ''
        return `${qty}${unit} ${item.name}`.trim()
      }
      return String(item)
    })
  }, [list])

  return (
    <div>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <Link to="/" className="btn">← Back</Link>
        <h2>Shopping List</h2>
        <button className="btn" onClick={clearList} style={{ background: '#d44747' }}>Clear</button>
      </div>

      {displayList.length === 0 ? (
        <p>Your shopping list is empty. Add ingredients from a recipe.</p>
      ) : (
        <ul className="shopping-list">
          {displayList.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </div>
  )
}
