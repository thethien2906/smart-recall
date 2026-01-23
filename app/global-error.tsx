"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Lỗi hệ thống</CardTitle>
              </div>
              <CardDescription>
                Đã xảy ra lỗi nghiêm trọng. Vui lòng tải lại trang.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === "development" && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-mono text-destructive break-all">
                    {error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={reset} className="flex-1">
                  Thử lại
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Tải lại trang
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
