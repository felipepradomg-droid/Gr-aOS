// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Usuário logado tentando acessar página de auth → redireciona pro dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Rotas que exigem plano pago
    const paidRoutes = ["/relatorios", "/api/relatorios"];
    const isPaidRoute = paidRoutes.some((r) => pathname.startsWith(r));

    if (isPaidRoute) {
      const plan = token?.plan as string;
      const expiry = token?.planExpiresAt as string | null;
      const isActive = plan !== "free" && (!expiry || new Date(expiry) > new Date());

      if (!isActive) {
        return NextResponse.redirect(new URL("/checkout?plan=pro&reason=upgrade", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Permite acesso às rotas públicas sem login
      authorized: ({ token, req }) => {
        const publicPaths = ["/", "/login", "/register", "/pricing", "/privacy", "/terms"];
        const isPublic = publicPaths.some((p) => req.nextUrl.pathname === p);
        const isApiPublic = req.nextUrl.pathname.startsWith("/api/mp/webhook");

        if (isPublic || isApiPublic) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
