import { getDueCards } from "@/actions/study-actions";
import { StudyClient } from "@/components/study/study-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

interface StudyPageProps {
  params: {
    deckId: string;
  };
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { deckId } = params;
  const result = await getDueCards(deckId);

  // Xử lý lỗi
  if (result.error || !result.data) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {result.error || "Không thể tải dữ liệu"}
            </p>
            <Button asChild>
              <Link href="/dashboard">Về Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { deck, cards } = result.data;

  // Trường hợp không có thẻ cần học (Empty State)
  if (cards.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              ✨ Bạn đã học hết rồi!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">
                Không có thẻ nào cần ôn tập hôm nay
              </p>
              <p className="text-sm text-muted-foreground">
                Hãy quay lại sau nhé! 📚
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard">Về Dashboard</Link>
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

  // Màn hình học chính
  return (
    <StudyClient
      deckId={deckId}
      deckTitle={deck.title}
      initialCards={cards}
    />
  );
}
