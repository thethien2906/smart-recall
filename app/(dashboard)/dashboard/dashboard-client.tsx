"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DeckGrid } from '@/components/decks/deck-grid'
import { CreateDeckDialog } from '@/components/decks/create-deck-dialog'
import { CategoryFilter } from '@/components/decks/category-filter'
import { DeckSearch } from '@/components/decks/deck-search'
import { useState, useCallback, useTransition } from 'react'
import { getDecks, searchDecks } from '@/actions/deck-actions'

type Deck = {
  id: string
  title: string
  description: string | null
  category: string | null
  created_at: string
  updated_at: string | null
  cards: Array<{
    id: string
    next_review_at: string
  }>
}

interface DashboardClientProps {
  initialDecks: Deck[]
  categories: string[]
}

export function DashboardClient({ initialDecks, categories }: DashboardClientProps) {
  const [decks, setDecks] = useState<Deck[]>(initialDecks)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isPending, startTransition] = useTransition()

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    
    startTransition(async () => {
      const result = await getDecks(category === "all" ? undefined : category)
      if ('decks' in result) {
        setDecks(result.decks || [])
      }
    })
  }, [])

  const handleSearch = useCallback((query: string) => {
    startTransition(async () => {
      const result = await searchDecks(query)
      if ('decks' in result) {
        setDecks(result.decks || [])
      }
    })
  }, [])

  // Stats calculations
  const totalDecks = decks.length
  const totalCards = decks.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0)
  
  const now = new Date()
  const dueCardsToday = decks.reduce((sum, deck) => {
    const dueCards = deck.cards?.filter(card => new Date(card.next_review_at) <= now).length || 0
    return sum + dueCards
  }, 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Quản lý và học tập với các bộ thẻ của bạn
          </p>
        </div>
        <CreateDeckDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tổng số bộ thẻ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalDecks}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tổng số thẻ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalCards}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thẻ cần ôn hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-orange-500">{dueCardsToday}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {dueCardsToday > 0 ? "Hãy bắt đầu học ngay!" : "Bạn đã hoàn thành hôm nay!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      {totalDecks > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <DeckSearch onSearch={handleSearch} />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Lọc theo danh mục:</h3>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
      )}

      {/* Decks Grid */}
      {totalDecks === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Chào mừng đến với SmartRecall!</CardTitle>
            <CardDescription>
              Bắt đầu hành trình học tập thông minh của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Bạn chưa có bộ thẻ nào. Hãy tạo bộ thẻ đầu tiên để bắt đầu!
            </p>
            <CreateDeckDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tạo bộ thẻ đầu tiên
              </Button>
            </CreateDeckDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {isPending && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Đang tải...</div>
            </div>
          )}
          <DeckGrid decks={decks} />
          {decks.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Không tìm thấy bộ thẻ nào phù hợp
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
