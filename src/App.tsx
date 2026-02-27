import { useEffect, useMemo, useRef, useState } from "react";
import { TopBar } from "./components/TopBar";
import { EvolutionChainCard } from "./components/EvolutionChainCard";
import type { EvolutionChainVM, NamedAPIResource } from "./types/pokeapi";
import {
  getEvolutionChainList,
  getChainVMByChainUrl,
  getChainVMByPokemonName,
  withMinimumDelay,
} from "./lib/pokeapi";

type CardState =
  | { id: string; status: "loading"; title?: string }
  | { id: string; status: "error"; title?: string; message: string }
  | { id: string; status: "ready"; data: EvolutionChainVM };

const MAX_CHAINS = 20;

export default function App() {
  const [cards, setCards] = useState<CardState[]>([]);
  const [searchingCount, setSearchingCount] = useState(0);

  const [query, setQuery] = useState("");

  const [filterChainKey, setFilterChainKey] = useState<string | null>(null);

  const [activeSearchCardId, setActiveSearchCardId] = useState<string | null>(
    null,
  );

  const existingKeysRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const s = new Set<string>();
    for (const c of cards) if (c.status === "ready") s.add(c.data.key);
    existingKeysRef.current = s;
  }, [cards]);

  const loadedCount = useMemo(
    () => cards.filter((c) => c.status === "ready").length,
    [cards],
  );

  const visibleCards = useMemo(() => {
    const q = query.trim();
    if (!q) return cards;

    if (filterChainKey) {
      return cards.filter(
        (c) => c.status === "ready" && c.data.key === filterChainKey,
      );
    }

    if (activeSearchCardId) {
      return cards.filter((c) => c.id === activeSearchCardId);
    }

    return cards;
  }, [cards, query, filterChainKey, activeSearchCardId]);

  function handleQueryChange(v: string) {
    setQuery(v);
    if (!v.trim()) {
      setFilterChainKey(null);
      setActiveSearchCardId(null);
    }
  }

  useEffect(() => {
    let alive = true;

    async function load() {
      const list = await getEvolutionChainList(MAX_CHAINS);

      const placeholders: CardState[] = list.results.map((r, i) => ({
        id: `init-${i}-${r.url}`,
        status: "loading",
      }));

      if (!alive) return;
      setCards(placeholders);

      await Promise.all(
        list.results.map(async (r: NamedAPIResource, idx: number) => {
          try {
            const vm = await getChainVMByChainUrl(r.url);
            if (!alive) return;

            setCards((prev) => {
              const next = [...prev];
              next[idx] = {
                id: prev[idx]?.id ?? `init-${idx}`,
                status: "ready",
                data: vm,
              };
              return next;
            });
          } catch (e) {
            const msg = e instanceof Error ? e.message : "Falha ao carregar";
            if (!alive) return;
            setCards((prev) => {
              const next = [...prev];
              next[idx] = {
                id: prev[idx]?.id ?? `init-${idx}`,
                status: "error",
                message: msg,
              };
              return next;
            });
          }
        }),
      );
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  async function handleSearch(normalizedName: string) {
    setSearchingCount((n) => n + 1);

    setQuery(normalizedName);

    const tempId = `search-${Date.now()}-${normalizedName}`;
    setActiveSearchCardId(tempId);
    setFilterChainKey(null);

    setCards((prev) => [
      { id: tempId, status: "loading", title: `Buscando: ${normalizedName}` },
      ...prev,
    ]);

    try {
      const vm = await withMinimumDelay(
        getChainVMByPokemonName(normalizedName),
        350,
      );

      if (existingKeysRef.current.has(vm.key)) {
        setCards((prev) => prev.filter((c) => c.id !== tempId));
        setActiveSearchCardId(null);
        setFilterChainKey(vm.key);
        return;
      }

      setCards((prev) =>
        prev.map((c) =>
          c.id === tempId ? { id: tempId, status: "ready", data: vm } : c,
        ),
      );
      setActiveSearchCardId(null);
      setFilterChainKey(vm.key);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message.includes("404")
            ? "Pokémon não encontrado."
            : e.message
          : "Falha na busca.";

      setCards((prev) =>
        prev.map((c) =>
          c.id === tempId
            ? {
                id: tempId,
                status: "error",
                title: `Busca: ${normalizedName}`,
                message: msg,
              }
            : c,
        ),
      );
      setFilterChainKey(null);
      setActiveSearchCardId(tempId);
    } finally {
      setSearchingCount((n) => Math.max(0, n - 1));
    }
  }

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(70%_55%_at_20%_20%,rgba(168,85,247,0.18),transparent_60%),radial-gradient(70%_55%_at_80%_30%,rgba(34,197,94,0.12),transparent_60%),linear-gradient(to_bottom,rgba(2,6,23,1),rgba(15,23,42,1))]" />

      <TopBar
        total={MAX_CHAINS}
        loaded={loadedCount}
        searching={searchingCount > 0}
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((c) => (
            <EvolutionChainCard
              key={c.id}
              {...(c.status === "ready"
                ? { status: "ready", data: c.data }
                : c.status === "loading"
                  ? { status: "loading", title: c.title }
                  : { status: "error", title: c.title, message: c.message })}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
