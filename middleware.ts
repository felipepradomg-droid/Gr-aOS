import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Páginas sempre liberadas
    const publicAppPaths = ["/assinatura", "/checkout", "/planos", "/api"];
    if (publicAppPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    if (token) {
      const plan = token.plan as string | null;
      const trialEndsAt = token.trialEndsAt as string | null;

      // Se plano free e trial expirado → força checkout
      if (plan === "free" || !plan) {
        const trialExpired = !trialEndsAt || new Date(trialEndsAt) < new Date();
        if (trialExpired) {
          return NextResponse.redirect(new URL("/checkout?plan=pro", req.url));
        }
      }

      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard",
    "/cotacoes",
    "/cotacoes/:path*",
    "/frota",
    "/frota/:path*",
    "/agenda",
    "/os",
    "/os/:path*",
    "/manutencao",
    "/manutencao/:path*",
    "/faturas",
    "/faturas/:path*",
    "/configuracoes",
    "/planos",
    "/checkout",
    "/contratos",
    "/contratos/:path*",
    "/financeiro",
    "/financeiro/:path*",
    "/fiscal",
    "/fiscal/:path*",
    "/bi",
    "/bi/:path*",
  ],
};
