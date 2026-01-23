"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Tạo Deck mới
 */
export async function createDeck(formData: FormData): Promise<void> {
  const supabase = await createClient();

  // Lấy user hiện tại
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // Validation
  if (!title || title.trim().length === 0) {
    throw new Error("Tên Deck không được để trống");
  }

  // Insert vào database
  const { data, error } = await supabase
    .from("decks")
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating deck:", error);
    throw new Error("Không thể tạo Deck. Vui lòng thử lại.");
  }

  // Refresh dashboard và redirect
  revalidatePath("/dashboard");
  redirect(`/decks/${data.id}`);
}

/**
 * Lấy danh sách tất cả Decks của user (Phase 4: Include due cards info)
 */
export async function getDecks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Lấy decks với thông tin cards
  const { data: decks, error } = await supabase
    .from("decks")
    .select(
      `
      *,
      cards (
        id,
        next_review_at
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching decks:", error);
    return { error: "Không thể tải danh sách Deck" };
  }

  return { decks };
}

/**
 * Lấy thông tin chi tiết 1 Deck
 */
export async function getDeck(deckId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: deck, error } = await supabase
    .from("decks")
    .select(
      `
      *,
      cards (count)
    `
    )
    .eq("id", deckId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching deck:", error);
    return { error: "Không tìm thấy Deck" };
  }

  return { deck };
}

/**
 * Xóa Deck (Cascade delete sẽ xóa luôn cards)
 */
export async function deleteDeck(deckId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting deck:", error);
    return { error: "Không thể xóa Deck" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
