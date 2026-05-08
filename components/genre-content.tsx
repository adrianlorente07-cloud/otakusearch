'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '@/lib/context'
import { AnimeGrid } from './anime-grid'
import { Button } from '@/components/ui/button'
import type { Anime, JikanResponse } from '@/lib/types'

interface GenreContentProps {
  genreId: number
  genreName: string
  genreNameEs: string
  animes: Anime[]
  pagination: JikanResponse<Anime[]>['pagination'] | null | undefined
  currentPage: number
}

export function GenreContent({ genreId, genreName, genreNameEs, animes, pagination, currentPage }: GenreContentProps) {
  const { language } = useApp()

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
        <h1 className="text-3xl font-bold">{language === 'es' ? genreNameEs : genreName}</h1>
        <p className="text-muted-foreground">
          {language === 'es' 
            ? `Explora los mejores animes de ${genreNameEs.toLowerCase()}` 
            : `Explore the best ${genreName.toLowerCase()} anime`}
        </p>
      </div>

      {/* Grid */}
      <AnimeGrid animes={animes} />

      {/* Pagination */}
      {pagination && pagination.last_visible_page > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href={`/genre/${genreId}?page=${currentPage - 1}`}
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
            href={`/genre/${genreId}?page=${currentPage + 1}`}
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
