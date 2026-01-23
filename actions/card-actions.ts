"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CardsImportSchema, type CardImport } from "@/lib/validators/import-schema";

/**
 * Import cards từ JSON string (CORE FEATURE của Phase 2)
 */
export async function importCards(deckId: string, jsonString: string) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Kiểm tra deck có tồn tại và thuộc về user không
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id")
    .eq("id", deckId)
    .eq("user_id", user.id)
    .single();

  if (deckError || !deck) {
    return { error: "Không tìm thấy Deck hoặc bạn không có quyền truy cập" };
  }

  // Parse JSON
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(jsonString);
  } catch (e) {
    return {
      error:
        "JSON không hợp lệ. Hãy kiểm tra lại dấu ngoặc, dấu phẩy và cú pháp. Error: " +
        (e as Error).message,
    };
  }

  // Validate schema với Zod
  const validationResult = CardsImportSchema.safeParse(parsedData);
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
    return {
      error: `Dữ liệu không đúng định dạng:\n${errors.join("\n")}`,
    };
  }

  const cards = validationResult.data;

  // Transform data để insert vào DB
  const cardsToInsert = cards.map((card: CardImport) => ({
    deck_id: deckId,
    question: card.question,
    answer: card.answer || "", // Empty string nếu không có answer (Active Recall mode)
    type: card.type || "concept",
    // SRS fields sẽ dùng default values từ DB
  }));

  // Bulk insert
  const { data, error } = await supabase.from("cards").insert(cardsToInsert).select();

  if (error) {
    console.error("Error inserting cards:", error);
    return { error: "Không thể import cards. Vui lòng thử lại." };
  }

  // Refresh và redirect
  revalidatePath(`/decks/${deckId}`);
  redirect(`/decks/${deckId}`);
}

/**
 * Lấy danh sách cards trong 1 deck
 */
export async function getCards(deckId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify deck ownership
  const { data: deck } = await supabase
    .from("decks")
    .select("id")
    .eq("id", deckId)
    .eq("user_id", user.id)
    .single();

  if (!deck) {
    return { error: "Không tìm thấy Deck" };
  }

  // Get cards
  const { data: cards, error } = await supabase
    .from("cards")
    .select("*")
    .eq("deck_id", deckId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cards:", error);
    return { error: "Không thể tải danh sách cards" };
  }

  return { cards };
}

/**
 * Xóa 1 card
 */
export async function deleteCard(cardId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Get card để lấy deck_id
  const { data: card } = await supabase.from("cards").select("deck_id").eq("id", cardId).single();

  if (!card) {
    return { error: "Không tìm thấy card" };
  }

  // Delete card
  const { error } = await supabase.from("cards").delete().eq("id", cardId);

  if (error) {
    console.error("Error deleting card:", error);
    return { error: "Không thể xóa card" };
  }

  revalidatePath(`/decks/${card.deck_id}`);
  return { success: true };
}

/**
 * Phase 4: Cập nhật nội dung thẻ (Question & Answer)
 */
export async function updateCardContent(
  cardId: string,
  question: string,
  answer: string
) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation
  if (!question || question.trim().length === 0) {
    return { error: "Câu hỏi không được để trống" };
  }

  if (!answer || answer.trim().length === 0) {
    return { error: "Câu trả lời không được để trống" };
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

  // Update card
  const { error: updateError } = await supabase
    .from("cards")
    .update({
      question: question.trim(),
      answer: answer.trim(),
      updated_at: new Date().toISOString()
    })
    .eq("id", cardId);

  if (updateError) {
    return { error: "Lỗi khi cập nhật thẻ: " + updateError.message };
  }

  // Revalidate paths
  revalidatePath(`/decks/${card.deck_id}`);
  revalidatePath(`/study/${card.deck_id}`);

  return { error: null, success: true };
}
