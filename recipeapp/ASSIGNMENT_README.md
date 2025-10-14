# Recipe App — LMS Assignment Notes

This file contains a short, submission-ready summary for the LMS describing what was implemented and how to run the project.

Project summary
- Small React + Vite recipe app built for the LMS assignment.
- Features implemented: list recipes, search, view details, add, edit, delete. Data persisted to localStorage.
- Minimal unit tests (Vitest + Testing Library) validate basic behaviors.

How to run
1. Open PowerShell and change to the project folder:

```powershell
cd C:\GitRepo\FS-GenAI\recipeapp
```

2. Install dependencies and start the dev server:

```powershell
npm install
npm run dev
```

3. Open the local URL printed by Vite (e.g., http://localhost:5175).

### Using the mock server (optional)
The project includes a small Express mock server for CRUD operations at `server/index.js`.

Start the mock server in a separate terminal:

```powershell
cd C:\GitRepo\FS-GenAI\recipeapp
npm run start:server
```

Then start the Vite dev server with the environment flag so the app uses the mock server:

```powershell
cd C:\GitRepo\FS-GenAI\recipeapp
set VITE_USE_SERVER=true; npm run dev
```

When running in server mode the app will call `http://localhost:4000/recipes` for data operations. If the server is unreachable, the app falls back to localStorage.

How to run tests

```powershell
npm test
```

Notes on development
- I used GitHub Copilot in VS Code to help generate component scaffolding and sample data, then refined manually.
- The app is intentionally small and self-contained for LMS evaluation. For production, move persistence to a proper backend.

Optional next steps (if required by the evaluator)
- Add images/thumbnails for recipes.
- Add server-sync using `json-server` or a small Express backend.
- Add E2E tests (Cypress) to verify end-user flows.

Files submitted
- All edited and new files under `src/` plus this README and existing project files.

If you want, I can prepare a short commit/PR and push to a GitHub repo for submission.
