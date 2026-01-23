import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, FileText } from "lucide-react"

type Deck = {
  id: string
  title: string
  description: string | null
  created_at: string
  cards?: { count: number }[]
}

type Props = {
  decks: Deck[]
}

export function DeckGrid({ decks }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => {
        const cardCount = deck.cards?.[0]?.count || 0
        
        return (
          <Card key={deck.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="line-clamp-1">{deck.title}</CardTitle>
                  {deck.description && (
                    <CardDescription className="line-clamp-2">
                      {deck.description}
                    </CardDescription>
                  )}
                </div>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{cardCount} thẻ</span>
              </div>
              
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/decks/${deck.id}`}>
                    Xem chi tiết
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
