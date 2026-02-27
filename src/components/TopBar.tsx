import { normalizePokemonQuery } from "../lib/normalize";

type Props = {
  total: number;
  loaded: number;
  searching: boolean;
  query: string;
  onQueryChange: (v: string) => void;
  onSearch: (normalized: string) => void;
};

export function TopBar({
  total,
  loaded,
  searching,
  query,
  onQueryChange,
  onSearch,
}: Props) {
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizePokemonQuery(query);
    if (!normalized) return;
    onSearch(normalized);
  }

  return (
    <header className="sticky top-0 z-20">
      <div className="mx-auto w-full max-w-285 px-4 py-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/90">
                <span className="opacity-70">Max Chains:</span>{" "}
                <span className="font-semibold">{total}</span>
              </div>

              <div className="text-white">
                <div className="text-lg font-semibold leading-tight">
                  Pokémon Evolution Chains
                </div>
                <div className="text-xs text-white/70">
                  Carregadas: <span className="font-semibold">{loaded}</span>/
                  {total}
                </div>
              </div>
            </div>

            <form
              onSubmit={submit}
              className="flex w-full max-w-xl items-center gap-2"
            >
              <div className="relative w-full">
                <input
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Pesquisar pokémon (ex: pikachu, mr mime, ho oh)"
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-md focus:border-white/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {searching ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
                  ) : (
                    <span className="text-white/60">⌕</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="rounded-xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400/80 transition-all"
              style={{
                width: `${Math.round((loaded / Math.max(1, total)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
