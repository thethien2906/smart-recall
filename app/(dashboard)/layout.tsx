import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              SmartRecall
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="text-xs md:text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
              {user.email}
            </div>
            <form action={signOut}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Đăng xuất</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  )
}
