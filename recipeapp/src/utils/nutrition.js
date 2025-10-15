// Nutrition calculator returning Calories label site-wide (numeric value is kcal)
// Optionally integrates with USDA FDC if a fetcher is supplied.
import { parseIngredientsArray, toGrams, toMilliliters } from './units'

// basic fallback kcal per 100g approximations
const KCAL_PER_100G = {
  sugar: 387,
  flour: 364,
  'all-purpose flour': 364,
  butter: 717,
  milk: 42, // per 100ml approximated as g
  oil: 884,
  'olive oil': 884,
  egg: 155,
  eggs: 155,
  chicken: 239,
  beef: 250,
  tomato: 18,
  banana: 89,
}

function findApproxKcalPer100g(name) {
  const n = name.toLowerCase()
  const keys = Object.keys(KCAL_PER_100G)
  for (const k of keys) {
    if (n.includes(k)) return KCAL_PER_100G[k]
  }
  return 200 // fallback average
}

export async function computeRecipeCalories(ingredients, opts = {}) {
  const { fetchFdc } = opts
  const parsed = parseIngredientsArray(ingredients)
  let totalKcal = 0
  for (const ing of parsed) {
    let kcalPer100g = null
    if (fetchFdc) {
      try {
        const fdc = await fetchFdc(ing.name)
        if (fdc && fdc.kcalPer100g) kcalPer100g = fdc.kcalPer100g
      } catch {
        // ignore FDC failure, fallback to approximation
      }
    }
    if (!kcalPer100g) kcalPer100g = findApproxKcalPer100g(ing.name)
    const grams = toGrams(ing)
    totalKcal += (kcalPer100g * grams) / 100
  }
  // Always display label "Calories" (numeric value equals kcal)
  const value = totalKcal
  return { value, unit: 'Calories' }
}

export async function computeRecipeCaloriesDetailed(ingredients, opts = {}) {
  const { fetchFdc } = opts
  const parsed = parseIngredientsArray(ingredients)
  const rows = []
  for (const ing of parsed) {
    let kcalPer100g = null
    if (fetchFdc) {
      try {
        const fdc = await fetchFdc(ing.name)
        if (fdc && fdc.kcalPer100g) kcalPer100g = fdc.kcalPer100g
      } catch {
        /* ignore */
      }
    }
    if (!kcalPer100g) kcalPer100g = findApproxKcalPer100g(ing.name)
    const grams = toGrams(ing)
    const ml = toMilliliters(ing)
    const calories = (kcalPer100g * grams) / 100
    rows.push({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      grams,
      ml,
      kcalPer100g,
      calories,
    })
  }
  return rows
}
