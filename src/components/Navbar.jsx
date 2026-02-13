import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Add scroll listener
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          <div className="nav-left">
            <img src="/logo.png" alt="Logo" className="rotating-logo" />
          </div>

          <Link to="/" className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">
              AstroBharatAI
              <span className="logo-tagline">STARS ALIGN DESTINY DIVINE</span>
            </span>
          </Link>

          <div className="nav-right">
            <Link to="/apply" className="btn btn-primary">Apply Now</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}


export default Navbar
