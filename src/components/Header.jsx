export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="header-logo-top">JotForm Detective Agency</span>
        <span className="header-logo-name">
          Operation: <span>Find Podo</span>
        </span>
      </div>

      <div className="header-status">
        <span className="header-status-dot" />
        Case Active
      </div>

      <nav className="header-nav">
        <a href="#case-board" className="nav-link">Case Board</a>
        <a href="#map" className="nav-link">Map</a>
      </nav>
    </header>
  )
}
