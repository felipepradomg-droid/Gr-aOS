import path from 'path'

const config = {
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  migrate: {
    adapter: async () => {
      const { PrismaNeon } = await import('@prisma/adapter-neon')
      const { Pool } = await import('@neondatabase/serverless')
      const pool = new Pool({ connectionString: process.env.DATABASE_URL })
      return new PrismaNeon(pool)
    },
  },
}

export default config
