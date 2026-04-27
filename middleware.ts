import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Páginas públicas — libera sempre
    const publicAppPaths = ["/assinatura", "/checkout", "/planos"];
    if (publicAppPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    // Usuário autenticado — libera para todas as páginas
    // Limitações de plano são controladas na UI, não no middleware
    if (token) return NextResponse.next();

    // Não autenticado → redireciona para login
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
