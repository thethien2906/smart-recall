"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Phase 3: Get Due Cards
 * Lấy danh sách thẻ cần học (next_review_at <= hiện tại)
 */
export async function getDueCards(deckId: string) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", data: null };
  }

  // Kiểm tra deck có tồn tại và thuộc về user không
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id, title")
    .eq("id", deckId)
    .eq("user_id", user.id)
    .single();

  if (deckError || !deck) {
    return { 
      error: "Không tìm thấy Deck hoặc bạn không có quyền truy cập", 
      data: null 
    };
  }

  // Lấy các thẻ cần học (next_review_at <= hiện tại)
  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .select("id, question, answer, type, next_review_at")
    .eq("deck_id", deckId)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at", { ascending: true });

  if (cardsError) {
    return { 
      error: "Lỗi khi lấy danh sách thẻ: " + cardsError.message, 
      data: null 
    };
  }

  return { 
    error: null, 
    data: {
      deck,
      cards: cards || []
    }
  };
}

/**
 * Phase 3: Submit Review (Logic tạm thời)
 * Nhận rating và cập nhật next_review_at
 * Phase 3: Chỉ cộng thêm 1 ngày, chưa dùng thuật toán SRS
 */
export async function submitReview(
  cardId: string,
  rating: "again" | "hard" | "good" | "easy"
) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Kiểm tra card có tồn tại và thuộc về user không
  const { data: card, error: cardError } = await supabase
    .from("cards")
    .select(`
      id,
      deck_id,
      decks!inner(user_id)
    `)
    .eq("id", cardId)
    .single();

  if (cardError || !card) {
    return { error: "Không tìm thấy thẻ hoặc bạn không có quyền truy cập" };
  }

  // @ts-expect-error - Supabase typing issue with nested relations
  if (card.decks.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Phase 3: Logic tạm thời - cộng thêm 1 ngày
  // Phase 4 sẽ implement thuật toán SM-2 thật sự
  const now = new Date();
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + 1); // Cộng 1 ngày

  // Cập nhật next_review_at
  const { error: updateError } = await supabase
    .from("cards")
    .update({
      next_review_at: nextReviewDate.toISOString(),
      updated_at: now.toISOString()
    })
    .eq("id", cardId);

  if (updateError) {
    return { error: "Lỗi khi cập nhật thẻ: " + updateError.message };
  }

  // Revalidate để UI cập nhật
  revalidatePath("/dashboard");
  revalidatePath(`/study/${card.deck_id}`);

  return { error: null, success: true };
}
