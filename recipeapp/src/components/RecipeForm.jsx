import React, { useState } from 'react'

export default function RecipeForm({ initial = null, onSubmitCallback, submitLabel = 'Save' }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name || '',
    description: initial?.description || '',
    ingredients: initial?.ingredients ? initial.ingredients.join(', ') : '',
    steps: initial?.steps ? initial.steps.join('\n') : '',
    time: initial?.time || '',
    servings: initial?.servings || ''
  }))

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const recipe = {
      name: form.name || 'Untitled',
      description: form.description,
      ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
      steps: form.steps.split('\n').map(s => s.trim()).filter(Boolean),
      time: form.time,
      servings: form.servings || 1,
      image: initial?.image || null
    }
    if (onSubmitCallback) onSubmitCallback(recipe)
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} required />
      </div>
      <div>
        <label>Description</label>
        <input name="description" value={form.description} onChange={onChange} />
      </div>
      <div>
        <label>Ingredients (comma separated)</label>
        <input name="ingredients" value={form.ingredients} onChange={onChange} placeholder="eg. flour, sugar, eggs" />
      </div>
      <div>
        <label>Steps (one per line)</label>
        <textarea name="steps" value={form.steps} onChange={onChange} rows={6} />
      </div>
      <div>
        <label>Time</label>
        <input name="time" value={form.time} onChange={onChange} placeholder="e.g. 30 mins" />
      </div>
      <div>
        <label>Servings</label>
        <input name="servings" value={form.servings} onChange={onChange} type="number" min="1" />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <button type="submit" className="btn">{submitLabel}</button>
      </div>
    </form>
  )
}
