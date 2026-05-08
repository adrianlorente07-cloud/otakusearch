import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getAnimeByGenre, popularGenres } from '@/lib/jikan'
import { GenreContent } from '@/components/genre-content'
import { Skeleton } from '@/components/ui/skeleton'

interface GenrePageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

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

async function getGenreData(genreId: number, page: number) {
  try {
    const results = await getAnimeByGenre(genreId, page, 24)
    return results
  } catch (error) {
    console.error('Error fetching genre data:', error)
    return { data: [], pagination: null }
  }
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-6 w-96 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const { id } = await params
  const { page: pageParam } = await searchParams
  
  const genreId = parseInt(id, 10)
  const page = parseInt(pageParam || '1', 10)
  
  if (isNaN(genreId)) {
    notFound()
  }

  const genre = popularGenres.find(g => g.mal_id === genreId)
  const genreName = genre?.name || 'Unknown'
  const genreNameEs = genreNamesEs[genreId] || genreName
  
  const results = await getGenreData(genreId, page)
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <GenreContent
        genreId={genreId}
        genreName={genreName}
        genreNameEs={genreNameEs}
        animes={results.data || []}
        pagination={results.pagination}
        currentPage={page}
      />
    </Suspense>
  )
}
