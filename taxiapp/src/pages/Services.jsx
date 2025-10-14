import { Link } from 'react-router-dom'
import { serviceCatalog } from '../data/services.js'

function Services() {
  return (
    <div className="page services-page">
      <header className="page-header">
        <h1>Services Tailored to Every Trip</h1>
        <p>
          Pick the ride experience that fits the moment. Select a service below
          to see how we can support your journey.
        </p>
      </header>

      <div className="service-grid">
        {serviceCatalog.map((service) => (
          <article key={service.name} className="service-card">
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <ul>
              {service.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <Link
              to={`/booking?service=${encodeURIComponent(service.name)}`}
              className="btn tertiary"
            >
              Book {service.name}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Services
