# CSCI 3230U Group Project
## Team Information
**Team Name:** Notflix

**Netlify Domain** https://csci3230u-group-project.netlify.app/

**Team Members:** 
| Name | Role/Interest |
| ---- | ------------- |
| Eliseo | Back-end development | 
| Zach |  Full-stack development |
| Andy |  API Integration |
| Julia | Testing / QA |
| Dave | Back-end development |

## Project Topic
Our project will be a movie discovery web application that allows users to search for movies and explore movie information.

The application will use movie data such as:
- Movie titles
- Posters
- Descriptions
- Release dates
- Ratings
- Genres
- Cast information

Users will be able to search for movies and browse or filter movies based on different categories such as genre.

## How to Run

To host the site on your local machine, follow these steps:

1. Open a terminal and clone the repository to a directory of your choosing.
```bash
git clone https://github.com/eliseomarinezuni/csci3230u-group-project
```

2. Navigate inside the directory, and install dependencies.
```bash
cd csci3230u-group-project # Or if you gave it a separate name, replace "csci3230u-group-project" with that name.
npm install
```

3. Run the project.
```bash
npm run dev
```

## Data Source(s)

### Live TMDB movie search

Netlify runs the movie search function at `/api/movies/search?q=Inception`. Set
`TMDB_READ_TOKEN` to the TMDB API Read Access Token in the Netlify Functions scope
for each deploy context that needs search. Create a new deploy after changing it.

Pages can import the shared helper without handling credentials:

```js
import { searchTmdbMovies } from '../data/tmdb.js' 

const { movies } = await searchTmdbMovies('Inception')
const { movies: nolan, director } = await searchTmdbMovies('', {
  filters: { director: 'Christopher Nolan', yearFrom: '2005', minRating: '8', sort: 'rating' },
})
```

Each result includes `id`, `title`, `description`, `releaseDate`, `poster`, `rating`,
and `genreIds`. Release dates, posters, and ratings can be `null`.

#### Search filters

The title is optional when at least one filter is set. All filters are optional:

| Parameter | Example | Meaning |
| --------- | ------- | ------- |
| `q` | `q=batman` | Title to search for |
| `director` | `director=greta+gerwig` | Only movies this person directed |
| `yearFrom`, `yearTo` | `yearFrom=1990&yearTo=1999` | Release year range (inclusive) |
| `minRating` | `minRating=7.5` | TMDB rating of at least this; any decimal from 0 to 10 |
| `genre` | `genre=878` | TMDB movie genre ID |
| `sort` | `sort=rating` | `relevance` (default), `rating` (highest first), `lowest-rated`, `newest`, or `oldest` |

The Search page keeps the same parameters in its own URL (for example
`/search?q=batman&yearFrom=2000&sort=rating`), so filtered searches can be shared and
survive a refresh. A director search also returns `director: { id, name }`, or
`director: null` if no one matched.

To test the function locally, run `npx netlify-cli dev` from the project root and use
the URL it prints. Use a linked Netlify project with the variable available to local
development, or set `TMDB_READ_TOKEN` in a local `.env` file at the project root.
`npm run dev` runs the React app on its own.

### Accounts and recommendations

Run `npx netlify-cli dev` from the project root to use sign-up, login, and movie
lists locally. The account function uses Netlify Blobs for private account and
session records. The deployed site uses site-wide stores, and Netlify Dev uses
local storage for Blobs. Recommendations use the same server-side
`TMDB_READ_TOKEN` as search.

Create an account with a unique username and a password. New accounts start with
an empty Watched list. Recommended uses the most common genres in that list.
Guests and accounts with an empty Watched list see overall top-rated titles.
Results are sorted by TMDB rating and require at least 500 votes per title.

We plan to use The Movie Database (TMDB) API as our main data source.

TMDB provides information about movies and television shows, including:

- Movie details
- Movie posters and images
- Genres
- Ratings
- Release dates
- Popular and trending movies
- Cast and crew
- Movie search

API Documentation:
https://developer.themoviedb.org/

## Tentative Features

Possible features for the project include:

- Search for movies by title
- Browse popular or trending movies
- Filter movies by genre
- View detailed information about a movie
- Display movie posters, ratings, and release dates
- View cast information
- Save favourite movies
- Recommended section based on previously watched movie. 

The exact features may change as the project requirements and development progress.

## Project Repository

This repository will contain the source code and documentation for our CSCI 3230U group project.

We will use GitHub Issues and GitHub Projects to organize tasks, track progress, and collaborate as a team.

Current Milestone
M2 - React Foundation
