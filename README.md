# ⛽ Fuelest Estonia

A high-performance, real-time fuel price monitoring dashboard for Estonia. This application provides a comprehensive overview of fuel costs, historical trends, and location-based deals, all styled with a modern, responsive interface.

## 📊 Data Source & Legal
**Important:** This application is a third-party interface and is **entirely powered** by data from [fuelest.ee](https://fuelest.ee/). 
- All fuel price information, gas station coordinates, and historical data are retrieved in real-time from their public endpoints.
- This project is for educational and personal use only.
- We highly recommend visiting the original source for official information.

---

## ✨ Key Features

### 📍 Interactive Station Map
- Visualize gas stations across Estonia using Leaflet.
- Custom stylized markers and high-quality popups with detailed fuel information.
- Smooth "Fly-to" navigation when selecting stations from lists.

### 🔍 Advanced Radius Search (UX Optimized)
- Click anywhere on the map to define a search center.
- Adjustable radius from **200 meters to 25 kilometers**.
- Real-time ranked list of all stations in the selected area, sorted by price.
- Dynamic distance calculation and price update tracking (e.g., "2h ago").

### 📈 Market Insights & Trends
- Interactive charts powered by **Recharts**.
- **Dual-axis visualization**: Compare local fuel prices (EUR) against global **Brent Oil** prices (USD).
- Smart X-axis formatting that adapts to the time range (Week, Month, Year, or Custom).
- Custom date range selector for deep historical analysis.

### 📱 Modern & Responsive UI
- Built with **Tailwind CSS v4** for a clean, professional aesthetic.
- Full support for mobile devices and high-DPI screens.
- Dark-mode inspired control panels within a light-themed, accessible layout.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Icons**: Lucide & Custom SVG components

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (Latest LTS version)
- **npm** or **pnpm**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/miroshhhhha/fuelest.git
   cd fuelest-clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### ⚓ CORS & Proxy Note
To bypass CORS restrictions during development, the project uses a Vite proxy configured in `vite.config.ts`. Requests to `/api-fuel` are redirected to `https://fuelest.ee` with modified headers to match the origin requirements.

---

## 📝 Credits
Special thanks to the team at [fuelest.ee](https://fuelest.ee/) for their transparency and for providing the data that makes this community tool possible.
