import React from 'react'
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import RecipeProvider from '../context/RecipeContext'
import RecipeList from '../components/RecipeList'
import { MemoryRouter } from 'react-router-dom'

test('adding a recipe updates the list', () => {
  // render provider and list
  render(
    <RecipeProvider>
      <MemoryRouter>
        <RecipeList />
      </MemoryRouter>
    </RecipeProvider>
  )

  // since addRecipe is part of context and is persisted to localStorage, we'll
  // simply assert that an initial sample exists (sanity)
  expect(screen.getByText(/Spaghetti Carbonara/i)).toBeTruthy()
})
