import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSql } from "./db";

export type Anamnese = {
  id?: string;
  created_at: string;
  nome: string;
  telefone: string;
  data_nascimento: string | null;
  alergias: boolean;
  alergias_detalhe: string | null;
  medicamentos: boolean;
  medicamentos_detalhe: string | null;
  diabetes: boolean;
  problemas_cardiacos: boolean;
  problemas_coagulacao: boolean;
  doenca_infecciosa: boolean;
  doenca_infecciosa_detalhe: string | null;
  epilepsia: boolean;
  pressao_alta: boolean;
  queloide: boolean;
  gestante: boolean;
  alcool_drogas_24h: boolean;
  problemas_pele: boolean;
  problemas_pele_detalhe: string | null;
  consentimento: boolean;
};

async function readFromFile(): Promise<Anamnese[]> {
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "anamnese.ndjson"),
      "utf8",
    );
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Anamnese)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  } catch {
    return [];
  }
}

export async function getAnamneses(): Promise<Anamnese[]> {
  const sql = getSql();
  if (sql) {
    const rows = await sql`
      select
        id,
        created_at::text as created_at,
        nome,
        telefone,
        to_char(data_nascimento, 'YYYY-MM-DD') as data_nascimento,
        alergias, alergias_detalhe,
        medicamentos, medicamentos_detalhe,
        diabetes, problemas_cardiacos, problemas_coagulacao,
        doenca_infecciosa, doenca_infecciosa_detalhe,
        epilepsia, pressao_alta, queloide, gestante,
        alcool_drogas_24h, problemas_pele, problemas_pele_detalhe,
        consentimento
      from anamnese
      order by created_at desc
    `;
    return rows as unknown as Anamnese[];
  }
  return readFromFile();
}
