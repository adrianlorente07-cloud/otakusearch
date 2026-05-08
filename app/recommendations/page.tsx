'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Sparkles, RefreshCw, Star, Tv, Calendar, Plus, Check, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Anime } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Recommendation {
  anime: Anime
  matchScore: number
  reason: string
}

export default function RecommendationsPage() {
  const { t, language, listItems, isListLoading, addToList, isInList } = useApp()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    if (listItems.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listItems: listItems.slice(0, 10).map(item => ({
            title: item.title,
            score: item.user_score || item.score,
            status: item.status,
          })),
          language,
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch recommendations')

      const data = await response.json()
      
      // If API returned fallback flag or no recommendations, use Jikan
      if (data.fallback || !data.recommendations || data.recommendations.length === 0) {
        console.log('[v0] API fallback, using Jikan recommendations')
        await fetchJikanRecommendations()
      } else {
        setRecommendations(data.recommendations)
      }
    } catch (err) {
      console.error('[v0] Recommendations error:', err)
      setError(language === 'es' ? 'Error al obtener recomendaciones' : 'Error fetching recommendations')
      // Fallback to Jikan-based recommendations
      await fetchJikanRecommendations()
    } finally {
      setIsLoading(false)
    }
  }

  const fetchJikanRecommendations = async () => {
    try {
      // Get recommendations based on top-rated items in list
      const topItems = listItems
        .filter(item => item.user_score && item.user_score >= 7)
        .slice(0, 3)

      if (topItems.length === 0) return

      const allRecs: Recommendation[] = []

      for (const item of topItems) {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${item.mal_id}/recommendations`)
        if (response.ok) {
          const data = await response.json()
          const recs = (data.data || []).slice(0, 4).map((rec: { entry: Anime; votes: number }) => ({
            anime: rec.entry,
            matchScore: Math.min(95, 70 + Math.floor(rec.votes / 10)),
            reason: language === 'es' 
              ? `Porque te gusto ${item.title}` 
              : `Because you liked ${item.title}`,
          }))
          allRecs.push(...recs)
        }
        // Respect rate limit
        await new Promise(resolve => setTimeout(resolve, 400))
      }

      // Remove duplicates and items already in list
      const uniqueRecs = allRecs.filter((rec, index, self) => 
        index === self.findIndex(r => r.anime.mal_id === rec.anime.mal_id) &&
        !listItems.some(item => item.mal_id === rec.anime.mal_id)
      )

      setRecommendations(uniqueRecs.slice(0, 12))
    } catch (err) {
      console.error('Jikan recommendations error:', err)
    }
  }

  useEffect(() => {
    if (!isListLoading && listItems.length > 0) {
      fetchRecommendations()
    }
  }, [isListLoading, listItems.length])

  const handleAddToList = async (anime: Anime) => {
    await addToList({
      mal_id: anime.mal_id,
      title: anime.title,
      title_japanese: anime.title_japanese,
      image_url: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      score: anime.score,
      status: 'plan_to_watch',
      episodes_watched: 0,
      total_episodes: anime.episodes,
    })
  }

  if (isListLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          <span>{t.basedOnYourList}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{t.recommendationsTitle}</h1>
        <p className="text-muted-foreground">{t.recommendationsSubtitle}</p>
      </div>

      {listItems.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">
            {language === 'es' ? 'Tu lista esta vacia' : 'Your list is empty'}
          </p>
          <p className="text-muted-foreground">
            {language === 'es' 
              ? 'Agrega animes a tu lista para obtener recomendaciones personalizadas' 
              : 'Add anime to your list to get personalized recommendations'}
          </p>
        </div>
      ) : (
        <>
          {/* Refresh Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={fetchRecommendations}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {language === 'es' ? 'Actualizar recomendaciones' : 'Refresh recommendations'}
            </Button>
          </div>

          {error && (
            <p className="text-center text-amber-500 mb-8">{error}</p>
          )}

          {/* Recommendations Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(rec => (
                <RecommendationCard
                  key={rec.anime.mal_id}
                  recommendation={rec}
                  onAdd={() => handleAddToList(rec.anime)}
                  isInList={isInList(rec.anime.mal_id)}
                  language={language}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                {language === 'es' 
                  ? 'No se encontraron recomendaciones. Intenta agregar mas animes a tu lista.' 
                  : 'No recommendations found. Try adding more anime to your list.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function RecommendationCard({ 
  recommendation, 
  onAdd, 
  isInList, 
  language,
  t 
}: { 
  recommendation: Recommendation
  onAdd: () => void
  isInList: boolean
  language: string
  t: { matchPercentage: string; addToList: string }
}) {
  const { anime, matchScore, reason } = recommendation
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    setIsAdding(true)
    await onAdd()
    setIsAdding(false)
  }

  return (
    <div className="flex gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors">
      {/* Image */}
      <div className="relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '/placeholder.png'}
          alt={anime.title}
          fill
          className="object-cover"
        />
        {/* Match Score Badge */}
        <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
          {matchScore}%
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-semibold line-clamp-2 mb-1">{anime.title}</h3>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
          {anime.score && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              {anime.score}
            </span>
          )}
          {anime.episodes && (
            <span className="flex items-center gap-1">
              <Tv className="w-3 h-3" />
              {anime.episodes}
            </span>
          )}
          {anime.year && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {anime.year}
            </span>
          )}
        </div>

        <p className="text-xs text-primary mb-3 line-clamp-2">{reason}</p>

        <div className="mt-auto">
          <Button
            size="sm"
            variant={isInList ? 'outline' : 'default'}
            onClick={handleAdd}
            disabled={isInList || isAdding}
            className={cn('w-full gap-2', isInList && 'border-green-500 text-green-500')}
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isInList ? (
              <>
                <Check className="w-4 h-4" />
                {language === 'es' ? 'En tu lista' : 'In your list'}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {t.addToList}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
