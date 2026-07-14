# Susi Air Pilot Dashboard

A mobile-first web application designed for pilots to monitor flight hours, duty schedules, and document expiration status.

## Tech Stack
- Framework: Nuxt JS
- State Management: Pinia
- Styling: Sass (SCSS)
- Deployment: Vercel

## Setup & Running

1. Clone the repository
```bash 
git clone (https://github.com/WidiNug23/pilot-susi-air-mobile.git)
cd susi-air-pilot
```
2. Install dependencies
```bash
npm install

npm install @pinia/nuxt

npm install -D sass
```
3. Run in development mode
```bash 
npm run dev
```
the application will be available at: http://localhost:3000


If I had more time, I would implement unit testing to ensure the accuracy of the flight hour calculation logic and integrate real-time data fetching from a database via an API. Furthermore, I plan to enhance the application by adding detailed scheduling views, implementing additional visualizations such as pie and bar charts for flight hours, and developing an integrated pilot logbook feature.

For this development, I chose Nuxt 3 because its auto-import features and intuitive folder structure significantly accelerate the development process. I utilized Pinia for state management to ensure a single source of truth for scheduling and flight data across all components, and Sass (SCSS) to maintain a structured, mobile-first design system. Additionally, if further backend integration is required, I would implement Laravel due to its robust ecosystem and efficient Model-View-Controller (MVC) architecture.
