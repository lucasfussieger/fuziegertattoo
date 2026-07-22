"use client";

import Image from "next/image";
import Link from "next/link";
import photo from "../assets/fuziegertattoo.webp";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Stars } from "@/components/stars";

type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function WhatsappIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.447h.006c6.585 0 11.946-5.359 11.949-11.945a11.82 11.82 0 00-3.495-8.4" />
    </svg>
  );
}

const links = [
  {
    label: "Instagram",
    hint: "@fuzieger.tattoo",
    href: "https://instagram.com/fuzieger.tattoo",
    icon: InstagramIcon,
  },
  {
    label: "WhatsApp",
    hint: "Fale direto comigo",
    href:
      "https://wa.me/5547999346074?text=" +
      encodeURIComponent(
        "Olá, tudo certo? Vi seu trabalho no Instagram e gostei muito, gostaria de agendar uma sessão",
      ),
    icon: WhatsappIcon,
  },
] as const;

export default function HomeClient({
  avg,
  count,
}: {
  avg: number;
  count: number;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-black font-sans text-zinc-50">
      {/* malha de dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
      />
      {/* glow vermelho no topo */}
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute -top-40 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-red-600/25 blur-[120px]"
      />

      <main className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 px-6 py-20">
        {/* header */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="animate-float relative">
            <div
              aria-hidden
              className="animate-glow-pulse-strong absolute inset-0 rounded-full bg-red-600/60 blur-2xl"
            />
            <Image
              className="animate-fade-up relative aspect-square rounded-full object-cover ring-2 ring-red-500/60 ring-offset-4 ring-offset-black"
              src={photo}
              alt="Lucas Fuzieger, tatuador"
              width={132}
              height={132}
              placeholder="blur"
              priority
            />
          </div>

          <div
            className="animate-fade-up flex flex-col items-center gap-3"
            style={{ animationDelay: "0.1s" }}
          >
            <h1 className="text-3xl font-bold tracking-tight">Lucas Fuzieger</h1>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["blackwork", "coberturas", "fineline"].map(
                (tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[8px] font-medium uppercase tracking-widest text-red-400"
                >
                  {tag}
                </span>
                ),
              )}
            </div>
          </div>

          {/* média de avaliações — só aparece se houver avaliação */}
          {count > 0 && (
            <div
              className="animate-fade-up flex flex-col items-center gap-2"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="flex items-center gap-2">
                <Stars value={avg} size={18} emptyClassName="text-zinc-700" />
                <span className="text-sm font-semibold text-red-500">
                  {avg.toFixed(1)}
                </span>
              </div>
              <Link
                href="/feedbacks"
                className="text-xs text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {`Ver ${count} avaliaç${count === 1 ? "ão" : "ões"}`}
              </Link>
            </div>
          )}
        </div>

        {/* links */}
        <nav className="flex w-full flex-col gap-3">
          {links.map((link, i) => {
            const { label, hint, icon: Icon } = link;
            const inner = (
              <>
                <Icon className="h-5 w-5 shrink-0 text-red-500" />
                <span className="flex flex-1 flex-col items-start leading-tight">
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs text-zinc-400">{hint}</span>
                </span>
                <ArrowUpRight className="h-6 w-6 shrink-0 text-zinc-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-red-400" />
              </>
            );
            const className =
              "animate-fade-up group flex w-full items-center gap-4 rounded-full border border-white/10 bg-zinc-900 px-4 py-3.5 text-left shadow-[inset_55px_0_60px_-18px_rgba(0,0,0,0.95)] transition-all duration-500 hover:-translate-y-0.5 hover:border-red-500/40 hover:bg-zinc-800 hover:shadow-[inset_55px_0_60px_-18px_rgba(0,0,0,0.95),0_8px_30px_-8px_rgba(220,38,38,0.5)]";
            const style = { animationDelay: `${0.2 + i * 0.08}s` };

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

        {/* onde atende */}
        <div
          className="animate-fade-up flex flex-col items-center gap-1 text-center"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300">
            <MapPin className="h-4 w-4 text-red-500" />
            Atendo em: Itapema e Bombinhas · SC
          </span>
          <span className="text-xs text-zinc-500">
            Somente com horário marcado
          </span>
        </div>

        <footer
          className="animate-fade-up pt-4 text-xs tracking-wide text-zinc-600"
          style={{ animationDelay: "0.6s" }}
        >
          © {new Date().getFullYear()} Lucas Fuzieger · Tatuador há + de 5 anos
        </footer>
      </main>
    </div>
  );
}
