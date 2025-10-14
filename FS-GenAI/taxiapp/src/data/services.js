export const serviceCatalog = [
  {
    name: 'Everyday Rides',
    description:
      'Dependable rides for daily commutes, errands, and on-demand city travel.',
    perks: ['Instant driver match', 'Live ETA updates', 'Cashless payments'],
  },
  {
    name: 'Airport Transfers',
    description:
      'Streamlined pickups and drop-offs for flights, with flight tracking on request.',
    perks: ['Meet & greet option', 'Luggage assistance', 'Flight monitoring'],
  },
  {
    name: 'Business Class',
    description:
      'A polished experience in premium vehicles to impress clients and executives.',
    perks: ['Executive sedans', 'Chauffeur-level service', 'Bottle water onboard'],
  },
  {
    name: 'Parcel Dispatch',
    description:
      'Send important packages securely with same-day delivery across town.',
    perks: ['Proof of delivery', 'Live status updates', 'Priority routing'],
  },
]

export const serviceNames = serviceCatalog.map((service) => service.name)
