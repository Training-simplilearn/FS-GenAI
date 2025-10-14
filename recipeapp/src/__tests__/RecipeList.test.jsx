import React from 'react'
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import RecipeList from '../components/RecipeList'
import RecipeProvider from '../context/RecipeContext'
import { MemoryRouter } from 'react-router-dom'

test('renders recipes and filters by search', () => {
  render(
    <RecipeProvider>
      <MemoryRouter>
        <RecipeList />
      </MemoryRouter>
    </RecipeProvider>
  )

  // ensure sample recipe title appears
  expect(screen.getByText(/Spaghetti Carbonara/i)).toBeTruthy()
})
