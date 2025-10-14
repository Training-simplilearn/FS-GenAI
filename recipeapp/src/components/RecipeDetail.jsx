import React, { useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { RecipeContext } from '../context/RecipeContextBase'

export default function RecipeDetail() {
  const { id } = useParams()
  const { recipes, deleteRecipe } = useContext(RecipeContext)
  const navigate = useNavigate()
  const recipe = recipes.find(r => r.id === id)

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
      <p className="meta">{recipe.time} • {recipe.servings} servings</p>

      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>

      <h3>Steps</h3>
      <ol>
        {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
    </div>
  )
}
