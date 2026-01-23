import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Chào mừng trở lại, {user?.email}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chào mừng đến với SmartRecall!</CardTitle>
          <CardDescription>
            Hệ thống học tập thông minh với Spaced Repetition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bạn chưa có bộ thẻ nào. Hãy tạo bộ thẻ đầu tiên của bạn để bắt đầu học tập!
          </p>
          <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold mb-2">Tính năng sắp ra mắt:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Tạo và quản lý các bộ thẻ học tập</li>
              <li>Import JSON từ ChatGPT một cách dễ dàng</li>
              <li>Học tập với thuật toán Spaced Repetition</li>
              <li>Theo dõi tiến độ học tập</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tổng số bộ thẻ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thẻ cần ôn hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thẻ đã học</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
