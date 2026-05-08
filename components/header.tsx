'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, List, Users, Sparkles, Globe, Menu, X } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Header() {
  const { language, setLanguage, t, shareCode, listItems } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: t.search, icon: Search },
    { href: '/my-list', label: t.myList, icon: List, badge: listItems.length },
    { href: '/compare', label: t.compare, icon: Users },
    { href: '/recommendations', label: t.recommendations, icon: Sparkles },
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">O</span>
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:block">OtakuSearch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2',
                    pathname === item.href && 'bg-primary/20 text-primary'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Share Code */}
            {shareCode && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
                <span className="text-xs text-muted-foreground">{language === 'es' ? 'Tu codigo:' : 'Your code:'}</span>
                <span className="font-mono font-bold text-sm text-primary">{shareCode}</span>
              </div>
            )}

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-bold">{language}</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3',
                      pathname === item.href && 'bg-primary/20 text-primary'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full ml-auto">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              ))}
              
              {shareCode && (
                <div className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-lg mt-2">
                  <span className="text-sm text-muted-foreground">{language === 'es' ? 'Tu codigo:' : 'Your code:'}</span>
                  <span className="font-mono font-bold text-primary">{shareCode}</span>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
