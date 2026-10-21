# React setup

Run these commands from the repository root in PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. The React app currently displays a setup placeholder.

To create and preview a production build:

```powershell
npm.cmd run build
npm.cmd run preview
```

The build is written to `dist/`. Use Node.js 22.12 or newer, or Node.js 20.19 or newer within the Node 20 release line.

## Files

| Path | Purpose |
| --- | --- |
| `vite.config.js` | Points Vite at the separate React app |
| `react-app/index.html` | HTML entry point for React |
| `react-app/src/main.jsx` | Mounts React into the page |
| `react-app/src/App.jsx` | Starting app component |
| `react-app/src/components/` | Place future UI components here |
| `react-app/src/data/` | Place future local mock data here |
| `react-app/public/prototype/` | Original HTML pages, CSS, and images, preserved together |

The original HTML, CSS, and images have moved together into `react-app/public/prototype/` without content changes. With Vite running, open `/prototype/` at the printed local URL to view the original site. You can also open `react-app/public/prototype/index.html` directly. Vite includes the prototype in the production build. Project documentation remains at the repository root. The React setup does not yet rebuild that prototype or implement the M2 interactive features.

When moving the UI into React, place components in `src/components/` and import styles from a component or `main.jsx`. The preserved posters are available at paths such as `/prototype/images/Inception.jpeg` when running through Vite.
