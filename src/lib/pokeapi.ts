import type {
  EvolutionChain,
  EvolutionChainVM,
  PaginatedResponse,
  Pokemon,
  PokemonSpecies,
  ChainLink,
  PokemonStage,
  NamedAPIResource,
} from "../types/pokeapi";

const BASE = "https://pokeapi.co/api/v2";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.json() as Promise<T>;
}

const pokemonCache = new Map<string, Pokemon>();
const speciesCache = new Map<string, PokemonSpecies>();
const chainCache = new Map<string, EvolutionChain>();

export async function getEvolutionChainList(
  limit = 20,
): Promise<PaginatedResponse<NamedAPIResource>> {
  return fetchJSON(`${BASE}/evolution-chain?limit=${limit}`);
}

export async function getEvolutionChainByUrl(
  url: string,
): Promise<EvolutionChain> {
  const key = url;
  const cached = chainCache.get(key);
  if (cached) return cached;

  const data = await fetchJSON<EvolutionChain>(url);
  chainCache.set(key, data);
  return data;
}

export async function getPokemon(name: string): Promise<Pokemon> {
  const key = name.toLowerCase();
  const cached = pokemonCache.get(key);
  if (cached) return cached;

  const data = await fetchJSON<Pokemon>(`${BASE}/pokemon/${key}`);
  pokemonCache.set(key, data);
  return data;
}

export async function getPokemonSpecies(name: string): Promise<PokemonSpecies> {
  const key = name.toLowerCase();
  const cached = speciesCache.get(key);
  if (cached) return cached;

  const data = await fetchJSON<PokemonSpecies>(
    `${BASE}/pokemon-species/${key}`,
  );
  speciesCache.set(key, data);
  return data;
}

export function extractStages(root: ChainLink): string[][] {
  const stages: string[][] = [];

  function walk(nodes: ChainLink[], depth: number) {
    if (!stages[depth]) stages[depth] = [];
    for (const n of nodes) {
      stages[depth].push(n.species.name);
    }
    const next: ChainLink[] = nodes.flatMap((n) => n.evolves_to ?? []);
    if (next.length) walk(next, depth + 1);
  }

  walk([root], 0);
  return stages;
}

function pokemonSprite(p: Pokemon): string | null {
  return (
    p.sprites.other?.["official-artwork"]?.front_default ??
    p.sprites.front_default ??
    null
  );
}

async function buildStage(name: string): Promise<PokemonStage> {
  const p = await getPokemon(name);
  return {
    name: p.name,
    spriteUrl: pokemonSprite(p),
    weightKg: Number.isFinite(p.weight) ? p.weight / 10 : null,
  };
}

export async function withMinimumDelay<T>(
  promise: Promise<T>,
  ms = 350,
): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise((r) => setTimeout(r, ms)),
  ]);
  return result as T;
}

export async function getChainVMByChainUrl(
  chainUrl: string,
): Promise<EvolutionChainVM> {
  const chain = await getEvolutionChainByUrl(chainUrl);
  const stageNames = extractStages(chain.chain);

  const stages: PokemonStage[][] = await Promise.all(
    stageNames.map((names) => Promise.all(names.map(buildStage))),
  );

  const title = stages[0]?.[0]?.name
    ? `#${chain.id} · ${stages[0][0].name}`
    : `#${chain.id}`;

  return {
    key: String(chain.id),
    title,
    stages,
  };
}

export async function getChainVMByPokemonName(
  pokemonName: string,
): Promise<EvolutionChainVM> {
  const species = await getPokemonSpecies(pokemonName);
  return getChainVMByChainUrl(species.evolution_chain.url);
}
