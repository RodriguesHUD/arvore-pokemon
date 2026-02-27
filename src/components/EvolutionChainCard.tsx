import type { EvolutionChainVM } from "../types/pokeapi";

type Props =
  | { status: "loading"; title?: string }
  | { status: "error"; title?: string; message: string }
  | { status: "ready"; data: EvolutionChainVM; highlight?: boolean };

const gradients = [
  "from-emerald-400/35 via-emerald-700/20 to-slate-950/30",
  "from-rose-400/35 via-rose-700/20 to-slate-950/30",
  "from-sky-400/35 via-sky-700/20 to-slate-950/30",
  "from-amber-300/35 via-amber-600/20 to-slate-950/30",
  "from-violet-400/35 via-violet-700/20 to-slate-950/30",
  "from-slate-200/20 via-slate-500/20 to-slate-950/30",
];

function pickGradient(key: string) {
  const n = Number.parseInt(key, 10);
  const idx = Number.isFinite(n)
    ? n % gradients.length
    : key.length % gradients.length;
  return gradients[idx];
}

function formatKg(kg: number | null) {
  if (kg == null) return "—";
  const s = kg.toFixed(1);
  return s.endsWith(".0") ? `${s.slice(0, -2)}kg` : `${s}kg`;
}

export function EvolutionChainCard(props: Props) {
  if (props.status === "loading") {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="h-5 w-44 animate-pulse rounded bg-white/15" />
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="h-24 animate-pulse rounded-xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    );
  }

  if (props.status === "error") {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="text-sm font-semibold text-white">
          {props.title ?? "Erro"}
        </div>
        <p className="mt-2 text-sm text-rose-200">{props.message}</p>
      </div>
    );
  }

  const { data } = props;
  const gradient = pickGradient(data.key);

  return (
    <div
      data-chain-key={data.key}
      className={[
        "relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.30)]",
        props.highlight ? "ring-2 ring-amber-300/80" : "",
      ].join(" ")}
    >
      <div className={`absolute inset-0 bg-linear-to-br ${gradient}`} />

      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />

      <div className="relative p-4">
        <div className="text-sm font-semibold text-white/95">{data.title}</div>

        <div
          className="mt-4 flex flex-col gap-3"
          style={{
            gridTemplateColumns: `repeat(${Math.min(3, data.stages.length)}, minmax(0, 1fr))`,
          }}
        >
          {data.stages.slice(0, 3).map((stage, idx) => (
            <div key={idx} className="rounded-xl border border-white/10">
              <div className="flex flex-col gap-2">
                {stage.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-2 py-2"
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-white/10">
                      {p.spriteUrl ? (
                        <img
                          src={p.spriteUrl}
                          alt={p.name}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0 leading-tight">
                      <div className="truncate text-sm font-semibold capitalize text-white">
                        {p.name}
                      </div>
                      <div className="text-xs text-white/70">
                        {formatKg(p.weightKg)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {data.stages.length > 3 ? (
          <div className="mt-2 text-xs text-white/70">
            +{data.stages.length - 3} estágio(s) (oculto no layout compacto)
          </div>
        ) : null}
      </div>
    </div>
  );
}
