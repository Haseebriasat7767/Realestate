# Aurelia Tower — Marina Residences

A single-page concept site for a fictional waterfront development. From the tower view, choose a floor and fly into an image-based residence tour. The tour supports horizontal dragging, room tabs, arrow navigation, and interactive details.

## Run locally

```sh
npm ci
npm run dev
```

Create a production build with `npm run build`, and serve it locally with `npm run preview`.

Built with React, Vite, Tailwind CSS, and Framer Motion. Floor specifications, room annotations, and residence listings live in `src/data.js`. The architectural renderings are original AI-generated artwork, served locally as WebP files.

The enquiry form validates input and demonstrates the confirmation state. It does not transmit or store enquiries; connect a submission endpoint before using it to collect real leads.
