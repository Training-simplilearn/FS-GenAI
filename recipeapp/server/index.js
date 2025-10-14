import express from 'express'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import { fileURLToPath } from 'url'

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

app.get('/recipes', (req, res) => {
  const db = readDB()
  res.json(db.recipes)
})

app.get('/recipes/:id', (req, res) => {
  const db = readDB()
  const r = db.recipes.find(x => x.id === req.params.id)
  if (!r) return res.status(404).json({ error: 'Not found' })
  res.json(r)
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

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Mock server running on http://localhost:${PORT}`))
