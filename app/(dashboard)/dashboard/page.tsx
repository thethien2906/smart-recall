import { getDecks } from '@/actions/deck-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { DeckGrid } from '@/components/decks/deck-grid'
import { CreateDeckDialog } from '@/components/decks/create-deck-dialog'

export default async function DashboardPage() {
  const result = await getDecks()

  if ('error' in result) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-destructive">{result.error}</p>
        </div>
      </div>
    )
  }

  const { decks } = result
  const totalDecks = decks?.length || 0
  const totalCards = decks?.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0) || 0
  
  // Phase 4: Tính số thẻ cần ôn hôm nay
  const now = new Date()
  const dueCardsToday = decks?.reduce((sum, deck) => {
    const dueCards = deck.cards?.filter(card => new Date(card.next_review_at) <= now).length || 0
    return sum + dueCards
  }, 0) || 0

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
        <DeckGrid decks={decks} />
      )}
    </div>
  )
}
