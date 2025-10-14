import React from 'react'
import { Link } from 'react-router-dom'

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <div className="recipe-card-body">
        <h3>{recipe.name}</h3>
        <p className="muted">{recipe.description}</p>
        <p className="meta">{recipe.time} • {recipe.servings} servings</p>
        <Link to={`/recipe/${recipe.id}`} className="btn">View</Link>
      </div>
    </div>
  )
}
