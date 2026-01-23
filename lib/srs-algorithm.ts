/**
 * SM-2 Spaced Repetition Algorithm
 * Phase 4: Core logic tính toán interval và ease factor
 */

export type Rating = "again" | "hard" | "good" | "easy";

export interface SRSResult {
  interval: number; // Số ngày đến lần review tiếp theo
  easeFactor: number; // Hệ số "dễ nhớ" của thẻ
  nextReviewDate: Date; // Thời điểm review tiếp theo
}

/**
 * Tính toán lần review tiếp theo dựa trên thuật toán SM-2
 * 
 * @param currentInterval - Số ngày ngắt quãng hiện tại
 * @param currentEaseFactor - Hệ số dễ nhớ hiện tại (mặc định 2.5)
 * @param rating - Đánh giá của người dùng (again=1, hard=2, good=3, easy=4)
 * @returns Object chứa interval, easeFactor, và nextReviewDate mới
 */
export function calculateNextReview(
  currentInterval: number,
  currentEaseFactor: number,
  rating: Rating
): SRSResult {
  // Convert rating sang số
  const ratingValue = getRatingValue(rating);

  // Validate input
  if (ratingValue < 1 || ratingValue > 4) {
    throw new Error("Rating phải nằm trong khoảng 1-4");
  }

  let newInterval: number;
  let newEaseFactor: number;

  // Case 1: User quên (Again/Rating 1)
  if (ratingValue === 1) {
    // Reset về 1 ngày (hoặc 0 để học lại ngay)
    newInterval = 1;
    
    // Giảm ease factor nhưng không dưới 1.3
    newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2);
  } 
  // Case 2: User nhớ (Hard/Good/Easy)
  else {
    // Tính ease factor mới theo công thức SM-2
    const q = ratingValue; // Quality (1-4)
    newEaseFactor = currentEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    
    // Đảm bảo ease factor không dưới 1.3 (tránh Ease Hell)
    newEaseFactor = Math.max(1.3, newEaseFactor);

    // Tính interval mới
    if (currentInterval === 0) {
      // Lần học đầu tiên
      newInterval = 1;
    } else if (currentInterval === 1) {
      // Lần học thứ 2
      newInterval = 6;
    } else {
      // Các lần sau: interval cũ * ease factor
      newInterval = Math.round(currentInterval * newEaseFactor);
      
      // Bonus cho Easy rating
      if (rating === "easy") {
        newInterval = Math.round(newInterval * 1.3);
      }
      // Penalty cho Hard rating
      else if (rating === "hard") {
        newInterval = Math.round(newInterval * 0.8);
      }
    }
  }

  // Đảm bảo interval ít nhất là 1 ngày
  newInterval = Math.max(1, newInterval);

  // Tính ngày review tiếp theo
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    interval: newInterval,
    easeFactor: Number(newEaseFactor.toFixed(2)), // Làm tròn 2 chữ số thập phân
    nextReviewDate,
  };
}

/**
 * Convert rating string sang số để tính toán
 */
function getRatingValue(rating: Rating): number {
  const ratingMap: Record<Rating, number> = {
    again: 1, // Quên hoàn toàn
    hard: 2,  // Nhớ nhưng khó
    good: 3,  // Nhớ tốt
    easy: 4,  // Nhớ rất dễ
  };

  return ratingMap[rating];
}

/**
 * Helper: Tính số thẻ cần review hôm nay
 * Dùng cho Badge trên Dashboard
 */
export function getDueCardsCount(cards: Array<{ next_review_at: string }>): number {
  const now = new Date();
  return cards.filter(card => new Date(card.next_review_at) <= now).length;
}
