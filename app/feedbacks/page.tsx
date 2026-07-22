import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFeedbacks, feedbackStats } from "@/lib/feedback";
import { Stars } from "@/components/stars";

export const dynamic = "force-dynamic";

function tempoRelativo(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function FeedbacksPage() {
  const items = await getFeedbacks();
  const { avg, count } = feedbackStats(items);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-white font-sans text-neutral-900">
      <main className="relative z-10 flex w-full max-w-md flex-1 flex-col px-6 py-16">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 text-xs font-semibold text-neutral-800 transition-colors hover:border-red-200 hover:bg-red-50/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
        </div>
        <h2 className="mt-2 text-sm font-semibold uppercase tracking-widest text-neutral-900">
          Avaliações
        </h2>

        {/* resumo */}
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <div className="flex flex-col">
            <span className="text-3xl font-bold tracking-tight">
              {count ? avg.toFixed(1) : "—"}
            </span>
            <span className="text-xs text-neutral-500">
              {count} avaliaç{count === 1 ? "ão" : "ões"}
            </span>
          </div>
          <Stars value={avg} size={22} />
        </div>

        {/* lista */}
        <div className="mt-6 flex flex-col gap-3">
          {items.length === 0 && (
            <p className="py-10 text-center text-sm text-neutral-400">
              Ainda não há avaliações.
            </p>
          )}

          {items.map((f, i) => (
            <article
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{f.nome}</span>
                <Stars value={f.estrelas} size={16} />
              </div>

              {(f.resultado || f.ambiente || f.atendimento) && (
                <div className="flex flex-col gap-2 text-sm text-neutral-600">
                  {f.resultado && (
                    <p>
                      <span className="text-neutral-400">Resultado: </span>
                      {f.resultado}
                    </p>
                  )}
                  {f.ambiente && (
                    <p>
                      <span className="text-neutral-400">Ambiente: </span>
                      {f.ambiente}
                    </p>
                  )}
                  {f.atendimento && (
                    <p>
                      <span className="text-neutral-400">Atendimento: </span>
                      {f.atendimento}
                    </p>
                  )}
                </div>
              )}

              <span className="text-xs text-neutral-400">
                {tempoRelativo(f.created_at)}
              </span>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
