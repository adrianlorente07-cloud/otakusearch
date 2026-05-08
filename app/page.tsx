import { Suspense } from 'react'
import { getTopAnime, getSeasonNow, getSeasonUpcoming } from '@/lib/jikan'
import { HomeContent } from '@/components/home-content'
import { Skeleton } from '@/components/ui/skeleton'

async function getHomeData() {
  try {
    const [topAiring, thisSeason, upcoming] = await Promise.all([
      getTopAnime('airing', 1, 12),
      getSeasonNow(1, 12),
      getSeasonUpcoming(1, 12),
    ])
    
    return {
      topAiring: topAiring.data || [],
      thisSeason: thisSeason.data || [],
      upcoming: upcoming.data || [],
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return {
      topAiring: [],
      thisSeason: [],
      upcoming: [],
    }
  }
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="text-center py-16 space-y-4">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-[500px] mx-auto" />
        <Skeleton className="h-14 w-full max-w-xl mx-auto mt-8" />
      </div>
      
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage() {
  const data = await getHomeData()
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent {...data} />
    </Suspense>
  )
}
