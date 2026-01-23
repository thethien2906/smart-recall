import { getDeck } from '@/actions/deck-actions'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ImportForm } from '@/components/decks/import-form'

type Props = {
  params: {
    id: string
  }
}

export default async function ImportPage({ params }: Props) {
  const { id } = await params
  const deckResult = await getDeck(id)

  if ('error' in deckResult) {
    notFound()
  }

  const { deck } = deckResult

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/decks/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Import Cards</h1>
          <p className="text-muted-foreground">Vào bộ thẻ: {deck.title}</p>
        </div>
      </div>

      {/* Import Form */}
      <ImportForm deckId={id} />
    </div>
  )
}
