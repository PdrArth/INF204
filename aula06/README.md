# Prática 06 - Navegação com React Navigation

Pedro Arthur | INF204 | TypeScript e Expo

Projeto da Aula 06 sobre navegação mobile. Ele demonstra uma pilha (`Stack`) com abas inferiores (`Bottom Tabs`) aninhadas, passagem de parâmetros entre telas e tipagem estrita das rotas.

## Executar por qualquer rede

```powershell
cd C:\Users\pedro\Downloads\INF204-aula06\aula06
npm install
npx expo start --tunnel
```

O modo `--tunnel` cria um endereço público temporário. Por isso, o celular pode estar em outra rede Wi-Fi ou usando dados móveis. O computador e o celular precisam ter acesso à internet, e o terminal precisa continuar aberto. O QR Code muda quando o servidor é reiniciado.

Para executar apenas no navegador:

```powershell
npm run web
```

## O que foi implementado

- `NavigationContainer` como provedor da árvore de navegação.
- `Native Stack Navigator` como pilha principal.
- `Bottom Tab Navigator` com as abas Início e Perfil.
- Aninhamento: as abas ficam dentro da rota `Principal` da pilha.
- Passagem de `itemId`, `nomeProduto` e `ativo` para a tela de detalhes.
- Leitura dos dados usando `route.params`.
- `navigation.navigate`, `navigation.push`, `navigation.goBack` e `navigation.popToTop`.
- `SafeAreaProvider` e `SafeAreaView` para respeitar entalhes e barras do celular.
- Tipagem TypeScript das rotas e dos parâmetros.

## Arquitetura

```text
aula06/
├── App.tsx                         # ponto de entrada e provedores globais
├── src/
│   ├── routes/
│   │   ├── RootNavigator.tsx       # NavigationContainer + Stack
│   │   └── AppTabs.tsx              # Bottom Tabs
│   ├── screens/
│   │   ├── FeedScreen.tsx          # tela inicial e envio de parâmetros
│   │   ├── ProfileScreen.tsx        # aba independente de perfil
│   │   └── ProductDetailsScreen.tsx# destino dos parâmetros
│   ├── types/
│   │   └── navigation.ts           # contrato das rotas
│   └── theme.ts                     # cores compartilhadas
├── tests/navigation.test.cjs       # teste da arquitetura e das rotas
└── README.md
```

Uma analogia simples: `RootNavigator` é o prédio, `AppTabs` são os corredores principais, `screens` são as salas e `navigation.ts` é a planta que impede alguém de procurar uma sala com o nome errado.

## Conferir

```powershell
npm test
npm run typecheck
npx expo export --platform web
```

## Como testar a navegação

1. Na aba Início, toque em `Ver detalhes do produto`.
2. Confira que a tela mostra o nome, o ID e o status recebidos por parâmetros.
3. Toque em `Usar navigation.push` para empilhar outro produto.
4. Use `Voltar uma tela` para executar `goBack`.
5. Use `Voltar para a navegação principal` para executar `popToTop`.
6. Troque para a aba Perfil e observe que ela é um contexto independente.

Branch: `feature/pratica-06`. Apenas a pasta `aula06` pertence a esta branch.
