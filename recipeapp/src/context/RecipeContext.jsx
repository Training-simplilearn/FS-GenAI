import React, { useState, useEffect, useRef } from 'react'
import initialRecipes from '../data/recipes'
import { RecipeContext } from './RecipeContextBase'

export default function RecipeProvider({ children }) {
  // runtime mode (local or server); persisted to localStorage
  const initialMode = (() => {
    try { return localStorage.getItem('mode') || 'local' } catch { return 'local' }
  })()
  const [mode, setModeRaw] = useState(initialMode)

  const USE_SERVER = mode === 'server'

  const [recipes, setRecipes] = useState(() => {
    try {
      const stored = localStorage.getItem('recipes')
      return stored ? JSON.parse(stored) : initialRecipes
    } catch {
      return initialRecipes
    }
  })

  // persist mode
  function setMode(newMode) {
  try { localStorage.setItem('mode', newMode) } catch { /* ignore write errors */ }
    setModeRaw(newMode)
    // if switching to server, attempt a resync
    if (newMode === 'server') {
      fetch('http://localhost:4000/recipes')
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setRecipes(data) })
        .catch(() => { /* server unreachable; keep local */ })
    }
  }

  // queue for failed server actions (persisted)
  const [queue, setQueue] = useState(() => {
    try { const q = localStorage.getItem('actionQueue'); return q ? JSON.parse(q) : [] } catch { return [] }
  })

  const queueRef = useRef(queue)
  queueRef.current = queue

  useEffect(() => {
    try { localStorage.setItem('actionQueue', JSON.stringify(queue)) } catch { /* ignore write errors */ }
  }, [queue])

  useEffect(() => {
    try { localStorage.setItem('recipes', JSON.stringify(recipes)) } catch { /* ignore write errors */ }
  }, [recipes])

  // background processor to flush queue when in server mode
  useEffect(() => {
    let canceled = false
    async function flush() {
      if (!USE_SERVER) return
      // process a copy to avoid mutation issues
      const actions = [...queueRef.current]
      for (const a of actions) {
        try {
          if (a.type === 'add') {
            const res = await fetch('http://localhost:4000/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a.payload) })
            const created = await res.json()
            setRecipes(prev => [created, ...prev.filter(x => x.id !== a.tempId)])
          } else if (a.type === 'update') {
            await fetch(`http://localhost:4000/recipes/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a.payload) })
          } else if (a.type === 'delete') {
            await fetch(`http://localhost:4000/recipes/${a.id}`, { method: 'DELETE' })
          }
          // remove this action from queue
          setQueue(q => q.filter(x => x.uid !== a.uid))
        } catch {
          // network failure - stop processing further for now
          break
        }
        if (canceled) break
      }
    }

    const iv = setInterval(() => { flush().catch(() => {}) }, 5000)
    // try immediately once
    flush().catch(() => {})
    return () => { canceled = true; clearInterval(iv) }
  }, [USE_SERVER])

  async function addRecipe(recipe) {
    // optimistic: create a temp id and add to UI immediately
    const tempId = `temp-${Date.now()}`
    const temp = { ...recipe, id: tempId }
    setRecipes(prev => [temp, ...prev])

    if (USE_SERVER) {
      try {
        const res = await fetch('http://localhost:4000/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recipe) })
        const created = await res.json()
        // replace temp with created
        setRecipes(prev => prev.map(r => (r.id === tempId ? created : r)))
        return created
      } catch {
        // enqueue for retry
        const action = { uid: String(Date.now()) + Math.random(), type: 'add', payload: recipe, tempId }
        setQueue(q => [action, ...q])
        return temp
      }
    }
    // local only mode
    const newRecipe = { ...recipe, id: String(Date.now()) }
    setRecipes(prev => prev.map(r => (r.id === tempId ? newRecipe : r)))
    return newRecipe
  }

  async function updateRecipe(id, updates) {
    // optimistic update
    setRecipes(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)))
    if (USE_SERVER) {
      try {
        await fetch(`http://localhost:4000/recipes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) })
        return
      } catch {
        const action = { uid: String(Date.now()) + Math.random(), type: 'update', id, payload: updates }
        setQueue(q => [action, ...q])
        return
      }
    }
  }

  async function deleteRecipe(id) {
  // optimistic remove
  setRecipes(prev => prev.filter(r => r.id !== id))
    if (USE_SERVER) {
      try {
        await fetch(`http://localhost:4000/recipes/${id}`, { method: 'DELETE' })
        return
      } catch {
        const action = { uid: String(Date.now()) + Math.random(), type: 'delete', id }
        setQueue(q => [action, ...q])
        // keep UI removed for now; will re-sync later
        return
      }
    }
  }

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, deleteRecipe, mode, setMode, queueLength: queue.length }}>
      {children}
    </RecipeContext.Provider>
  )
}
