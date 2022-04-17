import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const url = process.env.NEXTAUTH_URL;
  const token = await getToken({ req });

  const akses = token.user.role.akses.map((aks) => {
    if (aks.read == false && aks.write == false) {
      return {
        ...aks,
        visible: false,
      };
    }
    return {
      ...aks,
      visible: true,
    };
  });

  const page = akses.filter((f) => url + f.path == req.nextUrl);

  if (page.length == 0 || page[0].visible == false) {
    return NextResponse.redirect(url + "/403");
  }

  return NextResponse.next();
}
