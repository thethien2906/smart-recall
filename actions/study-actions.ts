"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calculateNextReview, type Rating } from "@/lib/srs-algorithm";

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
 * Phase 4: Submit Review (Sử dụng thuật toán SM-2)
 * Nhận rating và cập nhật interval, ease_factor, next_review_at
 */
export async function submitReview(
  cardId: string,
  rating: Rating
) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Lấy thông tin card hiện tại (cần interval và ease_factor)
  const { data: card, error: cardError } = await supabase
    .from("cards")
    .select(`
      id,
      deck_id,
      interval,
      ease_factor,
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

  // Phase 4: Sử dụng thuật toán SM-2
  const currentInterval = card.interval || 0;
  const currentEaseFactor = card.ease_factor || 2.5;

  // Tính toán giá trị mới
  const { interval, easeFactor, nextReviewDate } = calculateNextReview(
    currentInterval,
    currentEaseFactor,
    rating
  );

  // Cập nhật database với giá trị mới
  const { error: updateError } = await supabase
    .from("cards")
    .update({
      interval,
      ease_factor: easeFactor,
      next_review_at: nextReviewDate.toISOString(),
      updated_at: new Date().toISOString()
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
