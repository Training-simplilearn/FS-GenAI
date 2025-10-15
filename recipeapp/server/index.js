/* eslint-env node */
import express from 'express'
import process from 'node:process'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(bodyParser.json())

const DB_PATH = path.join(__dirname, 'db.json')

function readDB() {
  try {
    const raw = readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { recipes: [] }
  }
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

app.get('/recipes', async (req, res) => {
  const db = readDB()
  if (Array.isArray(db.recipes) && db.recipes.length > 0) {
    return res.json(db.recipes)
  }
  // Fallback: return local app seeds from src/data/recipes.js if db is empty
  try {
    const projectRoot = path.resolve(__dirname, '..')
    const localPath = path.resolve(projectRoot, 'src', 'data', 'recipes.js')
    const modUrl = pathToFileURL(localPath).href
    const mod = await import(modUrl)
    const seeds = (mod && (mod.default || mod.recipes)) || []
    return res.json(Array.isArray(seeds) ? seeds : [])
  } catch {
    return res.json([])
  }
})

app.get('/recipes/:id', (req, res) => {
  const db = readDB()
  const r = db.recipes.find(x => x.id === req.params.id)
  if (r) return res.json(r)
  // Fallback: try local seeds
  ;(async () => {
    try {
      const projectRoot = path.resolve(__dirname, '..')
      const localPath = path.resolve(projectRoot, 'src', 'data', 'recipes.js')
      const modUrl = pathToFileURL(localPath).href
      const mod = await import(modUrl)
      const seeds = (mod && (mod.default || mod.recipes)) || []
      const match = Array.isArray(seeds) ? seeds.find(x => x.id === req.params.id) : null
      if (!match) return res.status(404).json({ error: 'Not found' })
      return res.json(match)
    } catch {
      return res.status(404).json({ error: 'Not found' })
    }
  })()
})

app.post('/recipes', (req, res) => {
  const db = readDB()
  const recipe = { ...req.body, id: String(Date.now()) }
  db.recipes.unshift(recipe)
  writeDB(db)
  res.status(201).json(recipe)
})

app.put('/recipes/:id', (req, res) => {
  const db = readDB()
  const idx = db.recipes.findIndex(x => x.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  db.recipes[idx] = { ...db.recipes[idx], ...req.body }
  writeDB(db)
  res.json(db.recipes[idx])
})

app.delete('/recipes/:id', (req, res) => {
  const db = readDB()
  const idx = db.recipes.findIndex(x => x.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  db.recipes.splice(idx, 1)
  writeDB(db)
  res.json({ success: true })
})

// Admin: Load local app recipes from src/data/recipes.js into server db.json
app.post('/admin/load-local-recipes', async (req, res) => {
  try {
    const projectRoot = path.resolve(__dirname, '..')
    const localPath = path.resolve(projectRoot, 'src', 'data', 'recipes.js')
    const modUrl = pathToFileURL(localPath).href
    const mod = await import(modUrl)
    const seeds = (mod && (mod.default || mod.recipes)) || []
    if (!Array.isArray(seeds)) return res.status(400).json({ error: 'local recipes export is not an array' })
    writeDB({ recipes: seeds })
    res.json({ ok: true, count: seeds.length })
  } catch (e) {
    res.status(500).json({ error: e.message || 'failed to load local recipes' })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Mock server running on http://localhost:${PORT}`))
