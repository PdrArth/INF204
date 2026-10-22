# Prática 07 - Consumo de API

Pedro Arthur | INF204 | JavaScript, React Native e Expo

Aplicativo **Pessoas**: consulta usuários fictícios no JSONPlaceholder e exibe nome e e-mail. Implementa os passos principais do roteiro da Prática 07. Os desafios de pull-to-refresh, formulário POST e versão TypeScript ficam para uma etapa futura.

## Executar no celular, inclusive em outra rede

```powershell
cd C:\Users\pedro\Downloads\INF204-aula07\aula07
npm install
Copy-Item .env.example .env
npm start
```

O `.env` já está preparado neste computador. Em outro clone, copie o exemplo antes de iniciar. `npm start` usa `expo start --tunnel ngrok`: escaneie o QR no Expo Go compatível com o SDK 58. O celular pode usar outra Wi-Fi ou dados móveis. Mantenha computador e terminal ligados e conectados à internet. O endereço é temporário; redes que bloqueiam o serviço de túnel ainda podem impedir a conexão.

Para navegador: `npm run web`. Para a mesma rede local: `npm run start:lan`.

## Como funciona

1. `useEffect` inicia a busca ao montar a tela.
2. `getUsers` usa a instância Axios configurada em `api.js` e faz `GET /users`.
3. `ActivityIndicator` informa que a consulta está em andamento.
4. `try/catch/finally` controla sucesso, erro e encerramento do carregamento.
5. `FlatList` mostra cartões com nomes e e-mails, usando o ID como chave.

Além dos passos principais, há mensagem de lista vazia, erros legíveis, botão para tentar novamente, prazo de 10 segundos e cancelamento ao sair da tela. Nenhum cadastro é enviado para a API.

## Arquitetura

```text
aula07/
  App.js                       # provedores e entrada da tela
  src/
    services/
      api.js                   # Axios: URL, timeout e headers
      users.js                 # GET /users, validacao e mensagens
    screens/UsersScreen.js     # estado, efeito e lista
    components/
      UserCard.js              # cartao de usuario
      ListFeedback.js          # carregamento, erro e lista vazia
    theme.js                   # cores compartilhadas
  tests/users.test.mjs          # pedidos HTTP contra servidor local
  .env.example                 # exemplo publico da configuracao
```

O serviço é como um entregador: a tela pede os contatos, ele busca os dados e entrega a resposta. A tela cuida apenas de mostrar o resultado e os estados da consulta.

## Variáveis de ambiente

```dotenv
EXPO_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

A URL fica fora dos arquivos de lógica. `.env` é local e ignorado pelo Git; `.env.example` acompanha o repositório. Variáveis `EXPO_PUBLIC_` são visíveis no aplicativo compilado e **não protegem chaves secretas**. Esta API é pública e não exige chave. Referência: [documentação oficial Expo](https://docs.expo.dev/guides/environment-variables/).

## Verificação

```powershell
npm test
npx expo install --check
npm run build:web
```

Os testes usam um servidor local e verificam sucesso, lista vazia, HTTP 503, resposta inválida, timeout, recuperação, cancelamento e ausência de configuração. Para conferir no celular: abra o QR, aguarde os contatos e role a lista. Sem internet, a tela apresenta erro e permite tentar novamente depois de reconectar.

Na instalação de 22/10/2026, `npm audit` apontou alertas em dependências transitivas do Expo/Metro e do ngrok. As versões compatíveis do SDK foram mantidas; os downgrades incompatíveis sugeridos por `--force` não foram aplicados.

Branch: `feature/pratica-07`. Apenas `aula07` pertence a esta branch. A pasta `aula07` no diretório principal do PC é um atalho local para este worktree.
