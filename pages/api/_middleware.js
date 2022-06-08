import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });
  //tambahkan api yang tidak perlu login
  const allowedUrls = ["/auth/", "/pelanggan/pendaftaran"];


  for (let i = 0; i < allowedUrls.length; i++) {
    if (req.url.includes(allowedUrls[i])) {
      return NextResponse.next();
    }
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
