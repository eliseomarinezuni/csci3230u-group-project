
export default function GenreFilter({genres, selected, onSelect}){
    return (
        <div className="genre-buttons">
            {genres.map((genre) => ( //making 1 button per genre 
                <button
                    key = {genre}
                    className = {genre === selected ? 'genre-btn active' : 'genre-btn'} //giving class if active
                    onClick={() => onSelect(genre)}
                    >
                        {genre}
                </button>
            ))}
        </div>
    )
}