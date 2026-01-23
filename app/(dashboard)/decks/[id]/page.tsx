import { getDeck } from '@/actions/deck-actions'
import { getCardsByDeck } from '@/actions/card-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Upload } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CardsList } from '@/components/decks/cards-list'
import { DeleteDeckDialog } from '@/components/decks/delete-deck-dialog'
import { Badge } from '@/components/ui/badge'

type Props = {
  params: {
    id: string
  }
}

export default async function DeckDetailPage({ params }: Props) {
  const { id } = await params
  
  const deckResult = await getDeck(id)
  const cardsResult = await getCardsByDeck(id)

  if ('error' in deckResult) {
    notFound()
  }

  const { deck } = deckResult
  const cards = 'cards' in cardsResult ? (cardsResult.cards || []) : []
  const cardCount = cards.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{deck.title}</h1>
            {deck.category && (
              <Badge variant="secondary">{deck.category}</Badge>
            )}
          </div>
          {deck.description && (
            <p className="text-muted-foreground mt-1">{deck.description}</p>
          )}
        </div>
        <DeleteDeckDialog deckId={id} deckTitle={deck.title} />
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tổng số thẻ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{cardCount}</p>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          {cardCount > 0 && (
            <Button asChild size="lg" className="font-semibold">
              <Link href={`/study/${id}`}>
                Học ngay
              </Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href={`/decks/${id}/import`}>
              <Upload className="mr-2 h-4 w-4" />
              Import JSON
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards List */}
      {cardCount === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Chưa có thẻ nào</CardTitle>
            <CardDescription>
              Import thẻ từ JSON hoặc tạo thẻ mới để bắt đầu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/decks/${id}/import`}>
                <Upload className="mr-2 h-4 w-4" />
                Import từ JSON
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <CardsList cards={cards} />
      )}
    </div>
  )
}
