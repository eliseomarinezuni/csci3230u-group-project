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

### #1 - TMDB movie search integration

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

### #2 - Movie details pop-up and Watched button

- **Date:** 2026-11-21
- **Member:** Eliseo Marinez
- **Tool / model:** ChatGPT (Codex, GPT-6)
- **Files:** `react-app/src/App.jsx`, `react-app/src/components/MovieCard.jsx`, `react-app/src/components/MovieDetails.jsx`, `react-app/src/components/WatchedButton.jsx`, `react-app/src/components/WatchedMoviesContext.jsx`, `react-app/src/data/movies.js`, `react-app/src/pages/Watched.jsx`, `react-app/src/styles/MovieDetails.css`, `react-app/src/styles/Watchedstyles.css`, `react-app/src/styles/root.css`
- **Prompt (verbatim):**

  ```text
  Give me the code to implement a movie details pop up when clicking on a movie. There should also be a watched button that is implemented, when the watch button is pressed it is added to the watched section. If someone wants to remove a movie from watched provide a removal confirmation pop-up. Make sure the click to add watched button is not covering the poster.
  ```

- **What it produced & what I changed:** The AI added a shared movie details pop-up and a Watched button that saves the list in the browser. I asked it to move the button below the poster and add a confirmation before removing a movie, then kept the revised code. Local testing confirmed that the pop-up works across all four movie pages and that changes to the Watched list persist after refreshing.

### #3 - Notflix accounts, movie lists and recommendations

- **Date:** 2026-11-23
- **Member:** Andy Lopez
- **Tool / model:** ChatGPT (Codex)
- **Files:** `README.md`, `netlify.toml`, `package.json`, `netlify/functions/account.mjs`, `netlify/functions/recommendations.mjs`, `netlify/functions/tmdb-search.mjs`, `netlify/lib/accounts.mjs`, `netlify/lib/recommendations.mjs`, `netlify/lib/tmdb.mjs`, `react-app/src/App.jsx`, `react-app/src/components/FavouriteButton.jsx`, `react-app/src/components/Header.jsx`, `react-app/src/components/MovieCard.jsx`, `react-app/src/components/MovieDetails.jsx`, `react-app/src/components/WatchedButton.jsx`, `react-app/src/components/WatchedMoviesContext.jsx`, `react-app/src/data/searchMovies.js`, `react-app/src/pages/Account.jsx`, `react-app/src/pages/Favourites.jsx`, `react-app/src/pages/Recommended.jsx`, `react-app/src/pages/Watched.jsx`, `react-app/src/styles/Account.css`, `test/account-components.test.mjs`, `test/account.test.mjs`, `test/recommendations.test.mjs`
- **Prompt (verbatim):**

  ```text
  here is the working criteria for this: Criteria	Ratings	Points
  Functionality (Per member)
  view longer description

  Complete
  Team's work: The full baseline works: search, filter and sort; a routed detail view (useParams); multiple routes; persisted user state (custom hook or Context + localStorage); at least one controlled form. Every member's slice is integrated and working. Member's share: The member's own slice is complete, working, a fair share of the app, and authored by them in the history. They can explain it, including any AI-assisted parts, which are logged under their name in AI-USAGE.md.
  7 pts

  Mostly complete
  Team's work: One baseline feature missing or broken, or one slice incomplete. Member's share: Their slice works but is noticeably smaller than their teammates', the history is thin, or the explanation is shaky.
  5.5 pts

  Partial
  Team's work: Several baseline features missing, but the core app works. Member's share: Their slice is incomplete, or they can explain only part of it.
  3.5 pts

  Minimal
  Team's work: Little beyond the M2 app. Member's share: A token contribution.
  1.5 pts

  Missing
  Team's work: Doesn't run. Member's share: No slice of their own, or they cannot explain code credited to them.
  0 pts
  /7 pts
  Live web service (Team)
  view longer description

  Complete
  Real fetch from the live API with loading and error states, res.ok checked, an AbortController cancelling stale requests, and the API's shape mapped to the app's own at the boundary.
  2 pts

  Mostly complete
  Live data with one item missing (usually cancellation, or the mapping).
  1.5 pts

  Partial
  Live data, but no loading/error handling.
  1 pt

  Minimal
  Attempted, but the app still runs mainly on mock data.
  0.5 pts

  Missing
  Mock data only.
  0 pts
  /2 pts
  Quality (Per member)
  view longer description

  Complete
  Team's work: Accessible (Lighthouse/axe run, obvious issues fixed, keyboard-usable); responsive; automated tests for some logic and components that pass with npm test. Member's share: Their slice is accessible and responsive, and has tests they wrote.
  3 pts

  Mostly complete
  Team's work: One area weak (e.g. only a trivial test, or a few accessibility flags left). Member's share: Their slice is weak in one area (e.g. no tests of their own).
  2.5 pts

  Partial
  Team's work: Two areas weak, or no tests at all. Member's share: Their slice is weak in one area (e.g. no tests of their own).
  1.5 pts

  Minimal
  Team's work: Nothing to assess.
  0 pts
  /3 pts
  Deployed (Team)
  view longer description

  Complete
  The public URL is in README.md, loads the live app, and deep links survive a refresh (the SPA redirect works).
  1 pts

  Partial
  Deployed, but deep links 404 or the deployment is out of date.
  0.5 pts

  Missing
  Not deployed, or the URL doesn't work.
  0 pts
  /1 pts
  Presentation (Individual)
  view longer description

  Clear
  Demos their own slice from the deployed URL, clearly.
  1 pts

  Minimal
  A token part, unclear, or demoed from localhost.
  0.5 pts

  Absent
  Did not present (without an accommodation).
  0 pts
  /1 pts
   make the changes we have no agreed upon using netlify and verify all these categories are met as well, first focus implementation, then validate, if it is not up to the rubrics standard do not change anyhing just notify me
  ```

- **What it produced & what I changed:** Codex added the React account forms, Netlify Blobs account and session storage, per-user Watched and Favourites, TMDB recommendations, and automated tests. This entry records the generated work for team review.

### #4 - Limit recommendations to watched history

- **Date:** 2026-11-23
- **Member:** Andy Lopez
- **Tool / model:** ChatGPT (Codex)
- **Files:** `README.md`, `netlify/functions/account.mjs`, `netlify/lib/accounts.mjs`, `netlify/lib/recommendations.mjs`, `react-app/src/App.jsx`, `react-app/src/components/Header.jsx`, `react-app/src/components/MovieCard.jsx`, `react-app/src/components/MovieDetails.jsx`, `react-app/src/components/WatchedMoviesContext.jsx`, `react-app/src/components/FavouriteButton.jsx` (removed), `react-app/src/pages/Favourites.jsx` (removed), `react-app/src/pages/Recommended.jsx`, `react-app/src/styles/Account.css`, `test/account.test.mjs`, `test/recommendations.test.mjs`
- **Prompt (verbatim):**

  ```text
  undo the recommended for the favourites and the favourites page, i was not supposed to do that and just make the recommended algorithm only base the recommendations off of watched and ratings, not favourites
  ```

- **What it produced & what I changed:** Codex removed the Favourites feature added in entry #3 and restored the pre-existing navigation placeholder. It changed recommendations and account updates to use Watched only and updated the tests for the revised behavior.


### #5 - Shareable movie detail URLs

- **Date:** 2026-11-24
- **Member:** Eliseo Marinez
- **Tool / model:** ChatGPT (Codex, GPT-6)
- **Files:** `netlify.toml`, `netlify/functions/tmdb-movie.mjs`, `package.json`, `package-lock.json`, `react-app/src/App.jsx`, `react-app/src/main.jsx`, `react-app/src/components/Header.jsx`, `react-app/src/components/MovieCard.jsx`, `react-app/src/components/MovieDetails.jsx`, `react-app/src/components/SearchBar.jsx`, `react-app/src/components/WatchedMoviesContext.jsx`, `react-app/src/data/searchMovies.js`, `react-app/src/data/tmdb.js`, `react-app/src/pages/Account.jsx`, `react-app/src/pages/Home.jsx`, `react-app/src/pages/MoviePage.jsx`, `react-app/src/pages/Watched.jsx`, `react-app/src/styles/MovieDetails.css`, `test/account-components.test.mjs`, `test/movie-details.test.mjs`
- **Prompt (verbatim):**

  ```text
  ### Generate the code to give every movie its own URL. Right now, clicking a movie opens your details pop-up, but the URL stays the same. The rubric requires a movie detail view with a URL like `/movies/550`.
  ```

- **What it produced & what I changed:** The AI added shareable movie URLs using React Router and a Netlify Function that fetches details by TMDB ID. It reused the existing pop-up for card clicks, added a standalone view for direct links, and configured a Netlify fallback for refreshes. I pulled the latest team changes before implementation and kept the generated code as-is. All eight automated tests passed, and direct links and refreshes were tested locally with mocked TMDB data.

### #6 - Genre Page 
- **Date:** 2026-11-24
- **Member:** Julia Pajaro 
- **Tool / model:** Claude 
- **Files:** `netlify.toml`, `netlify/lib/tmdb.mjs`, `netlify/functions/tmdb-genre.mjs` (new), `netlify/functions/tmdb-tv.mjs` (new), `react-app/src/App.jsx`, `react-app/src/pages/Genre.jsx`, `react-app/src/pages/TvPage.jsx` (new), `react-app/src/components/GenreFilter.jsx`, `react-app/src/components/GenreResults.jsx` (new), `react-app/src/components/MovieCard.jsx`, `react-app/src/components/MovieDetails.jsx`, `react-app/src/data/genres.js` (new), `react-app/src/styles/Genre.css`, `test/genre.test.mjs` (new)

-  **Prompt (verbatim):**
  ```text
 Give me the code to implement TMDB into the genre page and help me make a filter button where the user can choose to look through movies or tv shows (+ copied and pasted the rubric and criteria)
  ```

- **What it produced & what I changed:** 
  The AI replaced the genre page's hardcoded data with information from TMBD. The AI also helped me improve the filter options by adding a seperate button for movies/tv shows and a 'sort by' option. The AI also added a local storage option which I did not add, everything else was added.  

---