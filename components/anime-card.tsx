'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Play, Plus, Check, Calendar, Tv } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { AnimeModal } from './anime-modal'
import type { Anime } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AnimeCardProps {
  anime: Anime
  showRank?: boolean
  rank?: number
}

export function AnimeCard({ anime, showRank, rank }: AnimeCardProps) {
  const { t, addToList, removeFromList, isInList } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const inList = isInList(anime.mal_id)

  const handleListToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    
    try {
      if (inList) {
        await removeFromList(anime.mal_id)
      } else {
        await addToList({
          mal_id: anime.mal_id,
          title: anime.title,
          title_japanese: anime.title_japanese,
          image_url: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
          score: anime.score,
          status: 'plan_to_watch',
          episodes_watched: 0,
          total_episodes: anime.episodes,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        className="anime-card group cursor-pointer relative"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Rank Badge */}
        {showRank && rank !== undefined && (
          <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground font-bold text-sm px-2 py-1 rounded-md">
            #{rank}
          </div>
        )}
        
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Actions */}
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant={inList ? 'default' : 'secondary'}
              className={cn(
                'w-8 h-8',
                inList && 'bg-primary hover:bg-primary/90'
              )}
              onClick={handleListToggle}
              disabled={isLoading}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Airing Badge */}
          {anime.status === 'Currently Airing' && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-md">
              <Play className="w-3 h-3" />
              <span>Airing</span>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {anime.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {anime.score && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {anime.score.toFixed(1)}
                </span>
              )}
              {anime.episodes && (
                <span className="flex items-center gap-1">
                  <Tv className="w-3 h-3" />
                  {anime.episodes}
                </span>
              )}
            </div>
            
            {anime.year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {anime.year}
              </span>
            )}
          </div>
        </div>
      </div>

      <AnimeModal
        anime={anime}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
