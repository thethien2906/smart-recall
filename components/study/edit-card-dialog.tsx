"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCardContent } from "@/actions/card-actions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditCardDialogProps {
  card: {
    id: string;
    question: string;
    answer: string;
    type: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const CARD_TYPES = [
  { value: "concept", label: "Concept (Khái niệm)" },
  { value: "scenario", label: "Scenario (Tình huống)" },
  { value: "choice", label: "Choice (Lựa chọn)" },
  { value: "code", label: "Code (Lập trình)" },
];

export function EditCardDialog({ card, isOpen, onClose }: EditCardDialogProps) {
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);
  const [type, setType] = useState(card.type);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateCardContent(card.id, question, answer, type);

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        router.refresh();
      }
    });
  };

  const handleCancel = () => {
    // Reset về giá trị ban đầu khi đóng
    setQuestion(card.question);
    setAnswer(card.answer);
    setType(card.type);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thẻ</DialogTitle>
          <DialogDescription>
            Sửa lại câu hỏi, câu trả lời hoặc loại thẻ nếu ChatGPT tạo sai.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Loại thẻ</Label>
            <Select value={type} onValueChange={setType} disabled={isPending}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Chọn loại thẻ" />
              </SelectTrigger>
              <SelectContent>
                {CARD_TYPES.map((cardType) => (
                  <SelectItem key={cardType.value} value={cardType.value}>
                    {cardType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Câu hỏi</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi..."
              className="min-h-[120px]"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Câu trả lời</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Nhập câu trả lời..."
              className="min-h-[200px]"
              disabled={isPending}
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
