# Face App: Facial Rehabilitation PWA

A Progressive Web App designed to assist patients with Facial Nerve Palsy (UMN and LMN). It provides real-time, quantified feedback for facial exercises using client-side computer vision, ensuring privacy and offline capability.

## Features
- **Real-Time Tracking:** Utilizes MediaPipe Face Mesh (468 landmarks) entirely in the browser.
- **Quantifiable Metrics:** Calculates EAR (Eye Aspect Ratio) and spatial symmetry using geometric rule-based logic (No AI/ML backend required).
- **Clinical Classification:** Automated detection of UMN (forehead spared) vs LMN (complete hemifacial) patterns.
- **PWA Ready:** Installable on iOS/Android, works entirely offline after initial load.

## Tech Stack
- React 18, Vite, Tailwind CSS
- MediaPipe Camera Utils & Face Mesh
- Recharts (for progress dashboards)

## Quick Start
1. Ensure Node.js is installed (v16+ recommended).
2. Clone the repository.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open `http://localhost:5173` in your browser.

## Architecture Guidelines
- **`/utils/metrics.js`**: Contains purely mathematical, stateless functions for calculating distances and ratios.
- **`/hooks/useFaceMesh.js`**: Isolates the side-effects of webcam access and the MediaPipe WebAssembly lifecycle.
- **State Management**: Context API / LocalStorage for session persistence to ensure data never leaves the patient's device.