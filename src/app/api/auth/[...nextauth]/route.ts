import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import connectDB from "../../../../lib/mongodb"
import Profile from "../../../../lib/database/profile-model"
import { JWT } from "next-auth/jwt"


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "your-access-secret-key"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        try {
          await connectDB()

          const user = await Profile.findOne({
            email: credentials.email.toLowerCase()
          }).select('+password')

          if (!user) {
            throw new Error("Invalid credentials")
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValidPassword) {
            throw new Error("Invalid credentials")
          }

          return {
            id: (user as any)._id.toString(),
            email: user.email,
            username: user.username,
            avatarUrl: user.avatarUrl,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error("Authentication failed")
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  },
  jwt: {
    maxAge: 60 * 30, // 30 minutes for access token
  },
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        // Initial sign in
        const accessToken = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            username: user.username
          },
          JWT_ACCESS_SECRET,
          { expiresIn: '30m' }
        )

        const refreshToken = jwt.sign(
          {
            userId: user.id,
            email: user.email
          },
          JWT_REFRESH_SECRET,
          { expiresIn: '14d' }
        )

        token.accessToken = accessToken
        token.refreshToken = refreshToken
        token.userId = user.id
        token.username = user.username
        token.avatarUrl = user.avatarUrl
        token.accessTokenExpires = Date.now() + 30 * 60 * 1000 // 30 minutes
      }

      // Check if access token is expired and refresh if needed
      if (Date.now() > (token.accessTokenExpires as number)) {
        try {
          // Verify refresh token
          jwt.verify(token.refreshToken as string, JWT_REFRESH_SECRET)

          // Generate new access token
          const newAccessToken = jwt.sign(
            {
              userId: token.userId,
              email: token.email,
              username: token.username
            },
            JWT_ACCESS_SECRET,
            { expiresIn: '30m' }
          )

          token.accessToken = newAccessToken
          token.accessTokenExpires = Date.now() + 30 * 60 * 1000
        } catch (error) {
          // Refresh token is invalid or expired - clear all token data
          // This will cause the user to be signed out
          const tokenAny = token as any;
          delete tokenAny.accessToken;
          delete tokenAny.refreshToken;
          delete tokenAny.userId;
          delete tokenAny.username;
          delete tokenAny.avatarUrl;
          delete tokenAny.accessTokenExpires;
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId
        session.user.username = token.username
        session.user.avatarUrl = token.avatarUrl
        session.accessToken = token.accessToken
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
})

export { handler as GET, handler as POST }
