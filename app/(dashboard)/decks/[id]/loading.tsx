import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DeckLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded"></div>
        <div className="h-4 w-96 bg-muted rounded"></div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3">
        <div className="h-10 w-32 bg-muted rounded"></div>
        <div className="h-10 w-28 bg-muted rounded"></div>
        <div className="h-10 w-10 bg-muted rounded"></div>
      </div>

      {/* Cards list header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-muted rounded"></div>
        <div className="h-6 w-16 bg-muted rounded"></div>
      </div>

      {/* Cards list skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-16 bg-muted rounded"></div>
                  <div className="h-5 w-3/4 bg-muted rounded"></div>
                </div>
                <div className="h-8 w-8 bg-muted rounded"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-5/6 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
