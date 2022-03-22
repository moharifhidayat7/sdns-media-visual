import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  if (token) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(
      process.env.NEXTAUTH_URL + "/login?r=" + req.url
    );
  }
}
