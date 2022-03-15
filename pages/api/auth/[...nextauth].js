import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "lib/prisma";
import bcrypt from "bcrypt";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "Username/Email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username,
          },
        });

        const match = await bcrypt.compare(credentials.password, user.password);

        if (match) {
          const { password, resetPasswordToken, ...other } = user;
          return other;
        } else {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      return token;
    },
    async session({ session, token, user }) {
      return token;
    },
  },
});
