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
  const category = formData.get("category") as string;

  // Validation
  if (!title || title.trim().length === 0) {
    throw new Error("Tên Deck không được để trống");
  }

  if (!category || category.trim().length === 0) {
    throw new Error("Vui lòng chọn danh mục");
  }

  // Insert vào database
  const { data, error } = await supabase
    .from("decks")
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      category: category.trim(),
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
 * Lấy danh sách tất cả Decks của user (Phase 6: Support category filtering)
 */
export async function getDecks(category?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Build query với category filter (nếu có)
  let query = supabase
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
    .eq("user_id", user.id);

  // Apply category filter nếu được chỉ định
  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  // Sort by updated_at (deck mới cập nhật lên đầu)
  const { data: decks, error } = await query.order("updated_at", {
    ascending: false,
  });

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
 * Lấy danh sách categories có trong database
 */
export async function getCategories() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: decks, error } = await supabase
    .from("decks")
    .select("category")
    .eq("user_id", user.id)
    .not("category", "is", null);

  if (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }

  // Extract unique categories và sort
  const categories = Array.from(
    new Set(decks.map((d) => d.category).filter(Boolean))
  ).sort();

  return { categories };
}

/**
 * Tìm kiếm Deck theo tên
 */
export async function searchDecks(query: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate query length
  const trimmedQuery = query.trim();
  if (trimmedQuery.length > 100) {
    return { error: "Từ khóa tìm kiếm quá dài" };
  }

  // Nếu query rỗng, trả về tất cả decks
  if (trimmedQuery.length === 0) {
    return getDecks();
  }

  // Search với ILIKE (case-insensitive)
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
    .ilike("title", `%${trimmedQuery}%`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error searching decks:", error);
    return { error: "Không thể tìm kiếm Deck" };
  }

  return { decks };
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
