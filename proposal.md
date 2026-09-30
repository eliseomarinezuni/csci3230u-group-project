# Notflix — Project Proposal

## Topic

Notflix is a movie discovery web application for users who want an easy way to find and explore movies. Users will be able to search for movies, browse popular titles, filter by genre, view movie details, and save movies they are interested in.

## Data Source

We will use **The Movie Database (TMDB) API**.

API: https://developer.themoviedb.org/

Example response:

```json
{
  "id": 550,
  "title": "Fight Club",
  "overview": "A depressed man suffering from insomnia...",
  "poster_path": "/poster.jpg",
  "release_date": "1999-10-15",
  "vote_average": 8.4,
  "genre_ids": [18]
}
```

Fields we will use:

- `id`
- `title`
- `overview`
- `poster_path`
- `release_date`
- `vote_average`
- `genre_ids`

## Comparators

- **IMDb** — Provides detailed movie information and ratings. Notflix will focus on a simpler movie discovery experience.
- **Letterboxd** — Focuses heavily on reviews and social features. Notflix will focus more on browsing and discovering movies.
- **JustWatch** — Focuses on finding where movies can be streamed. Notflix will instead focus on movie information, favourites, and discovery.

## Scaled Feature Plan

### Baseline Features

- Display movies using TMDB data
- Search for movies
- Filter and sort movies
- Movie detail pages
- Save user data
- Responsive interface
- Basic testing

### Vertical Slices

| Member | Feature |
| --- | --- |
| Eliseo | Movie details and cast |
| Zach | Movie search |
| Andy | Genre filtering and sorting |
| Julia | Movie ratings/reviews and testing |
| Hayden | Favourite movies |

## Proposed Wireframes

### Home / Browse Page

```text
+--------------------------------------------------+
| NOTFLIX                       Home | Favourites  |
+--------------------------------------------------+

        [ Search for a movie... ] [ Search ]

     Genre: [ All ▼ ]     Sort: [ Popular ▼ ]

+-----------+   +-----------+   +-----------+
|  POSTER   |   |  POSTER   |   |  POSTER   |
+-----------+   +-----------+   +-----------+
| Movie     |   | Movie     |   | Movie     |
| Rating    |   | Rating    |   | Rating    |
+-----------+   +-----------+   +-----------+
```

### Movie Details Page

```text
+--------------------------------------------------+
| NOTFLIX                       Home | Favourites  |
+--------------------------------------------------+

+-----------+      Movie Title
|           |
|  POSTER   |      Rating: 8.4
|           |      Release Date: 2025
+-----------+      Genre: Action

                   Movie description goes here.

                   [ Add to Favourites ]

----------------------------------------------------

Cast

[ Actor ]    [ Actor ]    [ Actor ]
```
