# ⚡ E-BUS CYBER DASHBOARD

![Build Status](https://img.shields.io/badge/status-active-00E5FF?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React_19-Vite_8-FF5500?style=for-the-badge)
![Aesthetic](https://img.shields.io/badge/Aesthetic-Cyberpunk-7B61FF?style=for-the-badge)

A futuristic, high-performance monitoring dashboard designed for Electric Bus (eBus) Operations Control Centers (OCC). Built with a "Cyber-HUD" aesthetic, this interactive visualization tool tracks fleet mileage, model-specific performance, and cumulative operational metrics.

## 🚀 Overview

`ebus_cyber` transforms raw operational data into a mission-critical visual interface. It features auto-rotating views, glowing telemetry indicators, and real-time data parsing to provide OCC operators with a seamless overview of fleet health and performance.

### Key Features
- **Cyber-HUD Interface:** Stylized sci-fi panels with glowing animations and decorative corners.
- **Dynamic Data Ingestion:** Integrated CSV parser (PapaParse) for seamless mileage data updates.
- **Automated Operations:** Toggleable auto-rotation between "Overall Fleet" and "Model Breakdown" views.
- **Advanced Visualizations:** 
  - **Overall Mileage:** Multi-month cumulative trend using high-contrast area charts.
  - **Model Breakdown:** Real-time distribution by bus model (BYD, MAN, Mercedes, etc.) for the latest telemetry period.
- **Responsive Design:** Optimized for large-scale OCC wall displays and monitoring terminals.

## 🛠️ Tech Stack

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (Custom Cyber Theme)
- **Visualizations:** [Recharts 3](https://recharts.org/)
- **Data Parsing:** [PapaParse](https://www.papaparse.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mipsmonsta/ebus_cyber.git
   cd ebus_cyber
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Launch the dashboard in development mode:
```bash
npm run dev
```

### Production Build
Compile and optimize for deployment:
```bash
npm run build
npm run preview
```

### 🎯 One-Click Release (Government-Ready)
To generate a completely self-contained, single-file HTML dashboard for restricted environments:
```bash
npm run release
```
This command:
1.  Bakes current CSV data (factory defaults) into the code.
2.  Inlines all CSS, JS, and Assets.
3.  Saves a timestamped file to the `release/` folder (e.g., `E-Bus-Dashboard_2026-04-26.html`).
4.  **Deployment:** Simply copy this single HTML file to any machine and double-click to run. No server or installation required.

## 📂 Data Structure

The dashboard expects CSV files in the following format (samples located in `bus_models_data/`):

| Month | BusModel | Mileage |
| :--- | :--- | :--- |
| 2025-01 | BYD K9 | 4500 |
| 2025-01 | MAN Lion's City | 3800 |

## 🎨 Aesthetic Guidelines

This project adheres to a **Cyberpunk/Sci-Fi** design language:
- **Primary Colors:** `cyber-bg` (#020A18), `cyber-accent` (#00E5FF), `cyber-highlight` (#FF5500).
- **UI Components:** Custom `.panel-sci-fi` utility classes with decorative SVG corners.
- **Animations:** `animate-pulse-glow` for active system indicators and `animate-digital-load` for chart transitions.

---

*Terminal: EB-OCC-42526 // System Integrity: Nominal*
