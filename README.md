Pokémon Evolution Chains (React + TS + Tailwind)

Projeto em React + TypeScript + Tailwind que consome a PokeAPI v2 para exibir cadeias de evolução em cards (carregamento inicial de até 20 cadeias).
O layout é inspirado no visual original, com glassmorphism (blur + transparência) e grid responsivo.

✨ Funcionalidades

Lista inicial: carrega 20 cadeias de evolução.

Cards por cadeia: exibe sprites e peso em kg (conversão automática).

Busca no header:

normaliza a entrada (ex.: mr mime → mr-mime)

mostra um loading curto por busca (melhora a percepção de feedback)

ativa modo filtro: ao buscar, exibe apenas a cadeia encontrada

ao limpar o campo, volta a mostrar todas as cadeias

Tratamento de erro com Toast: se não encontrar o pokémon, exibe um alert minimalista no canto superior direito com timeout de 4s.

🔌 Endpoints utilizados (PokeAPI v2)

A aplicação usa os seguintes endpoints:

1) Listar cadeias (carregamento inicial)

GET https://pokeapi.co/api/v2/evolution-chain?limit=20

Retorna uma lista com URLs das cadeias. Exemplo de item:

results[i].url → https://pokeapi.co/api/v2/evolution-chain/1/

2) Buscar uma cadeia específica (por URL)

GET https://pokeapi.co/api/v2/evolution-chain/{id}/

Exemplo:

GET https://pokeapi.co/api/v2/evolution-chain/1/

Esse endpoint devolve a árvore de evolução (chain e evolves_to) que o app transforma em “estágios” para renderização.

3) Buscar espécie do pokémon (para descobrir a cadeia via search)

GET https://pokeapi.co/api/v2/pokemon-species/{name}/

Exemplo:

GET https://pokeapi.co/api/v2/pokemon-species/pikachu/

Esse endpoint retorna:

evolution_chain.url → URL usada no endpoint da cadeia (item 2).

4) Buscar detalhes do pokémon (sprite e peso)

GET https://pokeapi.co/api/v2/pokemon/{name}/

Exemplo:

GET https://pokeapi.co/api/v2/pokemon/bulbasaur/

Usado para obter:

sprites (imagem)

weight (hectogramas)

📌 Conversão de peso

A PokeAPI retorna weight em hectogramas

O app converte para kg: kg = weight / 10

🧠 Decisões e destaques técnicos

Tipagem completa das respostas da API com interfaces (Pokemon, PokemonSpecies, EvolutionChain, etc.).

Cache em memória para evitar requests repetidas e melhorar performance.

ViewModel (VM) para UI:

a árvore da PokeAPI é transformada em uma estrutura mais simples para renderizar (stages[][]).

UX de loading: minimum delay evita “piscar” quando a API responde muito rápido.

Toast de erro substitui cards de erro na busca, deixando a UI mais limpa.

🗂️ Estrutura do projeto

src/types/
Tipagem do contrato da API + tipos usados pela UI (ViewModels)

src/lib/
Funções utilitárias e puras: fetch, cache, normalização, transformação de dados

src/components/
Componentes visuais (UI) sem responsabilidade de rede

src/App.tsx
Orquestração do fluxo: carregamento inicial, busca, filtro e estado da tela

Para rodar o projeto localmente utilize o comando: npm run dev
