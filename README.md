Projeto em React + TypeScript + Tailwind que consome a PokeAPI v2 para exibir cadeias de evolução em cards (limite inicial de 20 cadeias).
O layout foi inspirado no visual original, com glassmorphism (blur + transparência) e grid responsivo.

Destaques:

Tipagem completa das respostas da API (interfaces para Pokemon, Species, EvolutionChain, etc.).

Cards por cadeia mostrando sprite e peso em kg (conversão de hectogramas → kg).

Search no header com normalização de entrada (ex.: “mr mime” → mr-mime) e loading curto por busca para melhorar a experiência.

Modo filtro: ao pesquisar, a tela mostra apenas a cadeia encontrada; ao limpar o campo, todas as cadeias retornam.
