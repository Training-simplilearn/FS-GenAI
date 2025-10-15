import React, { useContext } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import RecipeProvider from '../context/RecipeContext'
import RecipeList from '../components/RecipeList'
import RecipeForm from '../components/RecipeForm'
import { MemoryRouter } from 'react-router-dom'
import { RecipeContext } from '../context/RecipeContextBase'

import { useEffect } from 'react'

function TestAddAndFlush() {
  const { addRecipe, queueLength, manualFlush, toasts, setMode } = useContext(RecipeContext)
  useEffect(() => { setMode('server') }, [setMode])
  return (
    <div>
      <RecipeForm onSubmitCallback={r => addRecipe(r)} submitLabel="Add" />
      <div data-testid="queue">{queueLength}</div>
      <button data-testid="flush" onClick={manualFlush}>Flush</button>
      <div data-testid="toasts">{toasts.map(t => <div key={t.id}>{t.message}</div>)}</div>
    </div>
  )
}

test('queues actions when offline and flushes when online', async () => {
  // intercept fetch: fail the first POST, succeed afterwards
  const originalFetch = globalThis.fetch
  let shouldFail = true
  globalThis.fetch = vi.fn(async (url, opts) => {
    // Simulate network failure for the first POST to /recipes
    if (shouldFail && opts && opts.method === 'POST' && url.endsWith('/recipes')) {
      shouldFail = false
      return Promise.reject(new Error('network'))
    }
    // For other calls, return a successful fake response
    const body = opts && opts.body ? JSON.parse(opts.body) : null
    return {
      ok: true,
      status: 200,
      json: async () => ({ id: 'srv-' + Date.now(), ...(body || {}) })
    }
  })

  const { container } = render(
    <RecipeProvider>
      <MemoryRouter>
        <TestAddAndFlush />
        <RecipeList />
      </MemoryRouter>
    </RecipeProvider>
  )

  // ensure existing sample is present
  expect(screen.getByText(/Spaghetti Carbonara/i)).toBeTruthy()

  // fill and submit the add form
  const nameInput = container.querySelector('input[name="name"]')
  const ingredientsInput = container.querySelector('input[name="ingredients"]')
  const stepsInput = container.querySelector('textarea[name="steps"]')
  fireEvent.change(nameInput, { target: { value: 'Test Offline Recipe' } })
  fireEvent.change(ingredientsInput, { target: { value: 'a, b, c' } })
  fireEvent.change(stepsInput, { target: { value: 'step1' } })
  // click the Add button inside the form (avoid ambiguous matches)
  const form = container.querySelector('form.recipe-form')
  const submitBtn = form.querySelector('button[type="submit"]')
  fireEvent.click(submitBtn)

  // after failed network, queue should increment to 1 and optimistic item should appear
  await waitFor(() => expect(screen.getByTestId('queue').textContent).toBe('1'))
  expect(screen.getByText(/Test Offline Recipe/i)).toBeTruthy()

  // click flush which will attempt to resend (fetch now succeeds)
  fireEvent.click(screen.getByTestId('flush'))

  // wait for queue to be emptied and for a toast message indicating flush
  await waitFor(() => expect(screen.getByTestId('queue').textContent).toBe('0'))
  await waitFor(() => expect(screen.getByTestId('toasts').textContent.length).toBeGreaterThan(0))

  // restore fetch
  globalThis.fetch = originalFetch
})
