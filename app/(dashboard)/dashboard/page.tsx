import { getDecks, getCategories } from '@/actions/deck-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { DeckGrid } from '@/components/decks/deck-grid'
import { CreateDeckDialog } from '@/components/decks/create-deck-dialog'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const [decksResult, categoriesResult] = await Promise.all([
    getDecks(),
    getCategories()
  ])

  if ('error' in decksResult) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-destructive">{decksResult.error}</p>
        </div>
      </div>
    )
  }

  const { decks } = decksResult
  const { categories } = categoriesResult
  
  return <DashboardClient initialDecks={decks || []} categories={categories || []} />
}
