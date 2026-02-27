export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny?: string | null;
  other?: {
    ["official-artwork"]?: { front_default: string | null };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  weight: number;
  sprites: PokemonSprites;
}

export interface PokemonSpecies {
  name: string;
  evolution_chain: { url: string };
}

export interface EvolutionDetail {
  min_level: number | null;
  trigger: NamedAPIResource;
}

export interface ChainLink {
  species: NamedAPIResource;
  evolves_to: ChainLink[];
  evolution_details: EvolutionDetail[];
}

export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}

export type PokemonStage = {
  name: string;
  spriteUrl: string | null;
  weightKg: number | null;
};

export type EvolutionChainVM = {
  key: string;
  title: string;
  stages: PokemonStage[][];
};
