// ============================================
// Movie Data
// ============================================
const movies = [
    {
        id: 1,
        title: "Inception",
        rating: 8.8,
        genre: "Sci-Fi / Thriller",
        description:
            "A skilled thief who steals secrets through shared dreams is given an impossible task: planting an idea inside the mind of a powerful businessman. As the layers of dreams become increasingly dangerous, he must confront the past he has tried to escape.",
        image: "images/Inception.jpeg",
    },
    {
        id: 2,
        title: "Interstellar",
        rating: 8.7,
        genre: "Sci-Fi / Adventure",
        description:
            "As Earth becomes increasingly uninhabitable, a group of astronauts travels through a mysterious wormhole in search of a new home for humanity. Their journey takes them beyond the limits of space, time, and human understanding.",
        image: "images/Interstellar.jpeg",
    },
    {
        id: 3,
        title: "The Matrix",
        rating: 8.7,
        genre: "Sci-Fi / Action",
        description:
            "A computer hacker discovers that the world he knows is an elaborate simulation controlled by powerful artificial intelligence. Guided by mysterious rebels, he must uncover the truth and decide whether he is willing to fight for humanity's freedom.",
        image: "images/Matrix.jpeg",
    },
    {
        id: 4,
        title: "Blade Runner 2049",
        rating: 8.0,
        genre: "Sci-Fi / Mystery",
        description:
            "A young blade runner uncovers a long-buried secret that threatens to destabilize society. His investigation leads him to a former blade runner who has been missing for decades, forcing both men to confront questions about identity, memory, and what it means to be human.",
        image: "images/Bladerunner.jpeg",
    },
    {
        id: 5,
        title: "Spider-Man: Into the Spider-Verse",
        rating: 8.4,
        genre: "Animation / Action",
        description:
            "Teenager Miles Morales becomes Spider-Man and discovers that he is not the only Spider-Man in existence. When multiple dimensions collide, Miles must work alongside heroes from other realities to stop a threat capable of destroying them all.",
        image: "images/IntoTheSpiderverse.jpeg",
    },
    {
        id: 6,
        title: "Mad Max: Fury Road",
        rating: 8.1,
        genre: "Action / Adventure",
        description:
            "In a brutal post-apocalyptic wasteland, Max becomes caught up in a daring escape led by a determined warrior and a group of women fleeing a tyrannical ruler. Together, they race across the desert while fighting to survive and reach freedom.",
        image: "images/MadMax.jpeg",
    },
];

// ============================================
// LocalStorage Helpers
// ============================================
const FAVORITES_KEY = "notflixFavorites";

/** Retrieve the array of favourite movie IDs from localStorage. */
function getFavorites() {
    try {
        const data = localStorage.getItem(FAVORITES_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        // If storage is corrupted, start fresh
        return [];
    }
}

/** Save the favourites array to localStorage. */
function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/** Toggle a movie's favourite state and return the updated array. */
function toggleFavorite(movieId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(movieId);

    if (index === -1) {
        favorites.push(movieId);
    } else {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);
    return favorites;
}

// ============================================
// Rendering
// ============================================

/**
 * Loads image reliably, supports .jpeg / .jpg fallback,
 * and hides the placeholder once the image is successfully loaded.
 */
function setupImageLoader(img, placeholder, src) {
    function handleLoad() {
        if (placeholder) {
            placeholder.style.display = "none";
        }
        img.style.display = "block";
    }

    function handleError() {
        // Fallback: If .jpeg failed to load, try .jpg (or vice versa)
        if (src.endsWith(".jpeg") && !img.dataset.retried) {
            img.dataset.retried = "true";
            img.src = src.replace(/\.jpeg$/i, ".jpg");
            return;
        }
        if (src.endsWith(".jpg") && !img.dataset.retried) {
            img.dataset.retried = "true";
            img.src = src.replace(/\.jpg$/i, ".jpeg");
            return;
        }

        // Both failed, hide image and show the placeholder fallback
        img.style.display = "none";
        if (placeholder) {
            placeholder.style.display = "flex";
        }
    }

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    // If image was loaded immediately from cache
    if (img.complete) {
        if (img.naturalWidth > 0) {
            handleLoad();
        } else {
            handleError();
        }
    }
}

/**
 * Build the HTML string for a single movie card.
 * The description and favourite button are hidden until
 * the user expands the card.
 */
function renderMovieCard(movie, isFavourite) {
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
        </div>

        <div class="movie-card__body">
            <h2 class="movie-card__title">${movie.title}</h2>
            <div class="movie-card__meta">
                <span class="movie-card__rating" aria-label="Rating ${movie.rating} out of 10">★ ${movie.rating}</span>
                <span>${movie.genre}</span>
            </div>
        </div>

        <button
            class="movie-card__toggle"
            aria-expanded="false"
            aria-controls="details-${movie.id}"
        >
            <span class="movie-card__toggle-icon" aria-hidden="true">▼</span>
            <span>More info</span>
        </button>

        <div
            class="movie-card__details"
            id="details-${movie.id}"
            role="region"
            aria-label="Details for ${movie.title}"
        >
            <p class="movie-card__description">${movie.description}</p>
            <button
                class="btn btn-favourite ${isFavourite ? "is-favourite" : ""}"
                data-movie-id="${movie.id}"
                aria-pressed="${isFavourite}"
            >
                ${isFavourite ? "✓ Favourite" : "+ Add to Favourite"}
            </button>
        </div>
    `;

    const img = card.querySelector(".movie-card__image");
    const placeholder = card.querySelector(".movie-card__placeholder");
    setupImageLoader(img, placeholder, movie.image);

    return card;
}

/**
 * Render all movie cards into the #recommended-movies container.
 * Skips gracefully if the container doesn't exist on the current page.
 */
function renderMovies() {
    const container = document.getElementById("recommended-movies");
    if (!container) return;

    const favorites = getFavorites();
    container.innerHTML = "";

    movies.forEach((movie) => {
        const isFav = favorites.includes(movie.id);
        const card = renderMovieCard(movie, isFav);
        container.appendChild(card);
    });
}

// ============================================
// Event Handling
// ============================================

/**
 * Handle expand/collapse toggle for a movie card.
 */
function handleToggle(button) {
    const card = button.closest(".movie-card");
    const details = card.querySelector(".movie-card__details");
    const isOpen = details.classList.contains("is-open");

    if (isOpen) {
        details.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
    } else {
        details.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
    }
}

/**
 * Handle the favourite toggle button.
 * Updates localStorage and refreshes the button UI.
 */
function handleFavouriteClick(button) {
    const movieId = Number(button.getAttribute("data-movie-id"));
    const favorites = toggleFavorite(movieId);
    const isFav = favorites.includes(movieId);

    // Update this button
    button.classList.toggle("is-favourite", isFav);
    button.setAttribute("aria-pressed", String(isFav));
    button.textContent = isFav ? "✓ Favourite" : "+ Add to Favourite";
}

/**
 * Attach click listeners using event delegation on the movie grid.
 */
function attachEventListeners() {
    const container = document.getElementById("recommended-movies");
    if (!container) return;

    container.addEventListener("click", (event) => {
        // Expand/collapse toggle
        const toggleBtn = event.target.closest(".movie-card__toggle");
        if (toggleBtn) {
            handleToggle(toggleBtn);
            return;
        }

        // Favourite button
        const favBtn = event.target.closest(".btn-favourite");
        if (favBtn) {
            handleFavouriteClick(favBtn);
        }
    });
}

// ============================================
// Initialisation
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    renderMovies();
    attachEventListeners();
});
