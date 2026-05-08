'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Users, ArrowRight, Check, User, UserPlus, Star, Loader2 } from 'lucide-react'
import { useApp } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { ListItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function ComparePage() {
  const { t, language, listItems, shareCode } = useApp()
  const [friendCode, setFriendCode] = useState('')
  const [friendItems, setFriendItems] = useState<ListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compared, setCompared] = useState(false)

  const supabase = createClient()

  const handleCompare = async () => {
    if (!friendCode.trim() || friendCode.trim().toUpperCase() === shareCode) {
      setError(language === 'es' ? 'Ingresa un codigo valido diferente al tuyo' : 'Enter a valid code different from yours')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Find friend's list
      const { data: friendList, error: listError } = await supabase
        .from('user_lists')
        .select('id')
        .eq('share_code', friendCode.trim().toUpperCase())
        .single()

      if (listError || !friendList) {
        setError(language === 'es' ? 'Codigo no encontrado' : 'Code not found')
        setIsLoading(false)
        return
      }

      // Get friend's items
      const { data: items, error: itemsError } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', friendList.id)

      if (itemsError) {
        setError(language === 'es' ? 'Error al cargar la lista' : 'Error loading list')
        setIsLoading(false)
        return
      }

      setFriendItems(items || [])
      setCompared(true)
    } catch {
      setError(language === 'es' ? 'Error de conexion' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate comparison stats
  const myMalIds = new Set(listItems.map(item => item.mal_id))
  const friendMalIds = new Set(friendItems.map(item => item.mal_id))
  
  const inCommon = listItems.filter(item => friendMalIds.has(item.mal_id))
  const onlyMine = listItems.filter(item => !friendMalIds.has(item.mal_id))
  const onlyFriend = friendItems.filter(item => !myMalIds.has(item.mal_id))

  const compatibilityScore = compared && (myMalIds.size + friendMalIds.size > 0)
    ? Math.round((inCommon.length * 2) / (myMalIds.size + friendMalIds.size) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <Users className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold mb-2">{t.compareTitle}</h1>
        <p className="text-muted-foreground">{t.compareSubtitle}</p>
      </div>

      {/* Compare Form */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-card border border-border rounded-2xl">
          {/* Your Code */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-muted-foreground mb-1">{t.yourCode}</p>
            <p className="font-mono font-bold text-2xl text-primary">{shareCode}</p>
          </div>

          <ArrowRight className="w-6 h-6 text-muted-foreground hidden sm:block" />

          {/* Friend Code Input */}
          <div className="flex-1 w-full">
            <p className="text-sm text-muted-foreground mb-1">{t.friendCode}</p>
            <div className="flex gap-2">
              <Input
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX"
                maxLength={8}
                className="font-mono text-lg tracking-wider uppercase"
              />
              <Button onClick={handleCompare} disabled={isLoading || !friendCode.trim()}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.compareLists}
              </Button>
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {compared && (
        <>
          {/* Compatibility Score */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-4 border-primary mb-4">
              <span className="text-4xl font-bold text-primary">{compatibilityScore}%</span>
            </div>
            <p className="text-lg text-muted-foreground">
              {language === 'es' ? 'Compatibilidad' : 'Compatibility'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-card border border-green-500/30 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold">{t.inCommon}</h3>
                <Badge className="ml-auto bg-green-500">{inCommon.length}</Badge>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {inCommon.slice(0, 10).map(item => (
                  <CompareItem key={item.mal_id} item={item} />
                ))}
                {inCommon.length > 10 && (
                  <p className="text-sm text-muted-foreground">+{inCommon.length - 10} {language === 'es' ? 'mas' : 'more'}</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-card border border-primary/30 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">{t.onlyYou}</h3>
                <Badge className="ml-auto bg-primary">{onlyMine.length}</Badge>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {onlyMine.slice(0, 10).map(item => (
                  <CompareItem key={item.mal_id} item={item} />
                ))}
                {onlyMine.length > 10 && (
                  <p className="text-sm text-muted-foreground">+{onlyMine.length - 10} {language === 'es' ? 'mas' : 'more'}</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-card border border-accent/30 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <UserPlus className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold">{t.onlyFriend}</h3>
                <Badge className="ml-auto" style={{ backgroundColor: 'var(--accent)' }}>{onlyFriend.length}</Badge>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {onlyFriend.slice(0, 10).map(item => (
                  <CompareItem key={item.mal_id} item={item} />
                ))}
                {onlyFriend.length > 10 && (
                  <p className="text-sm text-muted-foreground">+{onlyFriend.length - 10} {language === 'es' ? 'mas' : 'more'}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function CompareItem({ item }: { item: ListItem }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
      <div className="relative w-8 h-10 rounded overflow-hidden flex-shrink-0">
        <Image
          src={item.image_url || '/placeholder.png'}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.score && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            {item.score}
          </p>
        )}
      </div>
    </div>
  )
}
