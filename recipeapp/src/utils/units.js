// Basic unit parsing and conversions for mass and volume
export const MASS_UNITS = {
  mg: 0.001,
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  ounce: 28.3495,
  ounces: 28.3495,
  oz: 28.3495,
  lb: 453.592,
  lbs: 453.592,
  pound: 453.592,
  pounds: 453.592,
}

export const VOLUME_UNITS = {
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  l: 1000,
  liter: 1000,
  liters: 1000,
  tsp: 4.92892,
  teaspoon: 4.92892,
  teaspoons: 4.92892,
  tbsp: 14.7868,
  tablespoon: 14.7868,
  tablespoons: 14.7868,
  cup: 240,
  cups: 240,
  'fl oz': 29.5735,
}

// approximate densities g/ml for some common ingredients (fallback to 1)
export const DENSITY = {
  water: 1,
  milk: 1.03,
  oil: 0.91,
  'olive oil': 0.91,
  sugar: 0.85,
  'granulated sugar': 0.85,
  flour: 0.53,
  'all-purpose flour': 0.53,
  honey: 1.42,
  butter: 0.911,
}

export function normalizeUnit(u) {
  if (!u) return null
  const s = u.toLowerCase()
  if (MASS_UNITS[s]) return s
  if (VOLUME_UNITS[s]) return s
  // alias
  if (s === 'grams') return 'g'
  if (s === 'kilograms') return 'kg'
  if (s === 'milliliters') return 'ml'
  if (s === 'liters') return 'l'
  if (s === 'teaspoons') return 'tsp'
  if (s === 'tablespoons') return 'tbsp'
  if (s === 'ounces') return 'oz'
  return s
}

function parseNumber(txt) {
  if (typeof txt !== 'string') return Number(txt)
  const t = txt.trim()
  if (t.includes('/')) {
    const [a, b] = t.split('/').map(Number)
    if (!isNaN(a) && !isNaN(b) && b !== 0) return a / b
  }
  const n = Number(t)
  return isNaN(n) ? 1 : n
}

export function parseIngredientToken(token) {
  // formats: "2 cups milk" | "100 g flour" | "egg" | "1 egg"
  const t = token.trim()
  const m = t.match(/^(\d+(?:[./]\d+)?)\s*([a-zA-Z ]+)\s+(.+)$/)
  if (m) {
    const qty = parseNumber(m[1])
    const unit = normalizeUnit(m[2].trim())
    const name = m[3].trim()
    return { name, quantity: isNaN(qty) ? 1 : qty, unit }
  }
  // try "1 egg" (countable without unit)
  const m2 = t.match(/^(\d+(?:[./]\d+)?)\s+(.+)$/)
  if (m2) {
    const qty = parseNumber(m2[1])
    const name = m2[2].trim()
    return { name, quantity: isNaN(qty) ? 1 : qty, unit: 'count' }
  }
  return { name: t, quantity: 1, unit: null }
}

export function toGrams(ing) {
  // if mass unit, convert directly
  if (ing.unit && MASS_UNITS[ing.unit] != null) {
    return ing.quantity * MASS_UNITS[ing.unit]
  }
  // if volume unit, convert using density
  if (ing.unit && VOLUME_UNITS[ing.unit] != null) {
    const ml = ing.quantity * VOLUME_UNITS[ing.unit]
    const dens = guessDensity(ing.name)
    return ml * dens
  }
  // countable items: estimate typical weight
  const n = ing.name.toLowerCase()
  if (ing.unit === 'count') {
    if (n.includes('egg')) return ing.quantity * 50
    if (n.includes('banana')) return ing.quantity * 120
    if (n.includes('tomato')) return ing.quantity * 75
  }
  // unknown unit: best-effort heuristic
  return ing.quantity * 100
}

export function toMilliliters(ing) {
  // if volume unit, convert directly to ml
  if (ing.unit && VOLUME_UNITS[ing.unit] != null) {
    return ing.quantity * VOLUME_UNITS[ing.unit]
  }
  // otherwise estimate via grams and density
  const grams = toGrams(ing)
  const dens = guessDensity(ing.name) // g/ml
  if (!dens || dens === 0) return grams // fallback assume 1 g/ml
  return grams / dens
}

export function guessDensity(name) {
  const n = name.toLowerCase()
  if (n.includes('milk')) return DENSITY['milk']
  if (n.includes('oil')) return DENSITY['oil']
  if (n.includes('olive oil')) return DENSITY['olive oil']
  if (n.includes('sugar')) return DENSITY['sugar']
  if (n.includes('flour')) return DENSITY['flour']
  if (n.includes('honey')) return DENSITY['honey']
  if (n.includes('butter')) return DENSITY['butter']
  return DENSITY['water']
}

export function parseIngredientsArray(arr) {
  // arr can be [string] or [object]
  return arr.map(item => {
    if (typeof item === 'string') return parseIngredientToken(item)
    if (item && typeof item === 'object') return item
    return { name: String(item), quantity: 1, unit: null }
  })
}

// Format a number as a mixed fraction rounded to the nearest 1/minDen (default quarters)
export function formatFraction(value, minDen = 4) {
  if (value == null || Number.isNaN(value)) return ''
  const step = 1 / minDen
  const rounded = Math.round(value / step) * step
  const sign = rounded < 0 ? -1 : 1
  const abs = Math.abs(rounded)
  const whole = Math.floor(abs)
  let frac = abs - whole
  if (Math.abs(frac) < 1e-8) frac = 0
  if (frac === 0) return String(sign * whole)
  // convert fractional part to integer over minDen and reduce
  let num = Math.round(frac * minDen)
  let den = minDen
  const g = (a, b) => b === 0 ? a : g(b, a % b)
  const d = g(num, den)
  num /= d
  den /= d
  const fracStr = `${num}/${den}`
  if (whole === 0) return sign < 0 ? `-${fracStr}` : fracStr
  return `${sign < 0 ? '-' : ''}${whole} ${fracStr}`
}
