import type { Anime, JikanResponse, Genre } from './types'

const BASE_URL = 'https://api.jikan.moe/v4'

// Rate limiting helper
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 350 // Jikan has rate limits

async function fetchWithRateLimit<T>(url: string): Promise<T> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  
  lastRequestTime = Date.now()
  
  const response = await fetch(url, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  
  if (!response.ok) {
    throw new Error(`Jikan API error: ${response.status}`)
  }
  
  return response.json()
}

export async function searchAnime(query: string, page = 1, limit = 24): Promise<JikanResponse<Anime[]>> {
  const url = `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sfw=true`
  return fetchWithRateLimit(url)
}

export async function getAnimeById(id: number): Promise<JikanResponse<Anime>> {
  const url = `${BASE_URL}/anime/${id}`
  return fetchWithRateLimit(url)
}

export async function getTopAnime(filter: 'airing' | 'upcoming' | 'bypopularity' | 'favorite' = 'airing', page = 1, limit = 12): Promise<JikanResponse<Anime[]>> {
  const url = `${BASE_URL}/top/anime?filter=${filter}&page=${page}&limit=${limit}&sfw=true`
  return fetchWithRateLimit(url)
}

export async function getSeasonNow(page = 1, limit = 12): Promise<JikanResponse<Anime[]>> {
  const url = `${BASE_URL}/seasons/now?page=${page}&limit=${limit}&sfw=true`
  return fetchWithRateLimit(url)
}

export async function getSeasonUpcoming(page = 1, limit = 12): Promise<JikanResponse<Anime[]>> {
  const url = `${BASE_URL}/seasons/upcoming?page=${page}&limit=${limit}&sfw=true`
  return fetchWithRateLimit(url)
}

export async function getAnimeByGenre(genreId: number, page = 1, limit = 24): Promise<JikanResponse<Anime[]>> {
  const url = `${BASE_URL}/anime?genres=${genreId}&page=${page}&limit=${limit}&sfw=true&order_by=score&sort=desc`
  return fetchWithRateLimit(url)
}

export async function getGenres(): Promise<JikanResponse<Genre[]>> {
  const url = `${BASE_URL}/genres/anime`
  return fetchWithRateLimit(url)
}

export async function getAnimeRecommendations(animeId: number): Promise<JikanResponse<{ entry: Anime }[]>> {
  const url = `${BASE_URL}/anime/${animeId}/recommendations`
  return fetchWithRateLimit(url)
}

// Popular genres for quick access
export const popularGenres = [
  { mal_id: 1, name: 'Action' },
  { mal_id: 2, name: 'Adventure' },
  { mal_id: 4, name: 'Comedy' },
  { mal_id: 8, name: 'Drama' },
  { mal_id: 10, name: 'Fantasy' },
  { mal_id: 14, name: 'Horror' },
  { mal_id: 7, name: 'Mystery' },
  { mal_id: 22, name: 'Romance' },
  { mal_id: 24, name: 'Sci-Fi' },
  { mal_id: 36, name: 'Slice of Life' },
  { mal_id: 30, name: 'Sports' },
  { mal_id: 37, name: 'Supernatural' },
]
