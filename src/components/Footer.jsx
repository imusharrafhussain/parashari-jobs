function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="text-gradient">AstroBharatAI</h3>
            <p className="footer-tagline">Stars Align Destiny Divine</p>
            <p className="footer-mission">
              Empowering individuals worldwide with trusted astrology and spiritual guidance.
            </p>
          </div>

          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/astrobharatai/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/astrobharatai/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.youtube.com/@AstroBharatAI" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://www.facebook.com/astrobharatai/" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://x.com/AstroBharatAI" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: mohitdhanuka01@gmail.com</p>
            <p>Website: <a href="https://astrobharatai.com" target="_blank" rel="noopener noreferrer" className="footer-link">astrobharatai.com</a></p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AstroBharatAI. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--color-primary-dark);
          padding: var(--space-2xl) 0 var(--space-lg);
          margin-top: var(--space-2xl);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--color-text);
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-xl);
          margin-bottom: var(--space-xl);
        }
        
        .footer-section h3 {
          font-size: 1.5rem;
          margin-bottom: var(--space-sm);
        }
        
        .footer-section h4 {
          color: var(--color-accent);
          margin-bottom: var(--space-sm);
          font-size: 1.1rem;
        }
        
        .footer-tagline {
          font-family: var(--font-heading);
          font-style: italic;
          color: var(--color-accent);
          margin-bottom: var(--space-sm);
        }
        
        .footer-mission {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }
        
        .social-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        
        .social-links a {
          color: var(--color-text-secondary);
          transition: color 0.3s ease;
        }
        
        .social-links a:hover {
          color: var(--color-accent);
        }
        
        .footer-link {
          color: var(--color-accent);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: var(--color-text-light);
          text-decoration: underline;
        }

        .footer-bottom {
          text-align: center;
          padding-top: var(--space-lg);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--color-text-secondary);
          font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
