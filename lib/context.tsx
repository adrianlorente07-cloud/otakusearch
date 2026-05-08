'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Language, ListItem, UserList, Translations } from './types'
import { getTranslations } from './translations'

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  userList: UserList | null
  listItems: ListItem[]
  isListLoading: boolean
  shareCode: string | null
  addToList: (item: Omit<ListItem, 'id' | 'list_id' | 'added_at'>) => Promise<void>
  removeFromList: (malId: number) => Promise<void>
  updateListItem: (malId: number, updates: Partial<ListItem>) => Promise<void>
  isInList: (malId: number) => boolean
  getListItem: (malId: number) => ListItem | undefined
  refreshList: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')
  const [userList, setUserList] = useState<UserList | null>(null)
  const [listItems, setListItems] = useState<ListItem[]>([])
  const [isListLoading, setIsListLoading] = useState(true)
  const [shareCode, setShareCode] = useState<string | null>(null)
  
  const supabase = createClient()
  const t = getTranslations(language)

  // Initialize or load user list from localStorage + Supabase
  const initializeList = useCallback(async () => {
    setIsListLoading(true)
    
    try {
      // Check localStorage for existing share code
      let storedCode = localStorage.getItem('otaku_share_code')
      
      if (storedCode) {
        // Try to fetch existing list from Supabase
        const { data: existingList } = await supabase
          .from('user_lists')
          .select('*')
          .eq('share_code', storedCode)
          .single()
        
        if (existingList) {
          setUserList(existingList)
          setShareCode(storedCode)
          
          // Fetch list items
          const { data: items } = await supabase
            .from('list_items')
            .select('*')
            .eq('list_id', existingList.id)
            .order('added_at', { ascending: false })
          
          setListItems(items || [])
        } else {
          // Code exists in localStorage but not in DB, create new
          storedCode = null
        }
      }
      
      if (!storedCode) {
        // Create new list with new code
        const newCode = generateShareCode()
        
        const { data: newList, error } = await supabase
          .from('user_lists')
          .insert({ share_code: newCode })
          .select()
          .single()
        
        if (error) {
          console.error('Error creating list:', error)
          return
        }
        
        localStorage.setItem('otaku_share_code', newCode)
        setUserList(newList)
        setShareCode(newCode)
        setListItems([])
      }
    } catch (error) {
      console.error('Error initializing list:', error)
    } finally {
      setIsListLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    // Load language preference
    const storedLang = localStorage.getItem('otaku_language') as Language | null
    if (storedLang && (storedLang === 'es' || storedLang === 'en')) {
      setLanguage(storedLang)
    }
    
    initializeList()
  }, [initializeList])

  useEffect(() => {
    localStorage.setItem('otaku_language', language)
  }, [language])

  const addToList = async (item: Omit<ListItem, 'id' | 'list_id' | 'added_at'>) => {
    if (!userList) return
    
    const { data, error } = await supabase
      .from('list_items')
      .insert({
        list_id: userList.id,
        mal_id: item.mal_id,
        title: item.title,
        title_japanese: item.title_japanese,
        image_url: item.image_url,
        score: item.score,
        status: item.status || 'plan_to_watch',
        user_score: item.user_score,
        episodes_watched: item.episodes_watched || 0,
        total_episodes: item.total_episodes,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error adding to list:', error)
      return
    }
    
    setListItems(prev => [data, ...prev])
  }

  const removeFromList = async (malId: number) => {
    if (!userList) return
    
    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('list_id', userList.id)
      .eq('mal_id', malId)
    
    if (error) {
      console.error('Error removing from list:', error)
      return
    }
    
    setListItems(prev => prev.filter(item => item.mal_id !== malId))
  }

  const updateListItem = async (malId: number, updates: Partial<ListItem>) => {
    if (!userList) return
    
    const { data, error } = await supabase
      .from('list_items')
      .update(updates)
      .eq('list_id', userList.id)
      .eq('mal_id', malId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating list item:', error)
      return
    }
    
    setListItems(prev => prev.map(item => item.mal_id === malId ? data : item))
  }

  const isInList = (malId: number) => {
    return listItems.some(item => item.mal_id === malId)
  }

  const getListItem = (malId: number) => {
    return listItems.find(item => item.mal_id === malId)
  }

  const refreshList = async () => {
    if (!userList) return
    
    const { data: items } = await supabase
      .from('list_items')
      .select('*')
      .eq('list_id', userList.id)
      .order('added_at', { ascending: false })
    
    setListItems(items || [])
  }

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      userList,
      listItems,
      isListLoading,
      shareCode,
      addToList,
      removeFromList,
      updateListItem,
      isInList,
      getListItem,
      refreshList,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
