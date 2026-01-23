import { Card, CardContent } from "@/components/ui/card";

export default function StudyLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-pulse">
      {/* Progress Bar Skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-muted rounded"></div>
          <div className="h-4 w-12 bg-muted rounded"></div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary/50 h-2 rounded-full w-1/3"></div>
        </div>
      </div>

      {/* Flashcard Skeleton */}
      <Card className="min-h-[400px]">
        <CardContent className="p-8 space-y-6">
          {/* Edit button skeleton */}
          <div className="flex justify-end">
            <div className="h-9 w-9 bg-muted rounded"></div>
          </div>

          {/* Question label skeleton */}
          <div className="h-4 w-20 bg-muted rounded"></div>

          {/* Question content skeleton */}
          <div className="space-y-3">
            <div className="h-6 w-full bg-muted rounded"></div>
            <div className="h-6 w-5/6 bg-muted rounded"></div>
            <div className="h-6 w-4/6 bg-muted rounded"></div>
          </div>

          {/* Show answer button skeleton */}
          <div className="flex justify-center pt-8">
            <div className="h-10 w-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons skeleton */}
      <div className="flex justify-between">
        <div className="h-10 w-24 bg-muted rounded"></div>
        <div className="h-10 w-32 bg-muted rounded"></div>
      </div>
    </div>
  );
}
