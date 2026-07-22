import postgres, { type Sql } from "postgres";

let client: Sql | null = null;

/**
 * Retorna a conexão Postgres, ou `null` quando `DATABASE_URL` não está
 * configurada (nesse caso a API usa um fallback em arquivo, só para testes).
 */
export function getSql(): Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!client) {
    client = postgres(url, { max: 1 });
  }
  return client;
}
