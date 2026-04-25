import Header from './components/Header'
import Hero from './components/Hero'
import CaseBoard from './components/CaseBoard'
import SightingsMap from './components/SightingsMap'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CaseBoard />
        <SightingsMap />
      </main>
      <footer className="footer">
        <div className="footer-status">
          <span className="dot" />
          Case Active — Investigation Ongoing
        </div>
        <p className="footer-text">
          JotForm Detective Agency &mdash; <span>Operation: Find Podo</span>
        </p>
      </footer>
    </>
  )
}

export default App
