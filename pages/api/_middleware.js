import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });

  if (req.url.includes("/auth/")) {
    return NextResponse.next();
  }

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
