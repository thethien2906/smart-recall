# SmartRecall - Phase 1: Foundation & Authentication

##  Hoàn thành Phase 1

Phase 1 đã được triển khai thành công với các thành phần sau:

###  Cấu trúc Project
-  Next.js 14.2.3 với TypeScript
-  App Router với Route Groups
-  Tailwind CSS + Shadcn UI
-  Supabase Integration

###  Backend Setup
-  Supabase Clients (Server & Client)
-  Server Actions (login, signup, signOut)
-  Middleware bảo vệ routes

###  Frontend UI
-  Màn hình Login/Signup
-  Màn hình Dashboard (empty state)
-  UI Components (Button, Input, Card)

##  Hướng dẫn Setup

### Bước 1: Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Tạo account (nếu chưa có)
3. Tạo New Project
4. Lưu lại thông tin:
   - Project URL
   - Anon/Public Key

### Bước 2: Cấu hình biến môi trường

Mở file `.env.local` và cập nhật:

\\\env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\\\

### Bước 3: Enable Authentication trên Supabase

1. Vào Dashboard Supabase > Authentication
2. Bật Email Provider:
   - Settings > Auth Providers > Email
   - Enable "Email Confirmation" nếu muốn

### Bước 4: Chạy Development Server

\\\ash
npm run dev
\\\

Truy cập: http://localhost:3000

##  Cấu trúc Project

\\\
smart-recall/
 app/
    (auth)/
       login/          # Màn hình đăng nhập
       layout.tsx      # Layout riêng cho auth
    (dashboard)/
       dashboard/      # Màn hình dashboard
       layout.tsx      # Layout có header/sidebar
    layout.tsx          # Root layout
    globals.css
 actions/
    auth-actions.ts     # Server Actions cho auth
 components/
    ui/                 # Shadcn UI components
 lib/
    supabase/
       server.ts       # Server-side client
       client.ts       # Client-side client
    utils.ts
 middleware.ts           # Route protection
\\\

##  Tính năng đã hoàn thành

### Authentication
-  Đăng ký tài khoản mới
-  Đăng nhập
-  Đăng xuất
-  Bảo vệ routes (chưa login không vào được dashboard)

### UI/UX
-  Form đăng nhập responsive
-  Hiển thị lỗi validation
-  Loading states
-  Dark mode support (cấu hình sẵn)

##  Testing

### Test Flow 1: Đăng ký
1. Truy cập http://localhost:3000
2. Tự động redirect về /login
3. Click "Chưa có tài khoản? Đăng ký ngay"
4. Nhập email + password (>6 ký tự)
5. Submit -> Redirect về dashboard

### Test Flow 2: Đăng nhập
1. Truy cập /login
2. Nhập email/password đã đăng ký
3. Submit -> Redirect về dashboard

### Test Flow 3: Bảo vệ Route
1. Đăng xuất
2. Thử truy cập /dashboard
3. Tự động redirect về /login

##  Definition of Done (Phase 1)

-  Project chạy được ở Localhost
-  User đăng nhập được
-  Thông tin lưu trong Supabase Authentication
-  Middleware bảo vệ routes
-  UI responsive và đẹp

##  Tiếp theo: Phase 2

Phase 2 sẽ tập trung vào:
- Tạo bảng `decks` và `cards`
- Import JSON từ ChatGPT
- Hiển thị danh sách decks

##  Ghi chú

- Supabase Free Tier: 500MB database, 50,000 monthly active users
- Next.js sử dụng Server Actions thay vì API routes truyền thống
- Middleware chạy trên Edge Runtime (cực nhanh)
