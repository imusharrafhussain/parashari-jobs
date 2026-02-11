import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1 className={`hero-title ${isVisible ? 'slide-up' : ''}`}>
            Join <span className="text-brand">AstroBharatAI</span>
          </h1>
          <p className="hero-tagline">
            ✨ Stars Align Destiny Divine ✨
          </p>
          <p className="hero-description">
            Be part of a revolutionary team that's merging ancient wisdom with cutting-edge AI technology
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="text-center mb-xl">Our Mission</h2>
          <div className="mission-card glass-card">
            <p className="mission-text">
              To empower individuals worldwide with <strong>trusted astrology and spiritual guidance</strong> by
              combining traditional knowledge, ethical practices, and expert support. We believe in making
              ancient spiritual wisdom accessible and useful through both AI-assisted technology and
              human-validated insights.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="text-center mb-xl">What We Do</h2>
          <div className="grid grid-2">
            <div className="service-card glass-card">
              <div className="service-icon">🤖</div>
              <h3>AI & Human Astrology Services</h3>
              <p>Daily horoscope, numerology, Kundli tools, and interactive predictions powered by AI and validated by expert astrologers.</p>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon">👥</div>
              <h3>Live Expert Access</h3>
              <p>Connect with 5,000+ verified astrologers across multiple languages and geographies for personalized guidance.</p>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon">🕉️</div>
              <h3>Digital Spiritual Ecosystem</h3>
              <p>Digital Mandir, devotional content, courses, and learning modules that bring spirituality into the digital age.</p>
            </div>

            <div className="service-card glass-card">
              <div className="service-icon">🛍️</div>
              <h3>Astro Mall</h3>
              <p>Certified spiritual products and remedies curated by experts to support your spiritual journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="why-join-section">
        <div className="container">
          <h2 className="text-center mb-xl">Why Join Our Team?</h2>
          <div className="grid grid-3">
            <div className="feature-card glass-card">
              <div className="feature-number">01</div>
              <h3>Innovation Meets Tradition</h3>
              <p>Work at the intersection of ancient wisdom and modern AI technology in a fast-growing digital spiritual platform.</p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-number">02</div>
              <h3>Cultural Impact</h3>
              <p>Make a meaningful difference by helping millions access spiritual guidance and ancestral knowledge.</p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-number">03</div>
              <h3>Growth & Development</h3>
              <p>Dynamic, growth-oriented environment with opportunities for long-term career advancement.</p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-number">04</div>
              <h3>Mission-Driven Culture</h3>
              <p>Join a team passionate about ethical practices and making authentic spiritual wisdom accessible to all.</p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-number">05</div>
              <h3>Diverse Team</h3>
              <p>Collaborate with talented individuals from diverse backgrounds, languages, and expertise areas.</p>
            </div>

            <div className="feature-card glass-card">
              <div className="feature-number">06</div>
              <h3>Tech Excellence</h3>
              <p>Work with cutting-edge AI, machine learning, and digital platforms in a unique spiritual context.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <h2 className="mb-md">Ready to Start Your Journey?</h2>
          <p className="cta-text mb-lg">
            Join us in revolutionizing how the world experiences spirituality and astrology.<br />
            Click the "Apply" button in the top-right corner to get started.
          </p>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          padding-top: 80px;
        }

        /* Hero Section */
        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: var(--space-md);
          position: relative;
        }

        .hero-tagline {
          font-family: var(--font-heading);
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          font-style: italic;
          color: var(--color-primary);
          margin-bottom: var(--space-md);
          letter-spacing: 2px;
        }

        .hero-description {
          font-size: clamp(1rem, 2vw, 1.25rem);
          max-width: 700px;
          margin: 0 auto var(--space-xl);
          color: var(--color-text-secondary);
        }

        /* About Section */
        .about-section {
          padding: var(--space-2xl) 0;
        }

        .mission-card {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .mission-text {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--color-text);
        }

        .mission-text strong {
          color: var(--color-primary);
        }

        /* Services Section */
        .services-section {
          padding: var(--space-2xl) 0;
          background: rgba(255, 255, 255, 0.02);
        }

        .service-card {
          text-align: center;
          padding: var(--space-xl);
        }

        .service-icon {
          font-size: 3rem;
          margin-bottom: var(--space-md);
          animation: float 3s ease-in-out infinite;
        }

        .service-card h3 {
          color: var(--color-primary);
          margin-bottom: var(--space-sm);
        }

        /* Why Join Section */
        .why-join-section {
          padding: var(--space-2xl) 0;
        }

        .feature-card {
          padding: var(--space-lg);
          position: relative;
        }

        .feature-number {
          position: absolute;
          top: -15px;
          right: var(--space-md);
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: var(--color-text-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          font-family: var(--font-heading);
        }

        .feature-card h3 {
          margin-top: var(--space-md);
          color: var(--color-primary);
        }

        /* CTA Section */
        .cta-section {
          padding: var(--space-2xl) 0;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 100%);
        }

        .cta-text {
          font-size: 1.125rem;
          color: var(--color-text-secondary);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .hero {
            min-height: 70vh;
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
