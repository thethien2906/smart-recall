"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditCardDialog } from "./edit-card-dialog";

interface FlashcardProps {
  cardId: string;
  question: string;
  answer: string;
  onRate: (rating: "again" | "hard" | "good" | "easy") => void;
  currentIndex: number;
  totalCards: number;
}

export function Flashcard({
  cardId,
  question,
  answer,
  onRate,
  currentIndex,
  totalCards,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Check xem câu hỏi có đáp án hay không
  const hasAnswer = answer && answer.trim().length > 0;

  const handleShowAnswer = () => {
    setIsFlipped(true);
  };

  const handleRate = (rating: "again" | "hard" | "good" | "easy") => {
    setIsFlipped(false); // Reset trạng thái khi chuyển thẻ
    onRate(rating);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tiến độ</span>
          <span>{currentIndex + 1} / {totalCards}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <Card className="min-h-[400px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-8">
          {/* Header với nút Edit */}
          <div className="flex justify-end mb-4">
            <EditCardDialog
              cardId={cardId}
              initialQuestion={question}
              initialAnswer={answer}
            />
          </div>

          {/* Question (Always visible) */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-muted-foreground">
                Câu hỏi:
              </div>
              {!hasAnswer && (
                <Badge variant="outline" className="text-xs">
                  Tự trả lời
                </Badge>
              )}
            </div>
            <div className="text-xl font-medium leading-relaxed whitespace-pre-wrap">
              {question}
            </div>

            {/* Instruction cho câu hỏi không có đáp án */}
            {!hasAnswer && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Sử dụng bộ não đi bro</strong>
                </p>
              </div>
            )}

            {/* Answer (Only visible when flipped và có đáp án) */}
            {hasAnswer && isFlipped && (
              <div className="mt-8 pt-8 border-t space-y-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Đáp án:
                </div>
                <div className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {answer}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t">
            {/* Nếu CÓ đáp án: Hiện nút "Hiện đáp án" trước, rồi mới rating */}
            {hasAnswer && !isFlipped ? (
              <Button
                onClick={handleShowAnswer}
                className="w-full"
                size="lg"
              >
                Hiện đáp án
              </Button>
            ) : (
              /* Nếu KHÔNG có đáp án HOẶC đã flip: Hiện 4 nút rating luôn */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => handleRate("again")}
                  variant="destructive"
                  className="w-full"
                >
                  <span className="flex flex-col items-center gap-1">
                    <span className="font-semibold">Again</span>
                  </span>
                </Button>
                <Button
                  onClick={() => handleRate("hard")}
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <span className="flex flex-col items-center gap-1">
                    <span className="font-semibold">Hard</span>
                  </span>
                </Button>
                <Button
                  onClick={() => handleRate("good")}
                  variant="outline"
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <span className="flex flex-col items-center gap-1">
                    <span className="font-semibold">Good</span>
                  </span>
                </Button>
                <Button
                  onClick={() => handleRate("easy")}
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                >
                  <span className="flex flex-col items-center gap-1">
                    <span className="font-semibold">Easy</span>
                  </span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
