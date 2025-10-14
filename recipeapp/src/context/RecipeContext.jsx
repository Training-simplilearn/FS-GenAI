import React, { useState, useEffect } from 'react'
import initialRecipes from '../data/recipes'
import { RecipeContext } from './RecipeContextBase'

export default function RecipeProvider({ children }) {
  const USE_SERVER = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_SERVER === 'true'

  const [recipes, setRecipes] = useState(() => {
    try {
      const stored = localStorage.getItem('recipes')
      return stored ? JSON.parse(stored) : initialRecipes
    } catch {
      return initialRecipes
    }
  })

  // If USE_SERVER, try to fetch initial data from server once
  useEffect(() => {
    let mounted = true
    if (USE_SERVER) {
      fetch('http://localhost:4000/recipes')
        .then(r => r.json())
        .then(data => { if (mounted && Array.isArray(data)) setRecipes(data) })
        .catch(() => { /* ignore server errors, keep local */ })
    }
    return () => { mounted = false }
  }, [USE_SERVER])

  useEffect(() => {
    try {
      localStorage.setItem('recipes', JSON.stringify(recipes))
    } catch {
      // ignore write errors
    }
  }, [recipes])

  async function addRecipe(recipe) {
    if (USE_SERVER) {
      try {
        const res = await fetch('http://localhost:4000/recipes', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recipe)
        })
        const created = await res.json()
        setRecipes(prev => [created, ...prev])
        return created
      } catch {
        // fallback to local
      }
    }
    const newRecipe = { ...recipe, id: String(Date.now()) }
    setRecipes(prev => [newRecipe, ...prev])
    return newRecipe
  }

  async function updateRecipe(id, updates) {
    if (USE_SERVER) {
      try {
        const res = await fetch(`http://localhost:4000/recipes/${id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates)
        })
        const updated = await res.json()
        setRecipes(prev => prev.map(r => (r.id === id ? updated : r)))
        return
      } catch {
        // fallback
      }
    }
    setRecipes(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)))
  }

  async function deleteRecipe(id) {
    if (USE_SERVER) {
      try {
        await fetch(`http://localhost:4000/recipes/${id}`, { method: 'DELETE' })
        setRecipes(prev => prev.filter(r => r.id !== id))
        return
      } catch {
        // fallback
      }
    }
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, deleteRecipe }}>
      {children}
    </RecipeContext.Provider>
  )
}
