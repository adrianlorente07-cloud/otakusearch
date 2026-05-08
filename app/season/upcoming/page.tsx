import { Suspense } from 'react'
import { getSeasonUpcoming } from '@/lib/jikan'
import { SeasonContent } from '@/components/season-content'
import { Skeleton } from '@/components/ui/skeleton'

interface SeasonUpcomingPageProps {
  searchParams: Promise<{ page?: string }>
}

async function getSeasonData(page: number) {
  try {
    const results = await getSeasonUpcoming(page, 24)
    return results
  } catch (error) {
    console.error('Error fetching season data:', error)
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

export default async function SeasonUpcomingPage({ searchParams }: SeasonUpcomingPageProps) {
  const { page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1', 10)
  
  const results = await getSeasonData(page)
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SeasonContent
        type="upcoming"
        animes={results.data || []}
        pagination={results.pagination}
        currentPage={page}
      />
    </Suspense>
  )
}
