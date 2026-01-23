"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import { deleteCard } from "@/actions/card-actions"
import { useState, useTransition } from "react"
import { MarkdownViewer } from "@/components/ui/markdown-viewer"
import { EditCardDialog } from "@/components/study/edit-card-dialog"

type Card = {
  id: string
  question: string
  answer: string
  type: string
  created_at: string
}

type Props = {
  cards: Card[]
}

export function CardsList({ cards }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh sách thẻ</h2>
        <Badge variant="secondary">{cards.length} thẻ</Badge>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}

function CardItem({ card }: { card: Card }) {
  const [isPending, startTransition] = useTransition()
  const [isDeleted, setIsDeleted] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleDelete = () => {
    if (!confirm("Bạn có chắc muốn xóa thẻ này? Hành động không thể hoàn tác.")) return

    startTransition(async () => {
      const result = await deleteCard(card.id)
      if (result?.success) {
        setIsDeleted(true)
      }
    })
  }

  if (isDeleted) return null

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {card.type}
                </Badge>
              </div>
              <CardTitle className="text-base">{card.question}</CardTitle>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditOpen(true)}
                disabled={isPending}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {card.answer ? (
            <MarkdownViewer content={card.answer} className="text-sm" />
          ) : (
            <CardDescription className="italic text-muted-foreground/60">
          
            </CardDescription>
          )}
        </CardContent>
      </Card>

      <EditCardDialog
        card={card}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  )
}
