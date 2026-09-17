# Prática 05 - Agenda telefônica

Pedro Arthur | INF204 | JavaScript e Expo

Projeto da Prática 05 sobre listas virtualizadas no React Native. A tela usa `FlatList` para exibir contatos, `renderItem` para desenhar cada contato, `keyExtractor` para identificar cada item, `ItemSeparatorComponent` para separar visualmente os itens e `ListEmptyComponent` para tratar a lista vazia.

## Executar

```powershell
cd C:\Users\pedro\Downloads\INF204-aula05\aula05
npm install
npm start
```

Pressione `w` para abrir no navegador. Para usar no celular, abra o Expo Go na mesma rede Wi-Fi e escaneie o QR Code mostrado pelo Expo.

## O que foi implementado

- Sete contatos iniciais em um array estático.
- Estado `contatos` criado com `useState`.
- Lista eficiente com `FlatList`.
- Cartão visual reutilizável para cada contato.
- Separadores visuais entre os contatos.
- Botão `Limpar tudo`, que demonstra o estado vazio.
- Botão `Restaurar contatos`, para testar novamente a lista.
- Mensagem amigável quando a agenda está vazia.

## Desafios deixados para depois

Os desafios de pull-to-refresh e rolagem infinita não foram implementados nesta entrega, conforme combinado.

## Conferir

```powershell
npm test
npx expo export --platform web
```

O teste confirma a estrutura da `FlatList`, os dados iniciais, o esvaziamento e a restauração da agenda. A exportação web confirma que o projeto Expo compila.

## Arquivos

- `App.js`: tela, dados, estado, `FlatList`, funções de renderização e estilos.
- `app.json`: nome e configuração do Expo.
- `package.json` e `package-lock.json`: scripts e dependências.
- `tests/agenda.test.cjs`: teste automatizado da prática.

Branch: `feature/pratica-05`. Apenas a pasta `aula05` pertence a esta branch.
