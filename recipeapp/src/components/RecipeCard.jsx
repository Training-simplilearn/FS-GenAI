import React from 'react'
import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      {recipe.image ? <div className="card-media" style={{ backgroundImage: `url(${recipe.image})` }} /> : <div className="card-media" style={{ background: '#f3f4f6' }} />}
      <div className="recipe-card-body">
        <h3>{recipe.name}</h3>
        <p className="muted">{recipe.description}</p>
  <p className="meta">{recipe.time} • {recipe.servings} servings • <span className="palette-accent">{recipe.calories ?? '-'} Calories</span></p>
        <Link to={`/recipe/${recipe.id}`} className="btn">View</Link>
      </div>
    </div>
  )
}
