import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

type Payload = {
  nome?: string;
  resultado?: string;
  ambiente?: string;
  atendimento?: string;
  estrelas?: number;
};

const str = (v: unknown) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
};

export async function POST(request: Request) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const nome = str(data.nome);
  const estrelas = Number(data.estrelas);

  if (!nome) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }
  if (!Number.isInteger(estrelas) || estrelas < 1 || estrelas > 5) {
    return NextResponse.json(
      { error: "Dê uma nota de 1 a 5 estrelas." },
      { status: 400 },
    );
  }

  const record = {
    nome,
    resultado: str(data.resultado),
    ambiente: str(data.ambiente),
    atendimento: str(data.atendimento),
    estrelas,
  };

  try {
    const sql = getSql();

    if (sql) {
      await sql`insert into feedback ${sql(record)}`;
      return NextResponse.json({ ok: true, persisted: "postgres" });
    }

    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "feedback.ndjson"),
      JSON.stringify({
        ...record,
        publicado: true,
        created_at: new Date().toISOString(),
      }) + "\n",
      "utf8",
    );
    return NextResponse.json({ ok: true, persisted: "file" });
  } catch (err) {
    console.error("Falha ao salvar feedback:", err);
    return NextResponse.json(
      { error: "Não foi possível salvar. Tente novamente." },
      { status: 500 },
    );
  }
}
