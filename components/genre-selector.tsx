'use client'

import Link from 'next/link'
import { Swords, Compass, Laugh, Theater, Wand2, Ghost, HelpCircle, Heart, Rocket, Coffee, Medal, Sparkles } from 'lucide-react'
import { useApp } from '@/lib/context'
import { popularGenres } from '@/lib/jikan'

const genreIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Swords,      // Action
  2: Compass,     // Adventure
  4: Laugh,       // Comedy
  8: Theater,     // Drama
  10: Wand2,      // Fantasy
  14: Ghost,      // Horror
  7: HelpCircle,  // Mystery
  22: Heart,      // Romance
  24: Rocket,     // Sci-Fi
  36: Coffee,     // Slice of Life
  30: Medal,      // Sports
  37: Sparkles,   // Supernatural
}

const genreColors: Record<number, string> = {
  1: 'from-red-500/20 to-orange-500/20 border-red-500/30',
  2: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  4: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
  8: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  10: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
  14: 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
  7: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30',
  22: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  24: 'from-sky-500/20 to-blue-500/20 border-sky-500/30',
  36: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
  30: 'from-lime-500/20 to-green-500/20 border-lime-500/30',
  37: 'from-violet-500/20 to-purple-500/20 border-violet-500/30',
}

export function GenreSelector() {
  const { t, language } = useApp()

  const genreNamesEs: Record<number, string> = {
    1: 'Accion',
    2: 'Aventura',
    4: 'Comedia',
    8: 'Drama',
    10: 'Fantasia',
    14: 'Terror',
    7: 'Misterio',
    22: 'Romance',
    24: 'Ciencia Ficcion',
    36: 'Vida Cotidiana',
    30: 'Deportes',
    37: 'Sobrenatural',
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">{t.exploreByGenre}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {popularGenres.map(genre => {
          const Icon = genreIcons[genre.mal_id] || Sparkles
          const colorClass = genreColors[genre.mal_id] || 'from-primary/20 to-accent/20 border-primary/30'
          
          return (
            <Link
              key={genre.mal_id}
              href={`/genre/${genre.mal_id}`}
              className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${colorClass} border hover:scale-105 transition-transform duration-200`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">
                {language === 'es' ? genreNamesEs[genre.mal_id] || genre.name : genre.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
