# GrúaOS — Sistema de Gestão de Cotações

SaaS para empresas de grua e içamento. Gerencie cotações, clientes e propostas.

## 🚀 Deploy em 3 passos

### 1. Banco de dados (Neon — gratuito)
1. Acesse https://neon.tech → criar conta
2. Novo projeto → nome: `guraos`
3. Copie a **Connection string**

### 2. Mercado Pago
1. Acesse https://mercadopago.com.br/developers/panel
2. Crie app "GrúaOS" → Credenciais de Produção
3. Copie o **Access Token**
4. Configure Webhook: `https://SEU-DOMINIO/api/mp/webhook` → evento: Pagamentos

### 3. Vercel
1. Importe este repositório no https://vercel.com
2. Adicione as variáveis de ambiente:

```
DATABASE_URL=           → string do Neon
NEXTAUTH_SECRET=        → texto aleatório longo
NEXTAUTH_URL=           → https://seu-dominio.vercel.app
MP_ACCESS_TOKEN=        → token do Mercado Pago
CRON_SECRET=            → texto aleatório
```

3. Clique em Deploy ✅

## Stack
- Next.js 14 (App Router)
- NextAuth (login email + Google)
- Prisma + PostgreSQL (Neon)
- Mercado Pago PIX
- Vercel (deploy + cron)

## Suporte
gruaossolucoes@gmail.com
