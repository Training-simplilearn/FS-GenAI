function About() {
  return (
    <div className="page about-page">
      <header className="page-header">
        <h1>About Book_A_Taxi</h1>
        <p>
          We are on a mission to make city travel smoother, safer, and more
          predictable for riders and operators alike.
        </p>
      </header>

      <section className="content-section">
        <h2>Who We Are</h2>
        <p>
          Book_A_Taxi connects riders with trusted local drivers through a
          platform that prioritizes convenience and transparency. Founded by
          transportation enthusiasts, we combine industry experience with
          cutting-edge technology to remove the stress from getting around town.
        </p>
      </section>

      <section className="content-section">
        <h2>What Drives Us</h2>
        <ul className="value-list">
          <li>
            <strong>Reliability:</strong> Rides arrive when we say they will,
            with real-time tracking every step of the way.
          </li>
          <li>
            <strong>Community:</strong> We partner with professional drivers who
            know their cities inside and out.
          </li>
          <li>
            <strong>Innovation:</strong> AI-powered routing, dynamic pricing,
            and proactive support keep our riders in motion.
          </li>
        </ul>
      </section>
    </div>
  )
}

export default About
