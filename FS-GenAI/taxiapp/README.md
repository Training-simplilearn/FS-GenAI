# Book_A_Taxi Frontend Starter

This project provides the React front-end starter experience for Book_A_Taxi, including the marketing pages, booking workflow, and baseline styling to launch a taxi ride booking application quickly.

## Features

- Home, About, Services, Contact, and Booking pages implemented with React Router for seamless navigation.
- Shared layout (`src/components/Layout.jsx`) that renders the header navigation, footer, and shared styling shell for every page.
- Services page loads catalog data from `src/data/services.js` and passes the selected service to the Booking page via a query string.
- Booking form validates rider contact details, trip logistics, and passenger counts before accepting a submission.
- Visual design crafted with custom CSS (`src/App.css`, `src/index.css`) for a coherent Book_A_Taxi theme and responsive layout.

## Project Structure

```
src/
  components/
    Layout.jsx          // Header, navigation, and footer wrapper
  data/
    services.js         // Service catalog and helper exports
  pages/
    About.jsx           // Company story and values
    Booking.jsx         // Ride booking form with validation
    Contact.jsx         // Support and partnership contact info
    Home.jsx            // Hero, highlights, and CTA sections
    Services.jsx        // Service catalog cards with deep links
  App.jsx               // Route definitions that map pages to paths
  App.css               // Component level and page styling
  index.css             // Global reset and typography styles
  main.jsx              // App bootstrap with BrowserRouter
```

## Running the App

```
npm install
npm run dev
```

Visit the development server URL printed in the terminal (usually http://localhost:5173). Use `npm run build` to create a production build when needed.

## Key Implementation Notes

- **Navigation and Layout:** `App.jsx` wraps each route in `Layout`, which centralizes the header navigation links, footer copy, and main content container.
- **Service Catalog:** `services.js` exports both `serviceCatalog` (used to render cards on the Services page) and `serviceNames` (used to populate the booking dropdown and validate incoming values).
- **Deep Linking to Booking:** When a user clicks "Book" on a service card, `Services.jsx` appends `?service=<Service Name>` to the booking URL. `Booking.jsx` reads this query parameter with `useSearchParams`, validates it against `serviceNames`, and preselects the matching option in the "Service Type" dropdown. If an invalid value is supplied, the form gracefully falls back to the default service.
- **Form Validation:** `Booking.jsx` enforces required fields for full name, email, phone, pickup/drop-off locations, date, time, service type, and passenger count. Regular expressions validate email and phone format, and inline messages surface validation errors next to the relevant input.
- **Submission Feedback:** On a successful submission, the form resets while retaining any service passed through the URL. Status banners inform users whether the submission succeeded or if they need to correct fields.

These building blocks establish a clear foundation that can be extended with live APIs, authentication, and richer booking flows as the application matures.
