# MyConductorUI

MyConductorUI is a visual builder for Netflix Conductor workflows built with Vue 3, Vite, and Tailwind CSS. Compose sequential tasks, push them to the Conductor metadata API, and inspect the generated workflow JSON in real time.

## Features
- Visual workflow board with start/end markers and add-step controls for constructing sequential pipelines
- Task panels for Simple, Inline (JavaScript), and HTTP requests with friendly form inputs
- Automatic workflow name generation and debounced syncing to `/api/metadata/workflow`
- Live JSON viewer with copy-to-clipboard, character count, and reset actions
- Axios-powered API integration configurable via the optional `VITE_API_BASE`

## Requirements
- Node.js 18+
- pnpm 9+ (or adapt the commands to npm/yarn)
- Optional: Docker Desktop (for running the bundled Conductor stack)

## Getting Started
1. Install dependencies  
   `pnpm install`

2. (Optional) Boot a local Conductor stack  
   ```
   cd backend
   docker compose up -d
   ```
   This starts Redis, Elasticsearch, and the Conductor standalone container listening on `http://localhost:8080`.

3. Configure environment (optional)  
   Create a `.env` file next to `package.json` if you need to target a different API host:
   ```
   VITE_API_BASE=https://your-conductor-host
   ```
   When unset, requests are made relative to the Vite dev server, which proxies `/api` to `http://localhost:8080`.

4. Run the app  
   `pnpm dev`  
   The UI is served at `http://localhost:5173`.

## Build & Preview
- Build production assets: `pnpm build` (output in `dist/`)
- Preview the built app locally: `pnpm preview`

## Project Highlights
- `src/App.vue`: Main workflow canvas, node orchestration, and API sync logic
- `src/components/NodeTypes/*`: Typed panels for Simple, Inline, and HTTP tasks
- `src/components/CodeWindow.vue`: JSON preview panel with copy/reset controls
- `backend/docker-compose.yaml`: Self-contained Conductor + Redis + Elasticsearch stack for local testing

## License
See `License.txt` for licensing details.
