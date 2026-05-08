import { Suspense } from 'react'
import { searchAnime } from '@/lib/jikan'
import { SearchContent } from '@/components/search-content'
import { Skeleton } from '@/components/ui/skeleton'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

async function getSearchResults(query: string, page: number) {
  if (!query) return { data: [], pagination: null }
  
  try {
    const results = await searchAnime(query, page, 24)
    return results
  } catch (error) {
    console.error('Search error:', error)
    return { data: [], pagination: null }
  }
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-10 w-full max-w-xl mb-8" />
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const page = parseInt(params.page || '1', 10)
  
  const results = await getSearchResults(query, page)
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SearchContent
        query={query}
        results={results.data || []}
        pagination={results.pagination}
        currentPage={page}
      />
    </Suspense>
  )
}
