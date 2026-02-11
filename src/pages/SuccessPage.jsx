import { useLocation, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function SuccessPage() {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const applicationId = location.state?.applicationId || 'N/A'
  const qualified = location.state?.qualified || false
  const atsScore = location.state?.atsScore

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const result = location.state?.result
  console.log('🚀 [UI] Result from backend:', result, location.state);

  // Backward compatibility or fallback
  const isRejection = result === 'REJECTED_BY_ATS' || (!result && !qualified)
  const isManualReview = result === 'RECEIVED_MANUAL_REVIEW'
  const isQualified = result === 'QUALIFIED' || (!result && qualified && !isManualReview)

  // Title Logic
  let title = 'Application Submitted!'
  if (isQualified) title = 'Congratulations!'
  else if (isManualReview) title = 'Application Received'
  else if (isRejection) title = 'Application Status'

  return (
    <div className="success-page">
      <div className="container-narrow text-center">
        <div className={`success-card glass-card ${isVisible ? 'slide-up' : ''}`}>
          <div className="success-icon">
            {isRejection ? '📝' : (isQualified ? '🎉' : '✨')}
          </div>

          <h1 className="success-title">{title}</h1>

          <p className="success-message">
            {isQualified && (
              <>
                Thank you for applying to join <span className="text-brand">AstroBharatAI</span>!
                <br />
                <strong>Your profile meets our requirements.</strong> Our HR team has been notified and will contact you within 7-10 business days.
              </>
            )}

            {isManualReview && (
              <>
                Thank you for applying to <span className="text-brand">AstroBharatAI</span>.
                <br />
                <strong>Application received.</strong> Your profile will be reviewed manually by our hiring team. We will get back to you if your skills match our requirements.
              </>
            )}

            {isRejection && (
              <>
                Thank you for your interest in <span className="text-brand">AstroBharatAI</span>.
                <br />
                Your application has been received. Unfortunately, your profile does not meet our current requirements. We will keep your resume on file for future opportunities.
              </>
            )}
          </p>

          <div className="application-id-box">
            <div className="label">Application ID</div>
            <div className="app-id">{applicationId}</div>
          </div>

          {isQualified && (
            <div className="timeline">
              <h3 className="timeline-title">What happens next?</h3>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>1. HR Review</h4>
                  <p>Our HR team is reviewing your application and will reach out soon.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>2. Initial Interview</h4>
                  <p>Qualified candidates will be invited for an initial interview within 7-10 days.</p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>3. Final Selection</h4>
                  <p>Successful candidates will receive an offer to join our team!</p>
                </div>
              </div>
            </div>
          )}

          {isManualReview && (
            <div className="success-note">
              <p>
                <strong>Note:</strong> Since you applied for a specialized or custom role, our standard automated screening has been skipped to ensure your unique skills are evaluated fairly by a human recruiter.
              </p>
            </div>
          )}

          {isRejection && (
            <div className="success-note">
              <p>
                <strong>Why wasn't I selected?</strong><br />
                Our system reviews resumes based on skills, experience, and education. While your profile doesn't match our current openings, we encourage you to apply again in the future or explore other opportunities with us.
              </p>
            </div>
          )}

          <Link to="/" className="btn btn-primary btn-lg mt-xl">
            ← Return to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 160px 0 var(--space-2xl);
        }

        .success-card {
          padding: var(--space-2xl);
          max-width: 700px;
          margin: 0 auto;
        }

        .success-icon {
          font-size: 5rem;
          margin-bottom: var(--space-lg);
          animation: pulse 2s ease-in-out infinite;
        }

        .success-title {
          color: var(--color-primary);
          margin-bottom: var(--space-md);
        }

        .success-message {
          font-size: 1.125rem;
          margin-bottom: var(--space-xl);
          line-height: 1.6;
        }

        .application-id-box {
          background: rgba(92, 26, 26, 0.05);
          border: 1px solid var(--color-primary);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-bottom: var(--space-2xl);
        }

        .label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-xs);
        }

        .app-id {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--color-primary);
          letter-spacing: 2px;
        }

        .timeline {
          text-align: left;
          margin-bottom: var(--space-xl);
        }

        .timeline-title {
          text-align: center;
          color: var(--color-primary);
          margin-bottom: var(--space-lg);
        }

        .timeline-item {
          display: flex;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 11px;
          top: 30px;
          width: 2px;
          height: calc(100% + var(--space-lg));
          background: rgba(92, 26, 26, 0.2);
        }

        .timeline-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          flex-shrink: 0;
          margin-top: 4px;
        }

        .timeline-content h4 {
          color: var(--color-text);
          margin-bottom: var(--space-xs);
        }

        .timeline-content p {
          color: var(--color-text-secondary);
          margin: 0;
          font-size: 0.9375rem;
        }

        .success-note {
          background: rgba(255, 255, 255, 0.05);
          border-left: 3px solid var(--color-primary);
          padding: var(--space-md);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-lg);
        }

        .success-note p {
          margin: 0;
          font-size: 0.9375rem;
          text-align: left;
        }

        .success-note strong {
          color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .success-card {
            padding: var(--space-lg);
          }

          .success-icon {
            font-size: 3.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default SuccessPage
