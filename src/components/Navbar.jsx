import { Link } from 'react-router-dom'
import { useState } from 'react'

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
            <img src="/image.png" alt="Logo" className="rotating-logo" />
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
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(92, 26, 26, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          padding: var(--space-md) 0;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(212, 165, 116, 0.1);
        }
        
        .navbar.scrolled {
          background: rgba(92, 26, 26, 0.98);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .navbar-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: var(--space-md);
        }

        .nav-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .nav-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .rotating-logo {
          width: 60px;
          height: 60px;
          animation: slowRotate 20s linear infinite;
          filter: sepia(100%) saturate(500%) brightness(200%) hue-rotate(0deg);
        }

        @keyframes slowRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          text-decoration: none;
          justify-content: center;
        }

        .logo-icon {
          font-size: 1.5rem;
        }
        
        .logo-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-accent);
          white-space: nowrap;
        }

        .logo-tagline {
          font-size: 0.5rem;
          font-weight: 400;
          letter-spacing: 2px;
          color: var(--color-accent);
          margin-top: -2px;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: var(--space-sm) 0;
          }

          .navbar-content {
            grid-template-columns: auto 1fr auto;
            gap: var(--space-xs);
          }

          .rotating-logo {
            width: 32px;
            height: 32px;
          }

          .logo-icon {
            font-size: 1.2rem;
          }

          .logo-text {
            font-size: 0.85rem;
          }

          .logo-tagline {
            font-size: 0.35rem;
            letter-spacing: 1px;
          }

          .btn-primary {
            padding: var(--space-xs) var(--space-sm);
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: var(--space-xs) 0;
          }

          .navbar-content {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            gap: var(--space-xs);
            text-align: center;
          }

          .nav-left {
            grid-column: 1;
            grid-row: 1;
            justify-content: center;
            order: 2;
          }

          .logo {
            grid-column: 1;
            grid-row: 1;
            order: 1;
          }

          .nav-right {
            grid-column: 1;
            grid-row: 2;
            justify-content: center;
            order: 3;
          }

          .rotating-logo {
            display: none;
          }

          .logo-icon {
            font-size: 1rem;
          }

          .logo-text {
            font-size: 0.75rem;
          }

          .logo-tagline {
            font-size: 0.3rem;
            letter-spacing: 0.5px;
          }

          .btn-primary {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
