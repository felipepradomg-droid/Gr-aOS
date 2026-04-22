import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Páginas que não precisam de verificação de trial
    const publicAppPaths = ["/assinatura", "/checkout", "/planos"];
    if (publicAppPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    // Verificar se o usuário tem plano pago ativo
    const isPago = token?.plan && token.plan !== "free";
    const planExpiresAt = token?.planExpiresAt
      ? new Date(token.planExpiresAt as string)
      : null;
    const planAtivo = isPago && (!planExpiresAt || planExpiresAt > new Date());

    // Se tem plano pago ativo, libera
    if (planAtivo) return NextResponse.next();

    // Verificar trial
    const trialEndsAt = token?.trialEndsAt
      ? new Date(token.trialEndsAt as string)
      : null;
    const trialAtivo = trialEndsAt && trialEndsAt > new Date();

    // Se trial ainda está ativo, libera
    if (trialAtivo) return NextResponse.next();

    // Trial expirado e sem plano pago → redireciona para assinatura
    return NextResponse.redirect(new URL("/assinatura", req.url));
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
  ],
};
