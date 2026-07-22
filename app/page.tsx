"use client";

import { useState } from "react";
import Image from "next/image";
import photo from "../assets/fuziegertattoo.webp";
import {
  Camera,
  MessageCircle,
  MapPin,
  ArrowUpRight,
  X,
} from "lucide-react";

const links = [
  {
    label: "Instagram",
    hint: "@fuzieger.tattoo",
    href: "https://instagram.com/fuzieger.tattoo",
    icon: Camera,
  },
  {
    label: "WhatsApp",
    hint: "Fale direto comigo",
    href:
      "https://wa.me/5547999346074?text=" +
      encodeURIComponent(
        "Olá, tudo certo? Vi seu trabalho no Instagram e gostei muito, gostaria de agendar uma sessão",
      ),
    icon: MessageCircle,
  },
  {
    label: "Estúdio",
    hint: "Pontos de atendimento",
    icon: MapPin,
    modal: true,
  },
] as const;

export default function Home() {
  const [studioOpen, setStudioOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-neutral-950 font-sans text-white">
      {/* glow de fundo */}
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-600/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.06),transparent_60%)]"
      />

      <main className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 px-6 py-20">
        {/* header */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="animate-float relative">
            <div
              aria-hidden
              className="animate-glow-pulse absolute inset-0 rounded-full bg-red-600/50 blur-2xl"
            />
            <Image
              className="animate-fade-up relative aspect-square rounded-full object-cover ring-2 ring-red-500/60 ring-offset-4 ring-offset-neutral-950"
              src={photo}
              alt="Lucas Fuzieger, tatuador"
              width={168}
              height={168}
              placeholder="blur"
              priority
            />
          </div>

          <div
            className="animate-fade-up flex flex-col items-center gap-3"
            style={{ animationDelay: "0.1s" }}
          >
            <h1 className="text-3xl font-bold tracking-tight">
              Lucas Fuzieger
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-300 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Tatuador há 5 anos
            </span>
          </div>
        </div>

        {/* links */}
        <nav className="flex w-full flex-col gap-3">
          {links.map((link, i) => {
            const { label, hint, icon: Icon } = link;
            const inner = (
              <>
                <Icon className="h-5 w-5 shrink-0 text-red-400 transition-colors group-hover:text-red-500" aria-hidden />
                <span className="flex flex-1 flex-col items-start leading-tight">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs text-neutral-400">{hint}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-neutral-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-red-400" />
              </>
            );
            const className =
              "animate-fade-up group flex w-full items-center gap-4 rounded-full bg-zinc-900 px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-[0_8px_30px_-8px_rgba(220,38,38,0.5)]";
            const style = { animationDelay: `${0.2 + i * 0.08}s` };

            if ("modal" in link) {
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStudioOpen(true)}
                  style={style}
                  className={className}
                >
                  {inner}
                </button>
              );
            }
            return (
              <a
                key={label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={style}
                className={className}
              >
                {inner}
              </a>
            );
          })}
        </nav>

        <footer
          className="animate-fade-up pt-4 text-xs tracking-wide text-neutral-600"
          style={{ animationDelay: "0.6s" }}
        >
          © {new Date().getFullYear()} Lucas Fuzieger · Tattoo Studio
        </footer>
      </main>

      {/* modal estúdio */}
      {studioOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="studio-title"
          onClick={() => setStudioOpen(false)}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* card */}
          <div
            className="animate-pop relative w-full max-w-sm overflow-hidden rounded-3xl bg-neutral-950 p-7 shadow-[0_30px_80px_-20px_rgba(220,38,38,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setStudioOpen(false)}
              aria-label="Fechar"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-neutral-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex flex-col items-center gap-6 text-center">
              <div className="animate-float flex h-16 w-16 items-center justify-center rounded-full bg-red-600/15 text-red-400">
                <MapPin className="h-7 w-7" />
              </div>

              <div className="flex flex-col items-center gap-3">
                <h2 id="studio-title" className="text-2xl font-bold tracking-tight">
                  Pontos de atendimento
                </h2>                 
              </div>

              <div className="flex w-full flex-col gap-3">
                {["Itapema", "Bombinhas"].map((city) => (
                  <div
                    key={city}
                    className="group flex items-center gap-4 rounded-full bg-zinc-900 px-4 py-3 transition-colors hover:bg-zinc-800"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/15 text-red-400 transition-colors group-hover:bg-red-600 group-hover:text-white">
                      <MapPin className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="flex flex-1 flex-col items-start leading-tight">
                      <span className="text-sm font-semibold">{city}</span>
                      <span className="text-xs text-neutral-400">
                        Santa Catarina
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs uppercase tracking-widest text-white">
                Atendimento somente com horário marcado
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
