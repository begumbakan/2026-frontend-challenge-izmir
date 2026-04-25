import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import EvidencePage from './pages/EvidencePage'
import './App.css'

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/evidence" element={<Layout><EvidencePage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
