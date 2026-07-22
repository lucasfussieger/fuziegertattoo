"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { PhoneInput, DateOfBirthInput } from "./fields";

type Answers = Record<string, string | boolean | undefined>;

type Step =
  | {
      kind: "text" | "tel" | "date" | "phone" | "dob";
      key: string;
      title: string;
      subtitle?: string;
      placeholder?: string;
      required?: boolean;
    }
  | {
      kind: "boolean";
      key: string;
      title: string;
      subtitle?: string;
      detailKey?: string;
      detailPlaceholder?: string;
    }
  | { kind: "consent"; key: string; title: string; subtitle?: string };

const steps: Step[] = [
  { kind: "text", key: "nome", title: "Qual é o seu nome completo?", required: true, placeholder: "Nome e sobrenome" },
  { kind: "phone", key: "telefone", title: "Seu telefone / WhatsApp", required: true },
  { kind: "dob", key: "data_nascimento", title: "Data de nascimento", required: true },
  {
    kind: "boolean",
    key: "alergias",
    title: "Você possui alguma alergia?",
    subtitle: "Látex, tintas, anestésicos, medicamentos…",
    detailKey: "alergias_detalhe",
    detailPlaceholder: "Quais alergias?",
  },
  {
    kind: "boolean",
    key: "medicamentos",
    title: "Faz uso de algum medicamento?",
    detailKey: "medicamentos_detalhe",
    detailPlaceholder: "Quais medicamentos?",
  },
  { kind: "boolean", key: "diabetes", title: "Você é diabético(a)?" },
  { kind: "boolean", key: "problemas_cardiacos", title: "Possui problemas cardíacos?" },
  {
    kind: "boolean",
    key: "problemas_coagulacao",
    title: "Tem problemas de coagulação?",
    subtitle: "Hemofilia ou uso de anticoagulantes",
  },
  {
    kind: "boolean",
    key: "doenca_infecciosa",
    title: "Possui alguma doença infecciosa?",
    subtitle: "Hepatite, HIV ou outras",
    detailKey: "doenca_infecciosa_detalhe",
    detailPlaceholder: "Qual?",
  },
  { kind: "boolean", key: "epilepsia", title: "Tem epilepsia ou convulsões?" },
  { kind: "boolean", key: "pressao_alta", title: "Possui pressão alta?" },
  {
    kind: "boolean",
    key: "queloide",
    title: "Tem tendência a queloide?",
    subtitle: "Cicatrização exagerada da pele",
  },
  { kind: "boolean", key: "gestante", title: "Está grávida ou amamentando?" },
  {
    kind: "boolean",
    key: "alcool_drogas_24h",
    title: "Consumiu álcool ou drogas nas últimas 24h?",
  },
  {
    kind: "boolean",
    key: "problemas_pele",
    title: "Problemas de pele na região a tatuar?",
    subtitle: "Feridas, manchas, irritações",
    detailKey: "problemas_pele_detalhe",
    detailPlaceholder: "Descreva",
  },
  {
    kind: "consent",
    key: "consentimento",
    title: "Confirmação e consentimento",
    subtitle:
      "Declaro que as informações acima são verdadeiras e concordo em realizar o procedimento de tatuagem.",
  },
];

export default function AnamnesePage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [advancing, setAdvancing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const step = steps[index];
  const total = steps.length;
  const progress = done ? 100 : Math.round((index / total) * 100);

  const set = (key: string, value: string | boolean) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const isValid = useMemo(() => {
    if (step.kind !== "boolean" && step.kind !== "consent") {
      const v = answers[step.key];
      return !step.required || (typeof v === "string" && v.trim().length > 0);
    }
    if (step.kind === "boolean") return typeof answers[step.key] === "boolean";
    if (step.kind === "consent") return answers[step.key] === true;
    return false;
  }, [step, answers]);

  const goBack = () => {
    setError(null);
    setIndex((i) => Math.max(0, i - 1));
  };

  // "carregando a cada input" e avança
  const advanceStep = () => {
    setAdvancing(true);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setAdvancing(false);
    }, 450);
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

  // Sim/Não: clicar já passa pro próximo (a não ser que "Sim" abra detalhe)
  const selectBoolean = (val: boolean) => {
    if (advancing || submitting || step.kind !== "boolean") return;
    setError(null);
    set(step.key, val);
    const willShowDetail = val === true && !!step.detailKey;
    if (!willShowDetail) advanceStep();
  };

  const showConfirm =
    step.kind !== "boolean" ||
    (!!step.detailKey && answers[step.key] === true);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/anamnese", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
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
      {/* barra de progresso / carregando (único detalhe vermelho) */}
      <div className="fixed inset-x-0 top-0 z-20 h-1 bg-neutral-100">
        <div
          className={`h-full bg-red-600 transition-all duration-500 ease-out ${
            advancing || submitting ? "animate-pulse" : ""
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="relative z-10 flex w-full max-w-md flex-1 flex-col px-6 py-16">
        {/* topo */}
        <div className="flex items-center text-xs text-neutral-400">
          <Link href="/" className="shrink-0 transition-colors hover:text-neutral-900">
            Fuzieger Tattoo
          </Link>
        </div>
        <h2 className="mt-2 text-sm font-semibold uppercase tracking-widest text-neutral-900">
          Ficha de anamnese
        </h2>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Check className="h-10 w-10" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Ficha enviada!</h1>
              <p className="text-sm text-neutral-500">
                Recebi seus dados. Nos falamos pelo WhatsApp para agendar. 🖤
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Voltar ao início
            </Link>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center">
            <div
              key={index}
              className="animate-fade-up flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold leading-tight tracking-tight">
                  {step.title}
                </h1>
                {step.subtitle && (
                  <p className="text-sm text-neutral-500">{step.subtitle}</p>
                )}
              </div>

              <StepField
                step={step}
                answers={answers}
                set={set}
                onEnter={goNext}
                onBoolean={selectBoolean}
              />

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>
        )}

        {/* botões */}
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
            {showConfirm && (
              <button
                type="button"
                onClick={goNext}
                disabled={!isValid || advancing || submitting}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {advancing || submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : index === total - 1 ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Confirmar e enviar
                  </>
                ) : (
                  <>
                    Confirmar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StepField({
  step,
  answers,
  set,
  onEnter,
  onBoolean,
}: {
  step: Step;
  answers: Answers;
  set: (key: string, value: string | boolean) => void;
  onEnter: () => void;
  onBoolean: (val: boolean) => void;
}) {
  if (step.kind === "phone") {
    return (
      <PhoneInput
        value={(answers[step.key] as string) ?? ""}
        onChange={(v) => set(step.key, v)}
        onEnter={onEnter}
      />
    );
  }

  if (step.kind === "dob") {
    return (
      <DateOfBirthInput
        value={(answers[step.key] as string) ?? ""}
        onChange={(v) => set(step.key, v)}
        onEnter={onEnter}
      />
    );
  }

  if (step.kind === "text" || step.kind === "tel" || step.kind === "date") {
    return (
      <input
        autoFocus
        type={step.kind === "text" ? "text" : step.kind}
        inputMode={step.kind === "tel" ? "tel" : undefined}
        value={(answers[step.key] as string) ?? ""}
        onChange={(e) => set(step.key, e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder={step.placeholder}
        className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-lg text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      />
    );
  }

  if (step.kind === "boolean") {
    const value = answers[step.key];
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Sim", val: true },
            { label: "Não", val: false },
          ].map((opt) => {
            const active = value === opt.val;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onBoolean(opt.val)}
                className={`h-14 rounded-2xl text-base font-semibold transition-colors ${
                  active
                    ? "bg-neutral-900 text-white"
                    : "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {step.detailKey && value === true && (
          <input
            autoFocus
            type="text"
            value={(answers[step.detailKey] as string) ?? ""}
            onChange={(e) => set(step.detailKey!, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
            placeholder={step.detailPlaceholder}
            className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-base text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
          />
        )}
      </div>
    );
  }

  // consent
  const checked = answers[step.key] === true;
  return (
    <button
      type="button"
      onClick={() => set(step.key, !checked)}
      className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition-colors ${
        checked
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-300 bg-white hover:bg-neutral-100"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
          checked ? "bg-neutral-900 text-white" : "border border-neutral-300 bg-white text-transparent"
        }`}
      >
        <Check className="h-4 w-4" />
      </span>
      <span className="text-sm text-neutral-700">{step.subtitle}</span>
    </button>
  );
}
