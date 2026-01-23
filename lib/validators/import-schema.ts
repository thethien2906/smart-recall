import { z } from "zod";

/**
 * Schema cho 1 thẻ (Card) khi import từ JSON
 * Ví dụ format mong đợi từ ChatGPT:
 * {
 *   "question": "What is the difference between let and const?",
 *   "answer": "let allows reassignment, const does not",
 *   "type": "concept"
 * }
 */
export const CardImportSchema = z.object({
  question: z
    .string()
    .min(1, "Question không được để trống")
    .max(2000, "Question quá dài (max 2000 ký tự)"),
  answer: z
    .string()
    .max(5000, "Answer quá dài (max 5000 ký tự)")
    .optional()
    .default(""),
  type: z
    .enum(["concept", "scenario", "choice", "code"])
    .default("concept")
    .optional(),
});

/**
 * Schema cho toàn bộ JSON import (Mảng các thẻ)
 */
export const CardsImportSchema = z.array(CardImportSchema).min(1, "Cần ít nhất 1 thẻ để import");

/**
 * Type definition từ Zod schema (để dùng trong TypeScript)
 */
export type CardImport = z.infer<typeof CardImportSchema>;
export type CardsImport = z.infer<typeof CardsImportSchema>;

/**
 * Format mẫu để hiển thị cho user (Copy-paste friendly)
 */
export const SAMPLE_JSON_FORMAT = `[
  {
    "question": "What is Spaced Repetition?",
    "type": "concept"
  },
  {
    "question": "Explain the difference between REST and GraphQL APIs",
    "type": "concept"
  },
  {
    "question": "How would you optimize a slow SQL query that joins 3 tables?",
    "type": "scenario"
  }
]`;

/**
 * Prompt mẫu để gửi cho ChatGPT (Copy-paste friendly)
 */
export const CHATGPT_PROMPT = `Dựa vào tài liệu/nội dung tôi cung cấp bên dưới, hãy tạo ra các câu hỏi ôn tập theo phong cách Active Recall và First Principles.

**YÊU CẦU FORMAT:**
- Trả về JSON array với format: [{"question": "...", "type": "..."}]
- Không cần trường "answer", chỉ có "question" và "type"
- Type phải là một trong: "concept", "scenario", "choice", "code"

**YÊU CẦU NỘI DUNG:**
- Câu hỏi phải mở (open-ended), không phải Yes/No
- Tập trung vào "Tại sao?" và "Như thế nào?"
- Với type="scenario": Tạo tình huống thực tế để áp dụng kiến thức
- Với type="concept": Hỏi về định nghĩa, nguyên lý cốt lõi
- Với type="code": Yêu cầu viết code hoặc giải thích code
- Với type="choice": So sánh và đối chiếu các lựa chọn

**VÍ DỤ OUTPUT:**
[
  {
    "question": "Giải thích cơ chế hoisting trong JavaScript và cho ví dụ minh họa",
    "type": "concept"
  },
  {
    "question": "Trong tình huống API server bị quá tải 1000 requests/giây, bạn sẽ xử lý như thế nào?",
    "type": "scenario"
  }
]

---
**TÀI LIỆU CẦN ÔN TẬP:**
[Paste nội dung tài liệu của bạn ở đây]`;
