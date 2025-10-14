function Contact() {
  return (
    <div className="page contact-page">
      <header className="page-header">
        <h1>Contact Us</h1>
        <p>
          Need help with a booking or have a partnership idea? Our support team
          is ready to assist.
        </p>
      </header>

      <section className="contact-grid">
        <article>
          <h2>Support Center</h2>
          <p>We respond to most messages within an hour.</p>
          <ul>
            <li>
              Email: <a href="mailto:care@bookataxi.com">care@bookataxi.com</a>
            </li>
            <li>Phone: +1 (555) 014-7890</li>
            <li>Live chat: open daily 6am–11pm</li>
          </ul>
        </article>

        <article>
          <h2>Head Office</h2>
          <address>
            245 Mobility Way
            <br />
            Suite 1100
            <br />
            New York, NY 10016
          </address>
          <p>Schedule a visit by appointment.</p>
        </article>

        <article>
          <h2>Driver Partnerships</h2>
          <p>
            Interested in driving with us? Submit your profile and we&apos;ll be
            in touch.
          </p>
          <a className="btn secondary" href="mailto:drive@bookataxi.com">
            Become a Driver
          </a>
        </article>
      </section>
    </div>
  )
}

export default Contact
