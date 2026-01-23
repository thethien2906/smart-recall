import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decks Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-muted rounded"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-48">
              <CardHeader>
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-8 w-8 bg-muted rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
