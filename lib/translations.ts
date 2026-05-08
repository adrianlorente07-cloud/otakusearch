import type { Language, Translations } from './types'

export const translations: Record<Language, Translations> = {
  es: {
    // Header
    search: 'Buscar',
    searchPlaceholder: 'Buscar anime...',
    myList: 'Mi Lista',
    compare: 'Comparar',
    recommendations: 'Recomendaciones',
    
    // Home
    heroTitle: 'Descubre tu proximo anime favorito',
    heroSubtitle: 'Explora mas de 25,000 animes, crea tu lista personal y comparte con amigos',
    topAiring: 'Top en Emision',
    thisSeason: 'Esta Temporada',
    upcoming: 'Proximos Estrenos',
    exploreByGenre: 'Explorar por Genero',
    viewAll: 'Ver todo',
    
    // List statuses
    watching: 'Viendo',
    completed: 'Completado',
    planToWatch: 'Planeado',
    dropped: 'Abandonado',
    onHold: 'En pausa',
    
    // Actions
    addToList: 'Agregar a mi lista',
    removeFromList: 'Quitar de mi lista',
    episodes: 'Episodios',
    score: 'Puntuacion',
    members: 'Miembros',
    rank: 'Ranking',
    
    // Compare
    compareTitle: 'Comparar Listas',
    compareSubtitle: 'Compara tu lista con la de tus amigos',
    enterCode: 'Ingresa el codigo de tu amigo',
    yourCode: 'Tu codigo',
    friendCode: 'Codigo de amigo',
    compareLists: 'Comparar listas',
    inCommon: 'En comun',
    onlyYou: 'Solo tu',
    onlyFriend: 'Solo tu amigo',
    
    // Recommendations
    recommendationsTitle: 'Recomendaciones IA',
    recommendationsSubtitle: 'Basadas en tu lista personal',
    basedOnYourList: 'Basado en tu lista',
    matchPercentage: 'Afinidad',
    
    // Misc
    noResults: 'No se encontraron resultados',
    loading: 'Cargando...',
    error: 'Ocurrio un error',
    retry: 'Reintentar',
    viewDetails: 'Ver detalles',
    unknown: 'Desconocido',
  },
  en: {
    // Header
    search: 'Search',
    searchPlaceholder: 'Search anime...',
    myList: 'My List',
    compare: 'Compare',
    recommendations: 'Recommendations',
    
    // Home
    heroTitle: 'Discover your next favorite anime',
    heroSubtitle: 'Explore over 25,000 anime, create your personal list and share with friends',
    topAiring: 'Top Airing',
    thisSeason: 'This Season',
    upcoming: 'Upcoming',
    exploreByGenre: 'Explore by Genre',
    viewAll: 'View all',
    
    // List statuses
    watching: 'Watching',
    completed: 'Completed',
    planToWatch: 'Plan to Watch',
    dropped: 'Dropped',
    onHold: 'On Hold',
    
    // Actions
    addToList: 'Add to my list',
    removeFromList: 'Remove from list',
    episodes: 'Episodes',
    score: 'Score',
    members: 'Members',
    rank: 'Rank',
    
    // Compare
    compareTitle: 'Compare Lists',
    compareSubtitle: 'Compare your list with your friends',
    enterCode: 'Enter your friend\'s code',
    yourCode: 'Your code',
    friendCode: 'Friend code',
    compareLists: 'Compare lists',
    inCommon: 'In common',
    onlyYou: 'Only you',
    onlyFriend: 'Only friend',
    
    // Recommendations
    recommendationsTitle: 'AI Recommendations',
    recommendationsSubtitle: 'Based on your personal list',
    basedOnYourList: 'Based on your list',
    matchPercentage: 'Match',
    
    // Misc
    noResults: 'No results found',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    viewDetails: 'View details',
    unknown: 'Unknown',
  }
}

export function getTranslations(lang: Language): Translations {
  return translations[lang]
}
