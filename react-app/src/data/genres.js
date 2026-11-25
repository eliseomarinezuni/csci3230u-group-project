//AI-assisted - see AI-USAGE.md #6
//Data for the Genre page: the genre lists, the sort options, and the functions
//that load titles from our Netlify functions.

export const mediaTypes = [
  { slug: 'movie', name: 'Movies', plural: 'movies' },
  { slug: 'tv', name: 'TV Shows', plural: 'TV shows' },
]

//TMDB has a different genre list for movies and for TV.
//id is TMDB's genre number. "All" has no id, which means every genre.
export const genresByType = {
  movie: [
    { slug: 'all', id: null, name: 'All' },
    { slug: 'action', id: 28, name: 'Action' },
    { slug: 'adventure', id: 12, name: 'Adventure' },
    { slug: 'animation', id: 16, name: 'Animation' },
    { slug: 'comedy', id: 35, name: 'Comedy' },
    { slug: 'crime', id: 80, name: 'Crime' },
    { slug: 'documentary', id: 99, name: 'Documentary' },
    { slug: 'drama', id: 18, name: 'Drama' },
    { slug: 'family', id: 10751, name: 'Family' },
    { slug: 'fantasy', id: 14, name: 'Fantasy' },
    { slug: 'history', id: 36, name: 'History' },
    { slug: 'horror', id: 27, name: 'Horror' },
    { slug: 'music', id: 10402, name: 'Music' },
    { slug: 'mystery', id: 9648, name: 'Mystery' },
    { slug: 'romance', id: 10749, name: 'Romance' },
    { slug: 'sci-fi', id: 878, name: 'Sci-Fi' },
    { slug: 'thriller', id: 53, name: 'Thriller' },
    { slug: 'war', id: 10752, name: 'War' },
    { slug: 'western', id: 37, name: 'Western' },
  ],
  tv: [
    { slug: 'all', id: null, name: 'All' },
    { slug: 'action-adventure', id: 10759, name: 'Action & Adventure' },
    { slug: 'animation', id: 16, name: 'Animation' },
    { slug: 'comedy', id: 35, name: 'Comedy' },
    { slug: 'crime', id: 80, name: 'Crime' },
    { slug: 'documentary', id: 99, name: 'Documentary' },
    { slug: 'drama', id: 18, name: 'Drama' },
    { slug: 'family', id: 10751, name: 'Family' },
    { slug: 'kids', id: 10762, name: 'Kids' },
    { slug: 'mystery', id: 9648, name: 'Mystery' },
    { slug: 'reality', id: 10764, name: 'Reality' },
    { slug: 'sci-fi-fantasy', id: 10765, name: 'Sci-Fi & Fantasy' },
    { slug: 'war-politics', id: 10768, name: 'War & Politics' },
    { slug: 'western', id: 37, name: 'Western' },
  ],
}

//value is sent to /api/genre, label is shown in the dropdown.
export const sortOptions = [
  { value: 'top-rated', label: 'Highest rated' },
  { value: 'popular', label: 'Most popular' },
  { value: 'newest', label: 'Newest' },
]

export function findMediaType(slug) {
  return mediaTypes.find((type) => type.slug === slug)
}

export function findGenre(type, slug) {
  if (!findMediaType(type)) return undefined
  return genresByType[type].find((genre) => genre.slug === slug)
}

export function isSortOption(value) {
  return sortOptions.some((option) => option.value === value)
}

//[35, 18] -> ['Comedy', 'Drama'], using the movie or TV list
export function genreNames(type, ids) {
  const names = []
  for (const id of ids ?? []) {
    const genre = genresByType[type].find((genre) => genre.id === id)
    if (genre) names.push(genre.name)
  }
  return names
}

//Adds the next page to the list, skipping any title already shown.
//(TMDB pages can overlap, and two cards with the same key would confuse React.)
export function mergeTitles(current, next) {
  const shownIds = current.map((title) => title.id)
  const newTitles = next.filter((title) => !shownIds.includes(title.id))
  return [...current, ...newTitles]
}

//Fetches one of our API addresses and returns the JSON, or throws an Error with a message.
async function getJson(url, signal) {
  const response = await fetch(url, { signal })

  //npm run dev can't run Netlify function so sends it back to webpage instead of JSON
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Start the site with Netlify Dev (npx netlify-cli dev) to load this data.')
  }

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

export async function getGenreTitles({ type, genreId, sort, page }, signal) {
  let url = `/api/genre?type=${type}&sort=${sort}&page=${page}`
  if (genreId) url += `&genre=${genreId}`

  const data = await getJson(url, signal)
  // Add readable genre names, e.g. "Comedy / Drama" on each card
  data.results = data.results.map((title) => ({ ...title, genres: genreNames(type, title.genreIds) }))
  return data
}

export async function getTvShow(id, signal) {
  const data = await getJson(`/api/tv/${id}`, signal)
  return { ...data.show, genres: genreNames('tv', data.show.genreIds) }
}