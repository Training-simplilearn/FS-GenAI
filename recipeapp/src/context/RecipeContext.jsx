import React, { useState, useEffect, useRef } from 'react'
import { computeRecipeCalories, computeRecipeCaloriesDetailed } from '../utils/nutrition'
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
      const now = Date.now()
      const actions = [...queueRef.current]
      for (const a of actions) {
        if (a.nextAttempt && a.nextAttempt > now) continue
        try {
          if (a.type === 'add') {
            const res = await fetch('http://localhost:4000/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a.payload) })
            const created = await res.json()
            setRecipes(prev => [created, ...prev.filter(x => x.id !== a.tempId)])
            pushToast(`${a.payload.name || 'Recipe'} synchronized with server`)
          } else if (a.type === 'update') {
            const res = await fetch(`http://localhost:4000/recipes/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a.payload) })
            if (res.status === 409) {
              // conflict - re-fetch and replace local item
              const serverCopy = await (await fetch(`http://localhost:4000/recipes/${a.id}`)).json()
              setRecipes(prev => prev.map(r => (r.id === a.id ? serverCopy : r)))
              pushToast(`Conflict syncing ${a.id}, updated with server copy`)
            } else {
              pushToast(`Update for ${a.id} flushed`)
            }
          } else if (a.type === 'delete') {
            await fetch(`http://localhost:4000/recipes/${a.id}`, { method: 'DELETE' })
            pushToast(`Deletion ${a.id} flushed`)
          }
          // remove this action from queue
          setQueue(q => q.filter(x => x.uid !== a.uid))
        } catch {
          // network failure - schedule retry with backoff
          const retryCount = (a.retryCount || 0) + 1
          const maxRetries = 5
          if (retryCount > maxRetries) {
            // drop action
            setQueue(q => q.filter(x => x.uid !== a.uid))
            pushToast(`Action ${a.type} failed permanently`)
          } else {
            const backoff = Math.min(30000, 1000 * Math.pow(2, retryCount))
            const nextAttempt = Date.now() + backoff
            setQueue(q => q.map(x => x.uid === a.uid ? { ...x, retryCount, nextAttempt } : x))
          }
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

  // server health check
  const [serverUp, setServerUp] = useState(false)
  useEffect(() => {
    let id = null
    async function check() {
      try {
        const r = await fetch('http://localhost:4000/recipes')
        setServerUp(r.ok)
      } catch {
        setServerUp(false)
      }
    }
    check()
    id = setInterval(check, 5000)
    return () => clearInterval(id)
  }, [])

  // toasts
  const [toasts, setToasts] = useState([])
  function pushToast(message) {
    const t = { id: String(Date.now()) + Math.random(), message }
    setToasts(s => [t, ...s])
    // auto-remove after 8s
    setTimeout(() => setToasts(s => s.filter(x => x.id !== t.id)), 8000)
  }
  function removeToast(id) { setToasts(s => s.filter(x => x.id !== id)) }

  // Energy unit fixed site-wide as "cal"; no preference stored

  // Optional USDA FDC fetcher if API key provided via Vite env
  async function fetchFdc(name) {
    try {
      const key = import.meta.env.VITE_FDC_API_KEY
      if (!key) return null
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${key}&query=${encodeURIComponent(name)}&pageSize=1`
      const res = await fetch(url)
      if (!res.ok) return null
      const data = await res.json()
      const food = data?.foods?.[0]
      if (!food || !food.foodNutrients) return null
      const energy = food.foodNutrients.find(n => n.nutrientNumber === '208' || n.nutrientId === 1008 || /Energy/i.test(n.nutrientName))
      if (!energy || !energy.value) return null
      // value may be per 100g by default in FDC SR datasets; we will assume per 100g here
      return { kcalPer100g: Number(energy.value) }
    } catch {
      return null
    }
  }

  async function computeCaloriesFor(recipe) {
    try {
      const result = await computeRecipeCalories(recipe.ingredients || [], { fetchFdc })
      return result
    } catch {
      return { value: 0, unit: 'cal' }
    }
  }

  async function computeCaloriesBreakdown(recipe) {
    try {
      const rows = await computeRecipeCaloriesDetailed(recipe.ingredients || [], { fetchFdc })
      return rows
    } catch {
      return []
    }
  }

  // recently viewed recipes (persisted)
  const [recents, setRecents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recents') || '[]') } catch { return [] }
  })
  useEffect(() => { try { localStorage.setItem('recents', JSON.stringify(recents)) } catch { /* ignore persist errors intentionally */ } }, [recents])
  function markViewed(id) {
    setRecents(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 8)
      return next
    })
  }

  function manualFlush() {
    // trigger immediate flush by calling the effect's flush function indirectly: flip mode briefly
    // easier: directly call a small flush routine here (duplicate minimal logic)
    ;(async function() {
      if (!USE_SERVER) { pushToast('Switch to Server to flush queue') ; return }
      const actions = [...queueRef.current]
      for (const a of actions) {
        try {
          if (a.type === 'add') {
            const res = await fetch('http://localhost:4000/recipes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a.payload) })
            const created = await res.json()
            setRecipes(prev => [created, ...prev.filter(x => x.id !== a.tempId)])
            setQueue(q => q.filter(x => x.uid !== a.uid))
            pushToast(`Flushed action ${a.type}`)
          } else if (a.type === 'update') {
            await fetch(`http://localhost:4000/recipes/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(a.payload) })
            setQueue(q => q.filter(x => x.uid !== a.uid))
            pushToast(`Flushed update ${a.id}`)
          } else if (a.type === 'delete') {
            await fetch(`http://localhost:4000/recipes/${a.id}`, { method: 'DELETE' })
            setQueue(q => q.filter(x => x.uid !== a.uid))
            pushToast(`Flushed delete ${a.id}`)
          }
        } catch {
          pushToast('Manual flush failed (server unreachable)')
          break
        }
      }
    })()
  }

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
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, deleteRecipe, mode, setMode, queueLength: queue.length, serverUp, toasts, removeToast, manualFlush, pushToast, recents, markViewed, computeCaloriesFor, computeCaloriesBreakdown }}>
      {children}
    </RecipeContext.Provider>
  )
}
