"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, Star } from "lucide-react";

type Values = {
  nome: string;
  resultado: string;
  ambiente: string;
  atendimento: string;
  estrelas: number;
};

type FieldStep = {
  kind: "text" | "textarea";
  key: "nome" | "resultado" | "ambiente" | "atendimento";
  title: string;
  subtitle?: string;
  placeholder?: string;
  required?: boolean;
};

const steps: (FieldStep | { kind: "stars"; title: string; subtitle?: string })[] =
  [
    {
      kind: "text",
      key: "nome",
      title: "Qual é o seu nome?",
      required: true,
      placeholder: "Seu nome",
    },
    {
      kind: "textarea",
      key: "resultado",
      title: "O que você achou do resultado?",
      subtitle: "A tatuagem em si — traço, cicatrização, acabamento.",
      placeholder: "Conte como ficou…",
    },
    {
      kind: "textarea",
      key: "ambiente",
      title: "E do ambiente do estúdio?",
      subtitle: "Higiene, conforto, clima do lugar.",
      placeholder: "O que achou do espaço…",
    },
    {
      kind: "textarea",
      key: "atendimento",
      title: "Como foi o atendimento?",
      subtitle: "Do primeiro contato até o pós.",
      placeholder: "Conte sobre o atendimento…",
    },
    {
      kind: "stars",
      title: "Sua nota final",
      subtitle: "Toque nas estrelas para avaliar.",
    },
  ];

export default function FeedbackPage() {
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Values>({
    nome: "",
    resultado: "",
    ambiente: "",
    atendimento: "",
    estrelas: 0,
  });
  const [hover, setHover] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const step = steps[index];
  const total = steps.length;
  const progress = done ? 100 : Math.round((index / total) * 100);

  const isValid = useMemo(() => {
    if (step.kind === "stars") return values.estrelas >= 1;
    if (step.required) return values[step.key].trim().length > 0;
    return true;
  }, [step, values]);

  const advanceStep = () => {
    setAdvancing(true);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setAdvancing(false);
    }, 450);
  };

  const goBack = () => {
    setError(null);
    setIndex((i) => Math.max(0, i - 1));
  };

  const goNext = () => {
    if (!isValid || advancing || submitting) return;
    setError(null);
    if (index === total - 1) {
      submit();
      return;
    }
    advanceStep();
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Falha ao enviar.");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-white font-sans text-neutral-900">
      <div className="fixed inset-x-0 top-0 z-20 h-1 bg-neutral-100">
        <div
          className={`h-full bg-red-600 transition-all duration-500 ease-out ${
            advancing || submitting ? "animate-pulse" : ""
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="relative z-10 flex w-full max-w-md flex-1 flex-col px-6 py-16">
        <div className="flex items-center text-xs text-neutral-400">
          <Link href="/" className="transition-colors hover:text-neutral-900">
            Fuzieger Tattoo
          </Link>
        </div>
        <h2 className="mt-2 text-sm font-semibold uppercase tracking-widest text-neutral-900">
          Avaliação
        </h2>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Check className="h-10 w-10" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Obrigado pela avaliação!
              </h1>
              <p className="text-sm text-neutral-500">
                Seu feedback ajuda muito. 🖤
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/feedbacks"
                className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100"
              >
                Ver avaliações
              </Link>
              <Link
                href="/"
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                Início
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center">
            <div key={index} className="animate-fade-up flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold leading-tight tracking-tight">
                  {step.title}
                </h1>
                {step.subtitle && (
                  <p className="text-sm text-neutral-500">{step.subtitle}</p>
                )}
              </div>

              {step.kind === "text" && (
                <input
                  autoFocus
                  type="text"
                  value={values[step.key]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [step.key]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && goNext()}
                  placeholder={step.placeholder}
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-lg text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                />
              )}

              {step.kind === "textarea" && (
                <textarea
                  autoFocus
                  rows={4}
                  value={values[step.key]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [step.key]: e.target.value }))
                  }
                  placeholder={step.placeholder}
                  className="w-full resize-none rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                />
              )}

              {step.kind === "stars" && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const active = (hover || values.estrelas) >= n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onMouseEnter={() => setHover(n)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() =>
                            setValues((v) => ({ ...v, estrelas: n }))
                          }
                          className="transition-transform hover:scale-110"
                          aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                        >
                          <Star
                            className={
                              active ? "text-red-600" : "text-neutral-300"
                            }
                            fill={active ? "currentColor" : "none"}
                            strokeWidth={1.5}
                            size={40}
                          />
                        </button>
                      );
                    })}
                  </div>
                  {values.estrelas > 0 && (
                    <span className="text-sm font-medium text-neutral-500">
                      {values.estrelas} de 5
                    </span>
                  )}
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>
        )}

        {!done && (
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={index === 0 || advancing || submitting}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!isValid || advancing || submitting}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {advancing || submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : index === total - 1 ? (
                "Enviar avaliação"
              ) : (
                <>
                  Confirmar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
