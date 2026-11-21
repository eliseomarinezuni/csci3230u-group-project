# AI-USAGE.md

This file logs every time an AI tool contributed to submitted code in this project.
Add an entry before you commit the AI-assisted code. (Using AI only to learn -
explanations, error messages, design talk - does not need an entry.) See the course AI
policy. Reminder: **milestones 1-2 (weeks 3, 6) must be AI-free** - this file should
be empty until the third milestone.

Also drop a marker where the code lives: `// AI-assisted - see AI-USAGE.md #<n>`.

---

## Entry template (copy for each use)

### #N - <short title>
- **Date:** YYYY-MM-DD
- **Member:** <your name>
- **Tool / model:** <e.g. free-tier assistant> (free models only)
- **Files:** `src/...`, `src/...`
- **Prompt (verbatim):**

  ```
  <paste the exact prompt you gave the AI>
  ```

- **What it produced & what I changed:** <1–3 sentences: did you keep it as-is, edit it,
  rewrite parts? why is it correct?>

---

## Log

### #N - TMDB movie search integration

- **Date:** 2026-11-21
- **Member:** Eliseo Marinez
- **Tool / model:** ChatGPT (GPT-6)
- **Files:** `.gitignore`, `README.md`, `netlify.toml`, `netlify/functions/tmdb-search.mjs`, `react-app/src/data/tmdb.js`, `react-app/src/data/searchMovies.js`, `react-app/src/pages/Search.jsx`, `react-app/src/components/MovieCard.jsx`
- **Prompt (verbatim):**
  ```text
  Give me the code that will allow me to integrate TMDB into Notflix, we will start by testing it using the move search functionality.
  ```

- **What it produced & what I changed:** I asked ChatGPT to help integrate TMDB into Notflix and test it through movie search. It produced code that connects our existing search to TMDB through a Netlify Function. I kept the implementation, added my token to a local `.env` file, and verified that movie search returned live TMDB results.

---
