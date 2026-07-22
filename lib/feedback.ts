import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSql } from "./db";

export type Feedback = {
  nome: string;
  resultado: string | null;
  ambiente: string | null;
  atendimento: string | null;
  estrelas: number;
  created_at: string;
};

async function readFromFile(): Promise<Feedback[]> {
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "feedback.ndjson"),
      "utf8",
    );
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Feedback & { publicado?: boolean })
      .filter((f) => f.publicado !== false);
  } catch {
    return [];
  }
}

export async function getFeedbacks(): Promise<Feedback[]> {
  const sql = getSql();
  if (sql) {
    const rows = await sql`
      select nome, resultado, ambiente, atendimento, estrelas,
             created_at::text as created_at
      from feedback
      where publicado = true
      order by created_at desc
    `;
    return rows as unknown as Feedback[];
  }
  const items = await readFromFile();
  return items.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function feedbackStats(items: Feedback[]) {
  const count = items.length;
  const avg = count
    ? items.reduce((s, i) => s + Number(i.estrelas), 0) / count
    : 0;
  return { count, avg };
}
