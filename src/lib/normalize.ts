export function normalizePokemonQuery(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      // remove acentos
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // espaços/underscores viram hífen
      .replace(/[\s_]+/g, "-")
      // remove caracteres estranhos (mantém letras, números e hífen)
      .replace(/[^a-z0-9-]/g, "")
      // remove hífens repetidos
      .replace(/-+/g, "-")
      // remove hífen no começo/fim
      .replace(/^-|-$/g, "")
  );
}
