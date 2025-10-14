import React, { useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RecipeForm from './RecipeForm'
import { RecipeContext } from '../context/RecipeContextBase'

export default function RecipeEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, updateRecipe } = useContext(RecipeContext)

  const recipe = recipes.find(r => r.id === id)
  if (!recipe) return <p>Recipe not found.</p>

  function onSubmit(updated) {
    updateRecipe(id, updated)
    navigate(`/recipe/${id}`)
  }

  return <div><h2>Edit Recipe</h2><RecipeForm initial={recipe} onSubmitCallback={onSubmit} submitLabel="Update" /></div>
}
