export default function GenreFilter({genres, selected, onSelect, label}){
    return (
        <div className="genre-buttons" role="group" aria-label={label}>
            {genres.map((genre) => ( //making 1 button per genre 
                <button
                    key = {genre.slug}
                    type = "button"
                    className = {genre.slug === selected ? 'genre-btn active' : 'genre-btn'} //giving class if active
                    aria-pressed = {genre.slug === selected} //screen readers announce which one is on
                    onClick={() => onSelect(genre.slug)}
                    >
                        {genre.name}
                </button>
            ))}
        </div>
    )
}