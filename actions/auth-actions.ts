'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // Lấy dữ liệu từ form
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate dữ liệu cơ bản
  if (!data.email || !data.password) {
    return { error: 'Email và mật khẩu không được để trống' }
  }

  // Gửi yêu cầu đăng nhập
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // Lấy dữ liệu từ form
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate dữ liệu cơ bản
  if (!data.email || !data.password) {
    return { error: 'Email và mật khẩu không được để trống' }
  }

  if (data.password.length < 6) {
    return { error: 'Mật khẩu phải có ít nhất 6 ký tự' }
  }

  // Gửi yêu cầu đăng ký
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
