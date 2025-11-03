import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

// next-auth is ONLY used for OAuth flow
// NO session management - backend handles everything via cookies
export const { handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Pass user data to sync page via URL params
      if (account?.provider && user) {
        // Store in a temp way to pass to sync page
        return `/oauth/sync?email=${encodeURIComponent(user.email || '')}&name=${encodeURIComponent(user.name || '')}&image=${encodeURIComponent(user.image || '')}`;
      }
      return true;
    },
  },
  
  pages: {
    signIn: "/signin",
    error: "/error",
  },
});
