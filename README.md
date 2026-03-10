# Fuelest Estonia

A modern, real-time fuel price tracking application for Estonia.

## 📊 Data Source
**Important:** This application is entirely powered by data from [fuelest.ee](https://fuelest.ee/). All fuel price information, station locations, and historical trends are retrieved in real-time from their services. This project is a third-party interface and is not affiliated with fuelest.ee.

## ✨ Features
- **Real-time Tracking**: Up-to-date prices for 95, 98, Diesel, and LPG.
- **Price Trends**: Interactive charts showing fuel and Brent oil price history.
- **Interactive Map**: Visualize gas station locations across Estonia.
- **Custom Search Radius**: Click anywhere on the map to find all stations and best prices within a chosen range (200m to 25km).
- **Best Deals (24h)**: Highlighting the cheapest options available within the last 24 hours.
- **Navigation Integration**: Quick links to open station locations in Google Maps or Waze.

## 🛠 Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Charting**: Recharts
- **Mapping**: Leaflet & React-Leaflet
- **Styling**: Vanilla CSS
- **Linting**: ESLint with TypeScript configurations

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
```bash
npm run build
```

## 📝 Credits
Special thanks to [fuelest.ee](https://fuelest.ee/) for providing the data that makes this application possible.
