import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

export async function middleware(req, res) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  if (token) {
    return NextResponse.next();
  } else {
    return new Response(JSON.stringify({ message: "Not Authenticated" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
