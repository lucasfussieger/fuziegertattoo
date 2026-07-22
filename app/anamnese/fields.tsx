"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/* ---------------------------------- Flags --------------------------------- */

const FLAG = "block h-4 w-6 shrink-0 overflow-hidden rounded-sm ring-1 ring-black/10";

export function Flag({ code }: { code: string }) {
  switch (code) {
    case "BR":
      return (
        <svg viewBox="0 0 28 20" className={FLAG}>
          <rect width="28" height="20" fill="#009c3b" />
          <polygon points="14,2 26,10 14,18 2,10" fill="#ffdf00" />
          <circle cx="14" cy="10" r="4" fill="#002776" />
        </svg>
      );
    case "PT":
      return (
        <svg viewBox="0 0 28 20" className={FLAG}>
          <rect width="28" height="20" fill="#ff0000" />
          <rect width="11" height="20" fill="#006600" />
          <circle cx="11" cy="10" r="3.2" fill="#ffcc00" />
          <circle cx="11" cy="10" r="1.6" fill="#fff" />
        </svg>
      );
    case "US":
      return (
        <svg viewBox="0 0 28 20" className={FLAG}>
          <rect width="28" height="20" fill="#b22234" />
          {[1, 3, 5, 7, 9, 11].map((i) => (
            <rect key={i} y={(i * 20) / 13} width="28" height={20 / 13} fill="#fff" />
          ))}
          <rect width="12" height="11" fill="#3c3b6e" />
        </svg>
      );
    case "AR":
      return (
        <svg viewBox="0 0 28 20" className={FLAG}>
          <rect width="28" height="20" fill="#74acdf" />
          <rect y="6.66" width="28" height="6.66" fill="#fff" />
          <circle cx="14" cy="10" r="2" fill="#f6b40e" />
        </svg>
      );
    case "ES":
      return (
        <svg viewBox="0 0 28 20" className={FLAG}>
          <rect width="28" height="20" fill="#aa151b" />
          <rect y="5" width="28" height="10" fill="#f1bf00" />
        </svg>
      );
    case "IT":
      return (
        <svg viewBox="0 0 28 20" className={FLAG}>
          <rect width="28" height="20" fill="#ce2b37" />
          <rect width="18.66" height="20" fill="#fff" />
          <rect width="9.33" height="20" fill="#009246" />
        </svg>
      );
    case "FR":
      return (
        <svg viewBox="0 0 28 20" className={FLAG}>
          <rect width="28" height="20" fill="#ef4135" />
          <rect width="18.66" height="20" fill="#fff" />
          <rect width="9.33" height="20" fill="#0055a4" />
        </svg>
      );
    case "DE":
      return (
        <svg viewBox="0 0 28 20" className={FLAG}>
          <rect width="28" height="20" fill="#ffce00" />
          <rect width="28" height="13.33" fill="#dd0000" />
          <rect width="28" height="6.66" fill="#000" />
        </svg>
      );
    default:
      return <span className={FLAG} />;
  }
}

/* -------------------------------- Telefone -------------------------------- */

type Country = { code: string; name: string; dial: string };

const COUNTRIES: Country[] = [
  { code: "BR", name: "Brasil", dial: "+55" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "US", name: "Estados Unidos", dial: "+1" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "ES", name: "Espanha", dial: "+34" },
  { code: "IT", name: "Itália", dial: "+39" },
  { code: "FR", name: "França", dial: "+33" },
  { code: "DE", name: "Alemanha", dial: "+49" },
];

function formatBR(digits: string) {
  const d = digits.slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function parsePhone(value: string): { country: Country; digits: string } {
  if (!value) return { country: COUNTRIES[0], digits: "" };
  const dialPart = value.split(" ")[0];
  const country = COUNTRIES.find((c) => c.dial === dialPart) ?? COUNTRIES[0];
  const rest = value.slice(country.dial.length);
  return { country, digits: rest.replace(/\D/g, "").slice(0, 15) };
}

export function PhoneInput({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  const initial = parsePhone(value);
  const [country, setCountry] = useState<Country>(initial.country);
  const [digits, setDigits] = useState(initial.digits);
  const [open, setOpen] = useState(false);

  // mantém o valor do formulário sincronizado (dial + número, ou vazio)
  useEffect(() => {
    onChange(digits ? `${country.dial} ${display(country, digits)}` : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, digits]);

  function display(c: Country, raw: string) {
    return c.code === "BR" ? formatBR(raw) : raw;
  }

  return (
    <div className="relative">
      <div className="flex items-stretch overflow-hidden rounded-2xl border border-neutral-300 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 border-r border-neutral-200 bg-neutral-50 px-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
        >
          <Flag code={country.code} />
          <span>{country.dial}</span>
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        </button>
        <input
          autoFocus
          type="tel"
          inputMode="tel"
          value={display(country, digits)}
          onChange={(e) =>
            setDigits(e.target.value.replace(/\D/g, "").slice(0, 15))
          }
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          placeholder={country.code === "BR" ? "(47) 99999-9999" : "Número"}
          className="w-full bg-white px-4 py-4 text-lg text-neutral-900 outline-none placeholder:text-neutral-400"
        />
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-neutral-200 bg-white p-1 shadow-xl">
            {COUNTRIES.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    setCountry(c);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100"
                >
                  <Flag code={c.code} />
                  <span className="flex-1 text-neutral-800">{c.name}</span>
                  <span className="text-neutral-400">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/* --------------------------- Data de nascimento --------------------------- */

const CURRENT_YEAR = new Date().getFullYear();

function isValidDate(d: number, m: number, y: number) {
  if (!d || !m || !y) return false;
  if (m < 1 || m > 12 || d < 1 || y < 1900 || y > CURRENT_YEAR) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function DateOfBirthInput({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (iso: string) => void;
  onEnter: () => void;
}) {
  const parts = value.split("-"); // yyyy-mm-dd
  const [day, setDay] = useState(parts[2] ?? "");
  const [month, setMonth] = useState(parts[1] ?? "");
  const [year, setYear] = useState(parts[0] ?? "");

  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const d = Number(day);
    const m = Number(month);
    const y = Number(year);
    if (isValidDate(d, m, y)) {
      onChange(
        `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(
          d,
        ).padStart(2, "0")}`,
      );
    } else {
      onChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year]);

  const box =
    "rounded-2xl border border-neutral-300 bg-white py-4 text-center text-lg text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10";

  return (
    <div className="grid grid-cols-[1fr_1fr_1.4fr] items-center gap-3">
      <input
        autoFocus
        inputMode="numeric"
        maxLength={2}
        value={day}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, 2);
          setDay(v);
          if (v.length === 2) monthRef.current?.focus();
        }}
        placeholder="Dia"
        className={box}
      />
      <input
        ref={monthRef}
        inputMode="numeric"
        maxLength={2}
        value={month}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, 2);
          setMonth(v);
          if (v.length === 2) yearRef.current?.focus();
        }}
        placeholder="Mês"
        className={box}
      />
      <input
        ref={yearRef}
        inputMode="numeric"
        maxLength={4}
        value={year}
        onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder="Ano"
        className={box}
      />
    </div>
  );
}
