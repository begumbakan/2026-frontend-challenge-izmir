import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <header className="header">
      <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
        <span className="header-logo-top">JotForm Detective Agency</span>
        <span className="header-logo-name">
          Operation: <span>Find Podo</span>
        </span>
      </Link>

      <div className="header-status">
        <span className="header-status-dot" />
        Case Active
      </div>

      <nav className="header-nav">
        {onHome ? (
          <>
            <a href="#case-board" className="nav-link">Case Board</a>
            <a href="#map" className="nav-link">Map</a>
          </>
        ) : (
          <>
            <a href="/#case-board" className="nav-link">Case Board</a>
            <a href="/#map" className="nav-link">Map</a>
          </>
        )}
        <Link to="/evidence" className={`nav-link${pathname === '/evidence' ? ' active' : ''}`}>
          Evidence
        </Link>
      </nav>
    </header>
  )
}
