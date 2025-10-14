import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Ride Smarter with Book_A_Taxi</h1>
          <p>
            Book reliable rides in seconds, choose from tailored services, and
            track every trip from pickup to drop-off.
          </p>
          <div className="hero-actions">
            <Link to="/booking" className="btn primary">
              Book a Ride
            </Link>
            <Link to="/services" className="btn secondary">
              Explore Services
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <h2>Need a ride now?</h2>
          <p>We are available 24/7 across major cities.</p>
          <ul className="hero-benefits">
            <li>Instant confirmations</li>
            <li>Professional drivers</li>
            <li>Transparent pricing</li>
          </ul>
        </div>
      </section>

      <section className="highlights">
        <h2>Why passengers choose us</h2>
        <div className="highlight-grid">
          <article>
            <h3>Real-time Matching</h3>
            <p>
              Our smart dispatcher pairs you with the nearest available driver
              to reduce wait time.
            </p>
          </article>
          <article>
            <h3>Multiple Ride Options</h3>
            <p>
              From business class sedans to parcel delivery, select the service
              that matches your needs.
            </p>
          </article>
          <article>
            <h3>Safety First</h3>
            <p>
              Every ride is monitored end-to-end and our drivers go through
              rigorous screening.
            </p>
          </article>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to get moving?</h2>
        <p>Secure your spot with a quick booking today.</p>
        <Link to="/booking" className="btn primary">
          Start Booking
        </Link>
      </section>
    </div>
  )
}

export default Home
