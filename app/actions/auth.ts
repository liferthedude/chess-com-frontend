'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'

export async function login(_prevState: unknown, formData: FormData) {
  const password = formData.get('password') as string

  if (password !== process.env.AUTH_PASSWORD) {
    return { error: 'Invalid password' }
  }

  const session = await getSession()
  session.isLoggedIn = true
  await session.save()

  redirect('/')
}

export async function logout() {
  const session = await getSession()
  session.destroy()
  redirect('/login')
}
