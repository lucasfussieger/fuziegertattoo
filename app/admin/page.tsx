import { getAnamneses, type Anamnese } from "@/lib/anamnese";

export const dynamic = "force-dynamic";

const HEALTH: { key: keyof Anamnese; label: string; detail?: keyof Anamnese }[] =
  [
    { key: "alergias", label: "Alergias", detail: "alergias_detalhe" },
    { key: "medicamentos", label: "Medicamentos", detail: "medicamentos_detalhe" },
    { key: "diabetes", label: "Diabetes" },
    { key: "problemas_cardiacos", label: "Problemas cardíacos" },
    { key: "problemas_coagulacao", label: "Problemas de coagulação" },
    {
      key: "doenca_infecciosa",
      label: "Doença infecciosa",
      detail: "doenca_infecciosa_detalhe",
    },
    { key: "epilepsia", label: "Epilepsia" },
    { key: "pressao_alta", label: "Pressão alta" },
    { key: "queloide", label: "Queloide" },
    { key: "gestante", label: "Gestante / amamentando" },
    { key: "alcool_drogas_24h", label: "Álcool/drogas 24h" },
    { key: "problemas_pele", label: "Problemas de pele", detail: "problemas_pele_detalhe" },
  ];

function fmtData(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

function fmtDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const items = await getAnamneses();

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-sans text-neutral-900">
      <main className="mx-auto w-full max-w-2xl px-5 py-12">
        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Anamneses</h1>
          <span className="text-sm text-neutral-500">
            {items.length} ficha{items.length === 1 ? "" : "s"}
          </span>
        </div>

        {items.length === 0 && (
          <p className="py-16 text-center text-sm text-neutral-400">
            Nenhuma ficha recebida ainda.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {items.map((a, i) => {
            const flags = HEALTH.filter((h) => a[h.key] === true);
            return (
              <article
                key={a.id ?? i}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{a.nome}</h2>
                    <p className="text-sm text-neutral-600">{a.telefone}</p>
                  </div>
                  <div className="text-right text-xs text-neutral-400">
                    <div>Nasc.: {fmtData(a.data_nascimento)}</div>
                    <div>{fmtDataHora(a.created_at)}</div>
                  </div>
                </div>

                <div className="mt-4">
                  {flags.length === 0 ? (
                    <p className="text-sm text-neutral-400">
                      Sem observações de saúde.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {flags.map((h) => {
                        const detalhe = h.detail
                          ? (a[h.detail] as string | null)
                          : null;
                        return (
                          <li key={h.key} className="text-sm">
                            <span className="inline-block rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                              {h.label}
                            </span>
                            {detalhe && (
                              <span className="ml-2 text-neutral-600">
                                {detalhe}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="mt-4 border-t border-neutral-100 pt-3 text-xs text-neutral-400">
                  {a.consentimento
                    ? "✓ Consentimento confirmado"
                    : "✗ Sem consentimento"}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
