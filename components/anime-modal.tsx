'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Star, Users, Trophy, Tv, Calendar, Clock, Plus, Check, Play, ExternalLink } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Anime, ListStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AnimeModalProps {
  anime: Anime
  isOpen: boolean
  onClose: () => void
}

const statusOptions: { value: ListStatus; labelEs: string; labelEn: string }[] = [
  { value: 'watching', labelEs: 'Viendo', labelEn: 'Watching' },
  { value: 'completed', labelEs: 'Completado', labelEn: 'Completed' },
  { value: 'plan_to_watch', labelEs: 'Planeado', labelEn: 'Plan to Watch' },
  { value: 'on_hold', labelEs: 'En pausa', labelEn: 'On Hold' },
  { value: 'dropped', labelEs: 'Abandonado', labelEn: 'Dropped' },
]

export function AnimeModal({ anime, isOpen, onClose }: AnimeModalProps) {
  const { t, language, addToList, removeFromList, updateListItem, isInList, getListItem } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  
  const listItem = getListItem(anime.mal_id)
  const inList = isInList(anime.mal_id)

  if (!isOpen) return null

  const handleAddToList = async (status: ListStatus) => {
    setIsLoading(true)
    try {
      if (inList) {
        await updateListItem(anime.mal_id, { status })
      } else {
        await addToList({
          mal_id: anime.mal_id,
          title: anime.title,
          title_japanese: anime.title_japanese,
          image_url: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
          score: anime.score,
          status,
          episodes_watched: status === 'completed' ? anime.episodes || 0 : 0,
          total_episodes: anime.episodes,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setIsLoading(true)
    try {
      await removeFromList(anime.mal_id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-72 aspect-[3/4] md:aspect-auto md:h-auto flex-shrink-0">
            <Image
              src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
              alt={anime.title}
              fill
              className="object-cover"
            />
            {anime.trailer?.youtube_id && (
              <a
                href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Trailer</span>
              </a>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-1">{anime.title}</h2>
            {anime.title_japanese && (
              <p className="text-muted-foreground text-sm mb-4">{anime.title_japanese}</p>
            )}
            
            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-4">
              {anime.score && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{anime.score.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({anime.scored_by?.toLocaleString()} votes)
                  </span>
                </div>
              )}
              {anime.rank && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-bold">#{anime.rank}</span>
                </div>
              )}
              {anime.members && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  <span>{anime.members.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              {anime.episodes && (
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-muted-foreground" />
                  <span>{anime.episodes} {t.episodes}</span>
                </div>
              )}
              {anime.aired?.string && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{anime.aired.string}</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{anime.duration}</span>
                </div>
              )}
              {anime.status && (
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    anime.status === 'Currently Airing' ? 'bg-green-500' : 'bg-muted-foreground'
                  )} />
                  <span>{anime.status}</span>
                </div>
              )}
            </div>
            
            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {anime.genres.map(genre => (
                  <Badge key={genre.mal_id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-medium">Studios:</span>{' '}
                {anime.studios.map(s => s.name).join(', ')}
              </p>
            )}
            
            {/* Synopsis */}
            {anime.synopsis && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Synopsis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {anime.synopsis}
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="space-y-3">
              <p className="text-sm font-medium">{t.addToList}:</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={listItem?.status === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAddToList(option.value)}
                    disabled={isLoading}
                    className={cn(
                      listItem?.status === option.value && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {listItem?.status === option.value && <Check className="w-3 h-3 mr-1" />}
                    {language === 'es' ? option.labelEs : option.labelEn}
                  </Button>
                ))}
              </div>
              
              {inList && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="mt-2"
                >
                  {t.removeFromList}
                </Button>
              )}
              
              {/* MAL Link */}
              <a
                href={`https://myanimelist.net/anime/${anime.mal_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on MyAnimeList
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
