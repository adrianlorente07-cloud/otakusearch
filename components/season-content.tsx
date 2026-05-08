'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Calendar, Trophy } from 'lucide-react'
import { useApp } from '@/lib/context'
import { AnimeGrid } from './anime-grid'
import { Button } from '@/components/ui/button'
import type { Anime, JikanResponse } from '@/lib/types'

interface SeasonContentProps {
  type: 'now' | 'upcoming' | 'top'
  animes: Anime[]
  pagination: JikanResponse<Anime[]>['pagination'] | null | undefined
  currentPage: number
  showRank?: boolean
}

const titles = {
  now: { es: 'Esta Temporada', en: 'This Season' },
  upcoming: { es: 'Proximos Estrenos', en: 'Upcoming' },
  top: { es: 'Top en Emision', en: 'Top Airing' },
}

const descriptions = {
  now: { es: 'Los animes que se estan emitiendo actualmente', en: 'Anime currently airing this season' },
  upcoming: { es: 'Los animes que se estrenaran proximamente', en: 'Anime coming soon' },
  top: { es: 'Los animes mejor puntuados en emision', en: 'Top rated airing anime' },
}

const icons = {
  now: Play,
  upcoming: Calendar,
  top: Trophy,
}

const urls = {
  now: '/season/now',
  upcoming: '/season/upcoming',
  top: '/top/airing',
}

export function SeasonContent({ type, animes, pagination, currentPage, showRank }: SeasonContentProps) {
  const { language } = useApp()
  const Icon = icons[type]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 gap-1">
            <ChevronLeft className="w-4 h-4" />
            {language === 'es' ? 'Volver' : 'Back'}
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{titles[type][language]}</h1>
        </div>
        <p className="text-muted-foreground">{descriptions[type][language]}</p>
      </div>

      {/* Grid */}
      <AnimeGrid animes={animes} showRank={showRank} />

      {/* Pagination */}
      {pagination && pagination.last_visible_page > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href={`${urls[type]}?page=${currentPage - 1}`}
            className={currentPage <= 1 ? 'pointer-events-none' : ''}
          >
            <Button variant="outline" disabled={currentPage <= 1}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              {language === 'es' ? 'Anterior' : 'Previous'}
            </Button>
          </Link>
          
          <span className="text-sm text-muted-foreground">
            {language === 'es' ? 'Pagina' : 'Page'} {currentPage} {language === 'es' ? 'de' : 'of'} {pagination.last_visible_page}
          </span>
          
          <Link
            href={`${urls[type]}?page=${currentPage + 1}`}
            className={!pagination.has_next_page ? 'pointer-events-none' : ''}
          >
            <Button variant="outline" disabled={!pagination.has_next_page}>
              {language === 'es' ? 'Siguiente' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
