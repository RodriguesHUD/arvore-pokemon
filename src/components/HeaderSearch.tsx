import { useState } from "react";

type Props = {
  onSearch: (value: string) => void;
};

export function HeaderSearch({ onSearch }: Props) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = value.trim().toLowerCase();
    if (!v) return;
    onSearch(v);
    setValue("");
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <h1 className="text-base font-semibold text-white sm:text-lg">
          Pokémon Evolution Chains
        </h1>

        <form
          onSubmit={submit}
          className="flex w-full max-w-md items-center gap-2"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Buscar pokémon (ex: pikachu)"
            className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none focus:border-white/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Buscar
          </button>
        </form>
      </div>
    </header>
  );
}
