"use client";

import { useState, useTransition } from "react";
import { Flashcard } from "@/components/study/flashcard";
import { submitReview } from "@/actions/study-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Card {
  id: string;
  question: string;
  answer: string;
  type: string | null;
}

interface StudyClientProps {
  deckId: string;
  deckTitle: string;
  initialCards: Card[];
}

export function StudyClient({ deckId, deckTitle, initialCards }: StudyClientProps) {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentCard = cards[currentIndex];
  const isComplete = currentIndex >= cards.length;

  const handleRate = async (rating: "again" | "hard" | "good" | "easy") => {
    if (!currentCard) return;

    // Optimistic UI: Chuyển sang thẻ tiếp theo ngay lập tức
    setCurrentIndex((prev) => prev + 1);
    setCompletedCount((prev) => prev + 1);

    // Gửi request lên server (không chờ response)
    startTransition(async () => {
      const result = await submitReview(currentCard.id, rating);
      if (result.error) {
        console.error("Failed to submit review:", result.error);
        // TODO: Có thể thêm toast notification ở đây
      }
    });
  };

  // Màn hình tổng kết (Session Summary)
  if (isComplete) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              🎉 Hoàn thành!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">
                Chúc mừng! Bạn đã hoàn thành phiên học
              </p>
              <p className="text-3xl font-bold text-primary">
                {completedCount} thẻ
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                asChild 
                className="w-full" 
                size="lg"
              >
                <Link href="/dashboard">
                  Về Dashboard
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Link href={`/decks/${deckId}`}>
                  Xem chi tiết Deck
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Màn hình học (Review Interface)
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 space-y-2">
        <Link 
          href={`/decks/${deckId}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Quay lại
        </Link>
        <h1 className="text-2xl font-bold">{deckTitle}</h1>
      </div>

      {currentCard && (
        <Flashcard
          cardId={currentCard.id}
          question={currentCard.question}
          answer={currentCard.answer}
          type={currentCard.type || "concept"}
          onRate={handleRate}
          currentIndex={currentIndex}
          totalCards={cards.length}
        />
      )}
    </div>
  );
}
