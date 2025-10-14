import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { serviceNames } from '../data/services.js'

const initialFormState = {
  fullName: '',
  email: '',
  phone: '',
  pickupLocation: '',
  dropoffLocation: '',
  serviceType: 'Everyday Rides',
  pickupDate: '',
  pickupTime: '',
  passengers: '1',
  notes: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[0-9()+\-\s]{7,}$/

const resolveServiceType = (service) =>
  serviceNames.includes(service) ? service : initialFormState.serviceType

function Booking() {
  const [searchParams] = useSearchParams()
  const requestedService = searchParams.get('service') ?? ''
  const resolvedService = resolveServiceType(requestedService)

  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    serviceType: resolvedService,
  }))
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)

  useEffect(() => {
    if (resolvedService !== formData.serviceType) {
      setFormData((prev) => ({ ...prev, serviceType: resolvedService }))
    }
  }, [resolvedService, formData.serviceType])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'An email address is required.'
    } else if (!emailPattern.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'A contact number helps your driver reach you.'
    } else if (!phonePattern.test(formData.phone)) {
      nextErrors.phone = 'Phone numbers should contain at least 7 digits.'
    }

    if (!formData.pickupLocation.trim()) {
      nextErrors.pickupLocation = 'Add your pickup location.'
    }

    if (!formData.dropoffLocation.trim()) {
      nextErrors.dropoffLocation = 'Add your drop-off location.'
    }

    if (!formData.pickupDate) {
      nextErrors.pickupDate = 'Select a pickup date.'
    }

    if (!formData.pickupTime) {
      nextErrors.pickupTime = 'Select a pickup time.'
    }

    if (!formData.serviceType) {
      nextErrors.serviceType = 'Pick a service type.'
    }

    const passengerCount = Number(formData.passengers)
    if (!formData.passengers) {
      nextErrors.passengers = 'Please add the number of passengers.'
    } else if (Number.isNaN(passengerCount) || passengerCount < 1) {
      nextErrors.passengers = 'At least one passenger is required.'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSubmitStatus({
        type: 'error',
        message: 'Update the highlighted fields and try again.',
      })
      return
    }

    setErrors({})
    setSubmitStatus({
      type: 'success',
      message:
        'Thanks! Your ride request has been received. A confirmation will arrive shortly.',
    })
    setFormData(() => ({
      ...initialFormState,
      serviceType: resolvedService,
    }))
  }

  return (
    <div className="page booking-page">
      <header className="page-header">
        <h1>Book a Ride</h1>
        <p>
          Share a few trip details so we can match you with the right driver and
          vehicle.
        </p>
      </header>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              aria-describedby="error-fullName"
              required
            />
            {errors.fullName && (
              <span className="field-error" id="error-fullName">
                {errors.fullName}
              </span>
            )}
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-describedby="error-email"
              required
            />
            {errors.email && (
              <span className="field-error" id="error-email">
                {errors.email}
              </span>
            )}
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              aria-describedby="error-phone"
              required
            />
            {errors.phone && (
              <span className="field-error" id="error-phone">
                {errors.phone}
              </span>
            )}
          </label>

          <label>
            Service Type
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              aria-describedby="error-serviceType"
              required
            >
              {serviceNames.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {errors.serviceType && (
              <span className="field-error" id="error-serviceType">
                {errors.serviceType}
              </span>
            )}
          </label>

          <label>
            Pickup Location
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              aria-describedby="error-pickupLocation"
              required
            />
            {errors.pickupLocation && (
              <span className="field-error" id="error-pickupLocation">
                {errors.pickupLocation}
              </span>
            )}
          </label>

          <label>
            Drop-off Location
            <input
              type="text"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              aria-describedby="error-dropoffLocation"
              required
            />
            {errors.dropoffLocation && (
              <span className="field-error" id="error-dropoffLocation">
                {errors.dropoffLocation}
              </span>
            )}
          </label>

          <label>
            Pickup Date
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              aria-describedby="error-pickupDate"
              required
            />
            {errors.pickupDate && (
              <span className="field-error" id="error-pickupDate">
                {errors.pickupDate}
              </span>
            )}
          </label>

          <label>
            Pickup Time
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              aria-describedby="error-pickupTime"
              required
            />
            {errors.pickupTime && (
              <span className="field-error" id="error-pickupTime">
                {errors.pickupTime}
              </span>
            )}
          </label>

          <label>
            Passengers
            <input
              type="number"
              name="passengers"
              min="1"
              max="6"
              value={formData.passengers}
              onChange={handleChange}
              aria-describedby="error-passengers"
              required
            />
            {errors.passengers && (
              <span className="field-error" id="error-passengers">
                {errors.passengers}
              </span>
            )}
          </label>
        </div>

        <label className="notes-field">
          Ride Notes (optional)
          <textarea
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>

        {submitStatus && (
          <div
            className={
              submitStatus.type === 'success'
                ? 'form-status success'
                : 'form-status error'
            }
            role={submitStatus.type === 'success' ? 'status' : 'alert'}
          >
            {submitStatus.message}
          </div>
        )}

        <button type="submit" className="btn primary submit-btn">
          Submit Booking Request
        </button>
      </form>
    </div>
  )
}

export default Booking
