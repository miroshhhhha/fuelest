# Fuelest Estonia

A modern, real-time fuel price tracking application for Estonia. This tool helps users find the best deals at gas stations across the country with an interactive map and sorted price lists.

## 📊 Data Source
**Important:** This project does not own the data. All fuel price information is retrieved in real-time from [fuelest.ee](https://fuelest.ee/). We are grateful for their service in providing transparent fuel pricing for the Estonian community.

## ✨ Features
- **Real-time Tracking**: Up-to-date prices for 95, 98, Diesel, and LPG.
- **Interactive Map**: Built with Leaflet to visualize station locations across Estonia.
- **Best Deals (24h)**: Highlighting the cheapest options available within the last 24 hours.
- **Station Search & Focus**: Clicking on a price card automatically focuses the map on that specific station.
- **Navigation Integration**: Quick links to open station locations in Google Maps or Waze.
- **Responsive Design**: Fully functional on both desktop and mobile devices.

## 🛠 Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Mapping**: Leaflet & React-Leaflet
- **Styling**: Vanilla CSS (Custom properties/Variables)
- **Icons**: Lucide-inspired SVG components
- **Linting**: ESLint with TypeScript configurations

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

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

## 📝 License
This project is created for educational and personal use. Please refer to [fuelest.ee](https://fuelest.ee/) regarding their data usage policies.
