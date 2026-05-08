export interface Anime {
  mal_id: number
  title: string
  title_english?: string
  title_japanese?: string
  images: {
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  synopsis?: string
  score?: number
  scored_by?: number
  rank?: number
  popularity?: number
  members?: number
  episodes?: number
  status?: string
  aired?: {
    from: string
    to: string
    string: string
  }
  season?: string
  year?: number
  studios?: { mal_id: number; name: string }[]
  genres?: { mal_id: number; name: string }[]
  themes?: { mal_id: number; name: string }[]
  demographics?: { mal_id: number; name: string }[]
  type?: string
  source?: string
  duration?: string
  rating?: string
  broadcast?: {
    day: string
    time: string
    timezone: string
    string: string
  }
  trailer?: {
    youtube_id: string
    url: string
    embed_url: string
  }
}

export interface JikanResponse<T> {
  data: T
  pagination?: {
    last_visible_page: number
    has_next_page: boolean
    current_page: number
    items: {
      count: number
      total: number
      per_page: number
    }
  }
}

export type ListStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold'

export interface ListItem {
  id: string
  list_id: string
  mal_id: number
  title: string
  title_japanese?: string
  image_url?: string
  score?: number
  status: ListStatus
  user_score?: number
  episodes_watched: number
  total_episodes?: number
  added_at: string
}

export interface UserList {
  id: string
  share_code: string
  created_at: string
  updated_at: string
  items?: ListItem[]
}

export interface Genre {
  mal_id: number
  name: string
  count: number
}

export type Language = 'es' | 'en'

export interface Translations {
  // Header
  search: string
  searchPlaceholder: string
  myList: string
  compare: string
  recommendations: string
  
  // Home
  heroTitle: string
  heroSubtitle: string
  topAiring: string
  thisSeason: string
  upcoming: string
  exploreByGenre: string
  viewAll: string
  
  // List statuses
  watching: string
  completed: string
  planToWatch: string
  dropped: string
  onHold: string
  
  // Actions
  addToList: string
  removeFromList: string
  episodes: string
  score: string
  members: string
  rank: string
  
  // Compare
  compareTitle: string
  compareSubtitle: string
  enterCode: string
  yourCode: string
  friendCode: string
  compareLists: string
  inCommon: string
  onlyYou: string
  onlyFriend: string
  
  // Recommendations
  recommendationsTitle: string
  recommendationsSubtitle: string
  basedOnYourList: string
  matchPercentage: string
  
  // Misc
  noResults: string
  loading: string
  error: string
  retry: string
  viewDetails: string
  unknown: string
}
