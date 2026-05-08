'use client'

import { AnimeCard } from './anime-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Anime } from '@/lib/types'

interface AnimeGridProps {
  animes: Anime[]
  isLoading?: boolean
  showRank?: boolean
}

export function AnimeGrid({ animes, isLoading, showRank }: AnimeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="anime-card">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (animes.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {animes.map((anime, index) => (
        <AnimeCard
          key={anime.mal_id}
          anime={anime}
          showRank={showRank}
          rank={showRank ? index + 1 : undefined}
        />
      ))}
    </div>
  )
}
