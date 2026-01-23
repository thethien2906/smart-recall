# 🧠 SmartRecall

**Ứng dụng học tập thông minh với thuật toán Spaced Repetition System (SRS)**

SmartRecall giúp bạn ghi nhớ kiến thức hiệu quả bằng cách tối ưu hóa lịch ôn tập dựa trên khoa học về trí nhớ. Tự động hóa việc tạo flashcards từ ChatGPT và học đúng lúc, đúng thẻ cần ôn.

---

## ✨ Tính năng chính

### 🎯 Core Features

#### 1. **Quản lý Decks (Bộ thẻ)**
- 📁 Tạo và tổ chức bộ thẻ theo danh mục
- 🏷️ Phân loại với category badges
- 🔍 Tìm kiếm nhanh theo tên
- 🎨 Lọc theo danh mục
- 📊 Theo dõi tiến độ (tổng thẻ, thẻ cần ôn)

#### 2. **Import JSON từ ChatGPT**
- ⚡ Bulk import - paste JSON và tạo hàng loạt thẻ
- ✅ Validation tự động với Zod schema
- 🎭 Hỗ trợ 4 loại thẻ:
  - **Concept**: Khái niệm, định nghĩa
  - **Scenario**: Tình huống, case study
  - **Choice**: Câu hỏi trắc nghiệm
  - **Code**: Code snippet với syntax highlighting

#### 3. **Spaced Repetition System (SRS)**
- 🧮 Thuật toán SM-2 tính toán ngày ôn tiếp theo
- 🎚️ 4 mức đánh giá: Again / Hard / Good / Easy
- 📅 Tự động lên lịch ôn tập tối ưu
- 🔄 Interval tăng dần khi nhớ tốt

#### 4. **Giao diện Học tập (Flashcard)**
- 🃏 Lật thẻ xem câu hỏi/đáp án
- 💻 Markdown rendering với code syntax highlighting
- ✏️ Sửa thẻ ngay trong phiên học
- 📈 Thanh tiến độ theo dõi real-time
- 🎯 Active Recall - tự trả lời trước khi xem đáp án

#### 5. **Quản lý Cards (Thẻ học)**
- ✏️ Chỉnh sửa câu hỏi, đáp án, loại thẻ
- 🗑️ Xóa thẻ với confirmation
- 📝 Edit từ deck detail hoặc trong study session
- 🔄 Auto-update timestamp khi thay đổi

#### 6. **Dashboard & Analytics**
- 📊 Tổng quan: Số decks, số thẻ, thẻ cần ôn hôm nay
- 🔔 Badges thông báo thẻ cần ôn
- 🎨 UI responsive, dark mode ready
- ⚡ Loading states mượt mà

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Markdown**: react-markdown + rehype-highlight

---

## 🎨 Screenshots & User Flow

### 1. Authentication
Đăng nhập/Đăng ký với email hoặc OAuth (Google/Github)

### 2. Dashboard
- Xem tổng quan các bộ thẻ
- Lọc theo category
- Tìm kiếm nhanh
- Badge thông báo thẻ cần ôn

### 3. Deck Detail
- Xem danh sách tất cả thẻ
- Edit/Delete từng thẻ
- Import thêm thẻ từ JSON

### 4. Study Session
- Lật thẻ Q&A
- Đánh giá mức độ nhớ
- Edit thẻ mid-session
- Hoàn thành và xem tổng kết

---

## 🚀 Sử dụng

### Bước 1: Tạo Deck
1. Dashboard → **"Tạo Deck mới"**
2. Nhập tên, danh mục, mô tả
3. Click **"Tạo Deck"**

### Bước 2: Import Thẻ từ ChatGPT
1. Hỏi ChatGPT: *"Tạo 10 câu hỏi về [topic] theo format JSON"*
   ```
   Ví dụ prompt: "Tạo 10 câu hỏi về Python decorators với format:
   [
     {
       "question": "...",
       "answer": "...",
       "type": "concept"
     }
   ]"
   ```
2. Copy JSON output
3. Vào Deck → **"Import JSON"**
4. Paste và click **"Magic Import"**

### Bước 3: Học
1. Dashboard → Click **"Học ngay"** trên deck có badge đỏ
2. Đọc câu hỏi → Tự trả lời trong đầu
3. Click **"Hiện đáp án"**
4. Đánh giá:
   - **Again**: Quên hoàn toàn → Học lại ngay mai
   - **Hard**: Nhớ khó → Interval ngắn
   - **Good**: Nhớ tốt → Interval chuẩn
   - **Easy**: Quá dễ → Interval dài

### Bước 4: Quản lý
- **Edit thẻ**: Click ✏️ để sửa nội dung sai
- **Delete thẻ**: Click 🗑️ để xóa thẻ không cần
- **Filter/Search**: Tìm deck nhanh với category hoặc search

---

## 📖 Tài liệu

### JSON Schema cho Import
```json
[
  {
    "question": "Câu hỏi của bạn",
    "answer": "Câu trả lời chi tiết (hỗ trợ Markdown)",
    "type": "concept"
  }
]
```

**Lưu ý**: `type` có thể là: `concept`, `scenario`, `choice`, hoặc `code`

### Card Types
- **concept**: Khái niệm, định nghĩa (default)
- **scenario**: Tình huống thực tế, case study
- **choice**: Câu hỏi trắc nghiệm
- **code**: Code snippet (auto syntax highlighting)

---

## 🏗️ Kiến trúc

```
smart-recall/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login/Signup
│   └── (dashboard)/       # Dashboard, Decks, Study
├── actions/               # Server Actions
│   ├── auth-actions.ts
│   ├── deck-actions.ts
│   ├── card-actions.ts
│   └── study-actions.ts
├── components/            # UI Components
│   ├── ui/               # Shadcn components
│   ├── decks/            # Deck-related
│   └── study/            # Study-related
├── lib/
│   ├── supabase/         # DB clients
│   ├── srs-algorithm.ts  # SM-2 implementation
│   └── validators/       # Zod schemas
└── supabase/
    └── migrations/       # Database schema
```

---

## 🧪 Features by Phase

- ✅ **Phase 1**: Authentication & Foundation
- ✅ **Phase 2**: Deck Management & JSON Import
- ✅ **Phase 3**: Active Recall Loop
- ✅ **Phase 4**: SRS Algorithm (SM-2)
- ✅ **Phase 5**: UI Polish & Markdown Rendering
- ✅ **Phase 6**: Advanced Management (Search, Filter, Edit)

---

## 🎯 Roadmap

### Future Enhancements
- 📱 Mobile app (React Native)
- 👥 Deck sharing & collaboration
- 📈 Advanced analytics & statistics
- 🎮 Gamification (streaks, achievements)
- 🌐 Multi-language support
- 🔊 Text-to-speech for Q&A
- 📸 Image support in cards
- 🤖 AI-powered card generation

---

## 📝 License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

---

## 🙏 Credits

- **Spaced Repetition**: Dựa trên thuật toán SM-2 của SuperMemo
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/)

---

**Made with ❤️ for learners who value efficiency**
