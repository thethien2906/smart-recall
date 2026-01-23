"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log lỗi ra console để dev debug
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Đã có lỗi xảy ra</CardTitle>
          </div>
          <CardDescription>
            Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hiển thị thông tin lỗi chi tiết trong môi trường dev */}
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
              onClick={() => (window.location.href = "/dashboard")}
              className="flex-1"
            >
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
