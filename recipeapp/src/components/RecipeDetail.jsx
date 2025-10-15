import React, { useContext, useEffect, useMemo, useState } from 'react'
import { formatFraction, parseIngredientsArray } from '../utils/units'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { RecipeContext } from '../context/RecipeContextBase'

export default function RecipeDetail() {
  const { id } = useParams()
  const { recipes, deleteRecipe, pushToast, markViewed, computeCaloriesFor, computeCaloriesBreakdown } = useContext(RecipeContext)
  const navigate = useNavigate()
  const recipe = recipes.find(r => r.id === id)

  // mark as viewed for recents (effect to avoid render loops)
  useEffect(() => {
    if (recipe) markViewed(recipe.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const [energy, setEnergy] = useState(null)
  const [breakdown, setBreakdown] = useState([])
  useEffect(() => {
    let mounted = true
    if (recipe) {
      computeCaloriesFor(recipe).then(res => { if (mounted) setEnergy(res) })
      computeCaloriesBreakdown(recipe).then(rows => { if (mounted) setBreakdown(rows) })
    }
    return () => { mounted = false }
  }, [recipe, computeCaloriesFor, computeCaloriesBreakdown])

  const tableRows = useMemo(() => {
    const ML_PER_CUP = 240
    const ML_PER_TBSP = 14.7868
    const ML_PER_TSP = 4.92892
    const ML_PER_FLOZ = 29.5735
    const G_PER_OZ = 28.3495
    return (breakdown || []).map((r, i) => {
      const cups = r.ml != null ? r.ml / ML_PER_CUP : null
      const tbsp = r.ml != null ? r.ml / ML_PER_TBSP : null
      const tsp = r.ml != null ? r.ml / ML_PER_TSP : null
      const floz = r.ml != null ? r.ml / ML_PER_FLOZ : null
      const oz = r.grams != null ? r.grams / G_PER_OZ : null
      return {
        key: i,
        name: r.name,
        quantity: r.quantity,
        unit: r.unit,
        cups,
        tbsp,
        tsp,
        floz,
        oz,
        calories: r.calories,
      }
    })
  }, [breakdown])

  if (!recipe) return (
    <div>
      <p>Recipe not found.</p>
      <Link to="/">Back to list</Link>
    </div>
  )

  return (
    <div className="recipe-detail">
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <Link to="/" className="btn">← Back</Link>
        <Link to={`/edit/${recipe.id}`} className="btn">Edit</Link>
        <button className="btn" onClick={() => { if (confirm('Delete this recipe?')) { deleteRecipe(recipe.id); navigate('/') } }} style={{ background: '#d44747' }}>Delete</button>
      </div>
      <h2>{recipe.name}</h2>
      <p className="muted">{recipe.description}</p>
  <p className="meta">{recipe.time} • {recipe.servings} servings{energy ? ` • ${energy.value.toFixed(0)} Calories` : ''}</p>
      {/* Energy unit is now selected globally in header */}

      <h3>Ingredients</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>Ingredient</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>Qty</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>Unit</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>Cups</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>Tbsp</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>Tsp</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>fl oz</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>oz</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: '6px 8px' }}>Calories</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(row => (
              <tr key={row.key}>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6' }}>{row.name}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.quantity != null ? formatFraction(Number(row.quantity), 4) : ''}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6' }}>{row.unit || ''}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.cups != null ? formatFraction(row.cups, 4) : ''}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.tbsp != null ? formatFraction(row.tbsp, 4) : ''}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.tsp != null ? formatFraction(row.tsp, 4) : ''}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.floz != null ? formatFraction(row.floz, 4) : ''}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.oz != null ? formatFraction(row.oz, 4) : ''}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{row.calories != null ? Math.round(row.calories) : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '.5rem' }}>
        <button className="btn" onClick={() => {
          try {
            const prev = JSON.parse(localStorage.getItem('shoppingList') || '[]')
            const prevNorm = (Array.isArray(prev) ? prev : []).map(it => (typeof it === 'string' ? { name: it, quantity: 1, unit: '' } : it))
            const addNorm = parseIngredientsArray(recipe.ingredients || [])
            const merged = [...prevNorm, ...addNorm].filter(it => it && it.name)
            localStorage.setItem('shoppingList', JSON.stringify(merged))
            pushToast('Added ingredients to shopping list')
          } catch {
            pushToast('Failed to update shopping list')
          }
        }}>Add to shopping list</button>
      </div>

      <h3>Steps</h3>
      <ol>
        {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
    </div>
  )
}
