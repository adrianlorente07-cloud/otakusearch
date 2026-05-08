'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import { useApp } from '@/lib/context'
import { SearchBar } from './search-bar'
import { AnimeGrid } from './anime-grid'
import { Button } from '@/components/ui/button'
import type { Anime, JikanResponse } from '@/lib/types'

interface SearchContentProps {
  query: string
  results: Anime[]
  pagination: JikanResponse<Anime[]>['pagination'] | null | undefined
  currentPage: number
}

export function SearchContent({ query, results, pagination, currentPage }: SearchContentProps) {
  const { t } = useApp()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="max-w-xl mb-8">
        <SearchBar autoFocus />
      </div>

      {/* Results */}
      {query ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {results.length > 0 ? (
                <>
                  {pagination?.items?.total?.toLocaleString() || results.length} {t.language === 'es' ? 'resultados para' : 'results for'}{' '}
                  <span className="text-primary">&quot;{query}&quot;</span>
                </>
              ) : (
                <>
                  {t.noResults}: <span className="text-primary">&quot;{query}&quot;</span>
                </>
              )}
            </h1>
          </div>

          {results.length > 0 ? (
            <>
              <AnimeGrid animes={results} />

              {/* Pagination */}
              {pagination && pagination.last_visible_page > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                    className={currentPage <= 1 ? 'pointer-events-none' : ''}
                  >
                    <Button
                      variant="outline"
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      {t.language === 'es' ? 'Anterior' : 'Previous'}
                    </Button>
                  </Link>
                  
                  <span className="text-sm text-muted-foreground">
                    {t.language === 'es' ? 'Pagina' : 'Page'} {currentPage} {t.language === 'es' ? 'de' : 'of'} {pagination.last_visible_page}
                  </span>
                  
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                    className={!pagination.has_next_page ? 'pointer-events-none' : ''}
                  >
                    <Button
                      variant="outline"
                      disabled={!pagination.has_next_page}
                    >
                      {t.language === 'es' ? 'Siguiente' : 'Next'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <SearchX className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t.language === 'es' 
                  ? 'Intenta con otros terminos de busqueda' 
                  : 'Try different search terms'}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {t.language === 'es' 
              ? 'Escribe algo para buscar anime...' 
              : 'Type something to search for anime...'}
          </p>
        </div>
      )}
    </div>
  )
}
