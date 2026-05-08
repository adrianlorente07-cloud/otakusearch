'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  large?: boolean
  autoFocus?: boolean
}

export function SearchBar({ large, autoFocus }: SearchBarProps) {
  const { t } = useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setIsSearching(true)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className={`pl-10 pr-20 ${large ? 'h-14 text-lg' : 'h-10'} bg-secondary border-border focus:border-primary`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-7 w-7"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            type="submit"
            size={large ? 'default' : 'sm'}
            disabled={!query.trim() || isSearching}
            className={large ? 'h-10' : 'h-7'}
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t.search
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
