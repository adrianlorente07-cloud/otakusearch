'use client'

import { useState } from 'react'
import Image from 'next/image'
import { List, Play, Check, Clock, Pause, X, Star, Copy, Share2, Tv } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ListStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusTabs: { value: ListStatus | 'all'; icon: React.ComponentType<{ className?: string }>; labelEs: string; labelEn: string }[] = [
  { value: 'all', icon: List, labelEs: 'Todos', labelEn: 'All' },
  { value: 'watching', icon: Play, labelEs: 'Viendo', labelEn: 'Watching' },
  { value: 'completed', icon: Check, labelEs: 'Completado', labelEn: 'Completed' },
  { value: 'plan_to_watch', icon: Clock, labelEs: 'Planeado', labelEn: 'Plan to Watch' },
  { value: 'on_hold', icon: Pause, labelEs: 'En pausa', labelEn: 'On Hold' },
  { value: 'dropped', icon: X, labelEs: 'Abandonado', labelEn: 'Dropped' },
]

export default function MyListPage() {
  const { t, language, listItems, isListLoading, shareCode, removeFromList, updateListItem } = useApp()
  const [activeTab, setActiveTab] = useState<ListStatus | 'all'>('all')
  const [copied, setCopied] = useState(false)

  const filteredItems = activeTab === 'all' 
    ? listItems 
    : listItems.filter(item => item.status === activeTab)

  const handleCopyCode = async () => {
    if (shareCode) {
      await navigator.clipboard.writeText(shareCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleStatusChange = async (malId: number, newStatus: ListStatus) => {
    await updateListItem(malId, { status: newStatus })
  }

  const handleScoreChange = async (malId: number, score: number) => {
    await updateListItem(malId, { user_score: score })
  }

  if (isListLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.myList}</h1>
          <p className="text-muted-foreground">
            {listItems.length} {language === 'es' ? 'animes en tu lista' : 'anime in your list'}
          </p>
        </div>

        {/* Share Code */}
        {shareCode && (
          <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
            <Share2 className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{t.yourCode}</p>
              <p className="font-mono font-bold text-lg text-primary">{shareCode}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="ml-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {statusTabs.map(tab => {
          const count = tab.value === 'all' 
            ? listItems.length 
            : listItems.filter(item => item.status === tab.value).length

          return (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'gap-2',
                activeTab === tab.value && 'bg-primary text-primary-foreground'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {language === 'es' ? tab.labelEs : tab.labelEn}
              <Badge variant="secondary" className="ml-1 text-xs">
                {count}
              </Badge>
            </Button>
          )
        })}
      </div>

      {/* List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <List className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">
            {language === 'es' ? 'Tu lista esta vacia' : 'Your list is empty'}
          </p>
          <p className="text-muted-foreground">
            {language === 'es' 
              ? 'Busca anime y agregalo a tu lista' 
              : 'Search for anime and add them to your list'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
            >
              {/* Image */}
              <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image_url || '/placeholder.png'}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.title}</h3>
                {item.title_japanese && (
                  <p className="text-sm text-muted-foreground truncate">{item.title_japanese}</p>
                )}
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  {item.score && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {item.score}
                    </span>
                  )}
                  {item.total_episodes && (
                    <span className="flex items-center gap-1">
                      <Tv className="w-3 h-3" />
                      {item.episodes_watched}/{item.total_episodes}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Dropdown */}
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(item.mal_id, e.target.value as ListStatus)}
                className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusTabs.filter(t => t.value !== 'all').map(tab => (
                  <option key={tab.value} value={tab.value}>
                    {language === 'es' ? tab.labelEs : tab.labelEn}
                  </option>
                ))}
              </select>

              {/* Score */}
              <select
                value={item.user_score || ''}
                onChange={(e) => handleScoreChange(item.mal_id, parseInt(e.target.value))}
                className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-20"
              >
                <option value="">{language === 'es' ? 'Punt.' : 'Score'}</option>
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(score => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>

              {/* Remove */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromList(item.mal_id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
