import { Star } from "lucide-react";

type Level = "full" | "half" | "empty";

/** Estrelas somente-leitura: cheias + meia estrela, arredondando para 0,5. */
export function Stars({
  value,
  size = 20,
  emptyClassName = "text-neutral-200",
}: {
  value: number;
  size?: number;
  emptyClassName?: string;
}) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div className="inline-flex gap-0.5" aria-label={`${value.toFixed(1)} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const diff = rounded - i;
        const level: Level = diff >= 1 ? "full" : diff === 0.5 ? "half" : "empty";
        return (
          <StarSlot key={i} size={size} level={level} emptyClassName={emptyClassName} />
        );
      })}
    </div>
  );
}

function StarSlot({
  size,
  level,
  emptyClassName,
}: {
  size: number;
  level: Level;
  emptyClassName: string;
}) {
  if (level === "full") {
    return (
      <Star size={size} strokeWidth={1.5} className="text-red-600" fill="currentColor" />
    );
  }
  if (level === "empty") {
    return <Star size={size} strokeWidth={1.5} className={emptyClassName} fill="none" />;
  }
  // meia estrela: vazada por baixo, metade preenchida por cima
  return (
    <span
      className="relative inline-flex"
      style={{ width: size, height: size }}
    >
      <Star
        size={size}
        strokeWidth={1.5}
        className={`absolute inset-0 ${emptyClassName}`}
        fill="none"
      />
      <span
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: size / 2 }}
      >
        <Star size={size} strokeWidth={1.5} className="text-red-600" fill="currentColor" />
      </span>
    </span>
  );
}
