import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/login',
    error: '/auth-error',
  },
  callbacks: {
    signIn({ profile }) {
      return profile?.email === process.env.AUTH_ALLOWED_EMAIL
    },
  },
})
