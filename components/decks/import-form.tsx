"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SAMPLE_JSON_FORMAT, CHATGPT_PROMPT } from "@/lib/validators/import-schema"
import { importCards } from "@/actions/card-actions"
import { AlertCircle, FileJson, Loader2, Copy, Check } from "lucide-react"
import { useState, useTransition } from "react"

type Props = {
  deckId: string
}

export function ImportForm({ deckId }: Props) {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedSample, setCopiedSample] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!jsonInput.trim()) {
      setError("Vui lòng nhập dữ liệu JSON")
      return
    }

    startTransition(async () => {
      const result = await importCards(deckId, jsonInput)
      if (result?.error) {
        setError(result.error)
      }
      // Nếu thành công, server action sẽ redirect tự động
    })
  }

  const handleUseSample = () => {
    setJsonInput(SAMPLE_JSON_FORMAT)
    setError(null)
  }

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(CHATGPT_PROMPT)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleCopySample = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_JSON_FORMAT)
      setCopiedSample(true)
      setTimeout(() => setCopiedSample(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Bước 1: Copy Prompt */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold">1</span>
            Copy Prompt cho ChatGPT
          </CardTitle>
          <CardDescription>
            Sao chép prompt này và gửi kèm tài liệu của bạn cho ChatGPT
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 border">
            <pre className="text-xs whitespace-pre-wrap overflow-x-auto max-h-60 overflow-y-auto">
              <code>{CHATGPT_PROMPT}</code>
            </pre>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyPrompt}
            className="w-full"
          >
            {copiedPrompt ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Đã copy!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Prompt
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Bước 2: Nhận JSON từ ChatGPT */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold">2</span>
            Paste JSON từ ChatGPT
          </CardTitle>
          <CardDescription>
            ChatGPT sẽ trả về JSON, paste vào ô bên dưới
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Sample Format Reference */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              📋 Xem ví dụ format JSON mẫu
            </summary>
            <div className="mt-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-3">
              <pre className="text-xs overflow-x-auto">
                <code>{SAMPLE_JSON_FORMAT}</code>
              </pre>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseSample}
                >
                  Dùng mẫu này
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySample}
                >
                  {copiedSample ? (
                    <>
                      <Check className="mr-1 h-3 w-3 text-green-500" />
                      Đã copy
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </details>

          {/* JSON Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste JSON vào đây...\n\nVí dụ:\n[\n  {\n    "question": "Câu hỏi của bạn?",\n    "type": "concept"\n  }\n]'
              className="min-h-[300px] font-mono text-sm"
              disabled={isPending}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-wrap">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending || !jsonInput.trim()} className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang import...
                  </>
                ) : (
                  <>
                    <FileJson className="mr-2 h-4 w-4" />
                    Import Cards
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setJsonInput("")
                  setError(null)
                }}
                disabled={isPending}
              >
                Xóa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
