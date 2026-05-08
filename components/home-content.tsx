'use client'

import Link from 'next/link'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useApp } from '@/lib/context'
import { SearchBar } from './search-bar'
import { AnimeGrid } from './anime-grid'
import { GenreSelector } from './genre-selector'
import { Button } from '@/components/ui/button'
import type { Anime } from '@/lib/types'

interface HomeContentProps {
  topAiring: Anime[]
  thisSeason: Anime[]
  upcoming: Anime[]
}

export function HomeContent({ topAiring, thisSeason, upcoming }: HomeContentProps) {
  const { t } = useApp()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          <span>25,000+ animes disponibles</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
          <span className="gradient-text">{t.heroTitle}</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
          {t.heroSubtitle}
        </p>
        
        <div className="max-w-xl mx-auto">
          <SearchBar large autoFocus />
        </div>
      </section>

      {/* Top Airing Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t.topAiring}</h2>
          <Link href="/top/airing">
            <Button variant="ghost" size="sm" className="gap-1">
              {t.viewAll}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <AnimeGrid animes={topAiring} showRank />
      </section>

      {/* Genre Selector */}
      <GenreSelector />

      {/* This Season Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t.thisSeason}</h2>
          <Link href="/season/now">
            <Button variant="ghost" size="sm" className="gap-1">
              {t.viewAll}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <AnimeGrid animes={thisSeason} />
      </section>

      {/* Upcoming Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t.upcoming}</h2>
          <Link href="/season/upcoming">
            <Button variant="ghost" size="sm" className="gap-1">
              {t.viewAll}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <AnimeGrid animes={upcoming} />
      </section>
    </div>
  )
}
