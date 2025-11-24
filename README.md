# TechnoHub Frontend

The project now runs on a Vite + React toolchain using plain JavaScript/JSX (no TypeScript). Static assets still live under `public/` and are served automatically by Vite.

## Available Scripts

Inside the project directory run:

- `npm run dev` – start the Vite dev server on [http://localhost:5173](http://localhost:5173) with hot module replacement.
- `npm run build` – generate the production build inside `dist/`.
- `npm run preview` – preview the production build locally.

Tests have not been configured yet; update the `test` script if you add Vitest or another runner.

## Additional Notes

- The entry file is `src/main.jsx`, loaded from the root `index.html`.
- Environment-specific logic should use `import.meta.env` if needed.
- You can continue to add global styles inside `src/index.scss` or import feature styles where appropriate.
