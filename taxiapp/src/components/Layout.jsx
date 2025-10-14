import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/booking', label: 'Book a Ride' },
  { to: '/contact', label: 'Contact' },
]

function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">Book_A_Taxi</div>
        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="site-content">{children}</main>

      <footer className="site-footer">
        <div>
          &copy; {new Date().getFullYear()} Book_A_Taxi. All rights reserved.
        </div>
        <div>Serving rides around the clock.</div>
      </footer>
    </div>
  )
}

export default Layout
