import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getSql } from "@/lib/db";

export const runtime = "nodejs";

type Payload = {
  nome?: string;
  telefone?: string;
  data_nascimento?: string;
  alergias?: boolean;
  alergias_detalhe?: string;
  medicamentos?: boolean;
  medicamentos_detalhe?: string;
  diabetes?: boolean;
  problemas_cardiacos?: boolean;
  problemas_coagulacao?: boolean;
  doenca_infecciosa?: boolean;
  doenca_infecciosa_detalhe?: string;
  epilepsia?: boolean;
  pressao_alta?: boolean;
  queloide?: boolean;
  gestante?: boolean;
  alcool_drogas_24h?: boolean;
  problemas_pele?: boolean;
  problemas_pele_detalhe?: string;
  consentimento?: boolean;
};

const bool = (v: unknown) => v === true;
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
  const telefone = str(data.telefone);

  if (!nome) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }
  if (!telefone) {
    return NextResponse.json(
      { error: "Telefone é obrigatório." },
      { status: 400 },
    );
  }
  if (!bool(data.consentimento)) {
    return NextResponse.json(
      { error: "É necessário concordar com o procedimento." },
      { status: 400 },
    );
  }

  const record = {
    nome,
    telefone,
    data_nascimento: str(data.data_nascimento),
    alergias: bool(data.alergias),
    alergias_detalhe: str(data.alergias_detalhe),
    medicamentos: bool(data.medicamentos),
    medicamentos_detalhe: str(data.medicamentos_detalhe),
    diabetes: bool(data.diabetes),
    problemas_cardiacos: bool(data.problemas_cardiacos),
    problemas_coagulacao: bool(data.problemas_coagulacao),
    doenca_infecciosa: bool(data.doenca_infecciosa),
    doenca_infecciosa_detalhe: str(data.doenca_infecciosa_detalhe),
    epilepsia: bool(data.epilepsia),
    pressao_alta: bool(data.pressao_alta),
    queloide: bool(data.queloide),
    gestante: bool(data.gestante),
    alcool_drogas_24h: bool(data.alcool_drogas_24h),
    problemas_pele: bool(data.problemas_pele),
    problemas_pele_detalhe: str(data.problemas_pele_detalhe),
    consentimento: true,
  };

  try {
    const sql = getSql();

    if (sql) {
      const [row] = await sql`
        insert into anamnese ${sql(record)}
        returning id
      `;
      return NextResponse.json({ ok: true, id: row.id, persisted: "postgres" });
    }

    // Sem DATABASE_URL: grava em arquivo local só para testes.
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "anamnese.ndjson"),
      JSON.stringify({ ...record, created_at: new Date().toISOString() }) + "\n",
      "utf8",
    );
    return NextResponse.json({ ok: true, persisted: "file" });
  } catch (err) {
    console.error("Falha ao salvar anamnese:", err);
    return NextResponse.json(
      { error: "Não foi possível salvar. Tente novamente." },
      { status: 500 },
    );
  }
}
