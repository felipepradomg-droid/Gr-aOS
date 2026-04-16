"use client";
// app/(auth)/login/page.tsx

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha inválidos.");
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">GrúaOS</div>
        <h1 className="auth-title">Entrar na sua conta</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com.br"
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-divider"><span>ou</span></div>

        <button onClick={handleGoogle} className="btn-google">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.4 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.4 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1L6 33.1C9.4 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C41.1 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Entrar com Google
        </button>

        <p className="auth-footer">
          Não tem conta?{" "}
          <Link href="/register">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  );
}
