const movies = document.querySelectorAll(".movie-card");
const buttons = document.querySelectorAll(".genre-btn");

function filterMovies(genre) {
    for (let movie of movies) {
        if (genre == "all" || movie.dataset.genre.includes(genre)) {
            movie.style.display = "block";
        } 
        else {
            movie.style.display = "none";
        }
    }
    for (let button of buttons) {
        button.classList.remove("active");
    }

    for (let button of buttons) {
        if (button.dataset.genre == genre) {
            button.classList.add("active");
        }
    }
}

for (let button of buttons) {
    button.onclick = function() {
        filterMovies(button.dataset.genre);
    };
}
