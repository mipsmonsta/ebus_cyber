# GEMINI.md - Project Context: ebus_cyber

## Project Overview
`ebus_cyber` is a React-based interactive dashboard designed for monitoring and visualizing electric bus (ebus) operation mileage. The application features a futuristic "cyberpunk/sci-fi" aesthetic, designed for display in an Operations Control Center (OCC) environment.

### Main Technologies
- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS 4 (with custom cyber theme)
- **Data Visualization:** Recharts 3
- **Data Parsing:** PapaParse (for CSV processing)
- **Icons:** Lucide React

## Architecture
- **`src/App.tsx`**: The main entry point containing the dashboard layout, state management (raw data, active view), and auto-rotation logic.
- **`src/data/defaultData.ts`**: Static embedding point for "Factory Default" CSV data. Uses Vite `?raw` imports to bake data into the single-file bundle.
- **`src/components/`**:
  - `DataUploader.tsx`: Handles CSV file ingestion for dynamic updates via Settings.
  - `OverallChart.tsx`: Displays aggregated monthly mileage for the entire fleet.
  - `ModelBreakdownChart.tsx`: Shows mileage distribution by bus model for the latest available month.
- **`src/types.ts`**: Defines core data interfaces (`BusMileage`, `MonthlyTotal`, `ModelTotal`).

## Building and Running
- **Start Development Server:** `npm run dev`
- **Standard Build:** `npm run build`
- **One-Click Release:** `npm run release` (Produces a standalone timestamped HTML file in `release/`).
- **Lint Code:** `npm run lint`

## Development Conventions
### UI & Styling
- Adhere to the established **Cyberpunk Aesthetic**:
  - Colors: Use `cyber-bg` (`#020A18`), `cyber-accent` (`#00E5FF`), and `cyber-highlight` (`#FF5500`).
  - Components: Use `.panel-sci-fi` classes with decorative corners (`.corner-bl`, `.corner-br`).
  - Animations: Utilize `animate-pulse-glow` for active system indicators.
- Tailwind v4 is used for styling. Custom theme extensions are located in `tailwind.config.js`.

### Code Standards
- **TypeScript:** Use strict typing. Define interfaces in `src/types.ts` for any new data structures.
- **Functional Components:** Prefer functional components and React hooks (`useMemo`, `useEffect`, `useState`).
- **Data Integrity:** The dashboard expects CSV data with `Month`, `BusModel`, and `Mileage` columns.

## Key Files
- `src/App.tsx`: Dashboard orchestration.
- `tailwind.config.js`: Custom color palette and shadow definitions.
- `src/index.css`: Global styles and custom sci-fi UI utility classes.
- `src/types.ts`: Source of truth for data models.
