import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      avatarUrl?: string
    } & DefaultSession["user"]
    accessToken: string
  }

  interface User extends DefaultUser {
    username: string
    avatarUrl?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string
    username: string
    avatarUrl?: string
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
  }
}
