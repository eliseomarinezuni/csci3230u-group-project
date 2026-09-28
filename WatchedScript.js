const watchedMovies = [
    {
        id: 1,
        title: "Inception",
        rating: 8.8,
        genre: "Sci-Fi / Thriller",
        watchedOn: "September 12, 2026",
        image: "images/Inception.jpeg",
    },
    {
        id: 3,
        title: "The Matrix",
        rating: 8.7,
        genre: "Sci-Fi / Action",
        watchedOn: "September 5, 2026",
        image: "images/Matrix.jpeg",
    },
    {
        id: 5,
        title: "Spider-Man: Into the Spider-Verse",
        rating: 8.4,
        genre: "Animation / Action",
        watchedOn: "August 28, 2026",
        image: "images/IntoTheSpiderverse.jpeg",
    },
    {
        id: 6,
        title: "Mad Max: Fury Road",
        rating: 8.1,
        genre: "Action / Adventure",
        watchedOn: "August 19, 2026",
        image: "images/MadMax.jpeg",
    },
];

function setupImageLoader(img, placeholder) {
    function handleLoad() {
        placeholder.style.display = "none";
        img.style.display = "block";
    }

    function handleError() {
        img.style.display = "none";
        placeholder.style.display = "flex";
    }

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    if (img.complete) {
        if (img.naturalWidth > 0) {
            handleLoad();
        } else {
            handleError();
        }
    }
}

function renderWatchedCard(movie) {
    const card = document.createElement("article");
    card.className = "movie-card";
    card.setAttribute("data-movie-id", movie.id);

    card.innerHTML = `
        <div class="movie-card__image-wrapper">
            <img
                class="movie-card__image"
                src="${movie.image}"
                alt="Poster for ${movie.title}"
            >
            <div class="movie-card__placeholder" aria-hidden="true">${movie.title}</div>
            <span class="movie-card__badge">✓ Watched</span>
        </div>

        <div class="movie-card__body">
            <h2 class="movie-card__title">${movie.title}</h2>
            <div class="movie-card__meta">
                <span class="movie-card__rating" aria-label="Rating ${movie.rating} out of 10">★ ${movie.rating}</span>
                <span>${movie.genre}</span>
            </div>
            <p class="movie-card__watched-date">Watched on ${movie.watchedOn}</p>
        </div>
    `;

    const img = card.querySelector(".movie-card__image");
    const placeholder = card.querySelector(".movie-card__placeholder");
    setupImageLoader(img, placeholder);

    return card;
}

function renderWatchedMovies() {
    const container = document.getElementById("watched-movies");
    if (!container) return;

    container.innerHTML = "";

    watchedMovies.forEach((movie) => {
        container.appendChild(renderWatchedCard(movie));
    });
}

document.addEventListener("DOMContentLoaded", renderWatchedMovies);
