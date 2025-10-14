import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import './recipe.css'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import RecipeForm from './components/RecipeForm'
import RecipeProvider from './context/RecipeContext'
import RecipeEdit from './components/RecipeEdit'
import ModeToggle from './components/ModeToggle'
import { useContext } from 'react'
import { RecipeContext } from './context/RecipeContextBase'

function App() {
  return (
    <BrowserRouter>
      <RecipeProvider>
      <HeaderWithMode />

      <main>
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/add" element={<RecipeForm onSubmitCallback={null} submitLabel="Add" />} />
          <Route path="/edit/:id" element={<RecipeEdit />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </main>

      </RecipeProvider>


      <footer className="app-footer">
        <p>Built with React + Vite • Sample data for LMS assignment</p>
      </footer>
    </BrowserRouter>
  )
}

export default App

function HeaderWithMode() {
  const { mode, setMode, queueLength } = useContext(RecipeContext)
  return (
    <header className="app-header">
      <h1>Recipe App</h1>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <ModeToggle mode={mode} setMode={setMode} />
        <div style={{ fontSize: '.85rem', color: '#666' }}>Queue: {queueLength}</div>
      </nav>
    </header>
  )
}
