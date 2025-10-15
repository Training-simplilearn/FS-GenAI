import React, { useState, useMemo, useContext } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from './RecipeCard'
import { RecipeContext } from '../context/RecipeContextBase'

export default function RecipeList() {
  const [query, setQuery] = useState('')

  const { recipes } = useContext(RecipeContext)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return recipes
    return recipes.filter(r => {
      const name = (r.name || '').toLowerCase()
      const ingText = (Array.isArray(r.ingredients) ? r.ingredients : [])
        .map(it => (typeof it === 'string' ? it : (it?.name || '')))
        .join(' ')
        .toLowerCase()
      return name.includes(q) || ingText.includes(q)
    })
  }, [query, recipes])

  return (
    <div>
      <div className="search-bar">
        <input
          placeholder="Search recipes by name or ingredient..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Recipes</h2>
        <Link to="/add" className="btn">+ Add Recipe</Link>
      </div>

      <div className="recipe-grid">
        {filtered.map(r => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
        {filtered.length === 0 && <p>No recipes found.</p>}
      </div>
    </div>
  )
}
