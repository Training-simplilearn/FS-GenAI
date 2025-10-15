import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import './App.css'
import './recipe.css'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import RecipeForm from './components/RecipeForm'
import RecipeProvider from './context/RecipeContext'
import RecipeEdit from './components/RecipeEdit'
import ShoppingList from './components/ShoppingList'
import ModeToggle from './components/ModeToggle'
import ToastContainer from './components/Toast'
import { useContext, useState } from 'react'
import { RecipeContext } from './context/RecipeContextBase'

function App() {
  const [navOpen, setNavOpen] = useState(false)
  return (
    <BrowserRouter>
      <RecipeProvider>
  <HeaderWithMode onToggleNav={() => setNavOpen(o => !o)} />

      <div className="app-shell">
        <aside className={`left-nav ${navOpen ? 'open' : ''}`}>
          <div className="logo"></div>
          <nav>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            <NavLink to="/shopping" className={({ isActive }) => isActive ? 'active' : ''}>Shopping list</NavLink>
            <NavLink to="/add" className={({ isActive }) => isActive ? 'active' : ''}>New recipe</NavLink>
          </nav>
        </aside>
        <div className={navOpen ? 'nav-backdrop show' : 'nav-backdrop'} onClick={() => setNavOpen(false)} />

        <main className="center-content">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/add" element={<RecipeForm onSubmitCallback={null} submitLabel="Add" />} />
            <Route path="/edit/:id" element={<RecipeEdit />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/shopping" element={<ShoppingList />} />
          </Routes>
          <div className="recent-inline">
            <RecentRail />
          </div>
        </main>

        <aside className="right-rail">
          <RecentRail />
        </aside>
      </div>

      </RecipeProvider>


      <footer className="app-footer">
        <p>Built with React + Vite • Sample data for LMS assignment</p>
      </footer>
    </BrowserRouter>
  )
}

export default App

function HeaderWithMode() {
  const { mode, setMode, queueLength, serverUp, manualFlush, toasts, removeToast } = useContext(RecipeContext)
  return (
    <header className="app-header">
      <h1>PantryPilot</h1>
      <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <ModeToggle mode={mode} setMode={setMode} />
        <div className="status-pill" title={serverUp ? 'Server online' : 'Server offline'}>
          <div className={`dot ${serverUp ? 'ok' : 'down'}`} />
          <span className="pill-text">Queue {queueLength}</span>
          <button className="retry-btn" onClick={manualFlush}>Retry</button>
        </div>
        <ToastContainer toasts={toasts} remove={removeToast} />
      </nav>
    </header>
  )
}

function RecentRail() {
  const { recents, recipes } = useContext(RecipeContext)
  const items = recents.map(id => recipes.find(r => r.id === id)).filter(Boolean)
  return (
    <div className="recent-rail">
      <h4>Recently viewed</h4>
      <div className="recent-list">
        {items.map(r => (
          <div key={r.id} className="recent-item">
            <div className="recent-thumb" style={{ backgroundImage: `url(${r.image})` }} />
            <div className="recent-meta">
              <div className="recent-title">{r.name}</div>
              <div className="recent-desc">{r.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
