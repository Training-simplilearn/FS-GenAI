import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import './recipe.css'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import RecipeForm from './components/RecipeForm'
import RecipeProvider from './context/RecipeContext'
import RecipeEdit from './components/RecipeEdit'

function App() {
  return (
    <BrowserRouter>
      <RecipeProvider>
      <header className="app-header">
        <h1>Recipe App</h1>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>

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
