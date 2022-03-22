import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const url = process.env.NEXTAUTH_URL;
  const token = await getToken({ req });

  if (token) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(url + "/login?r=" + req.url);
  }
}
