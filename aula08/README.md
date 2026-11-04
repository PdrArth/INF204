# Prática 08 - Tarefas e persistência local

Pedro Arthur | INF204 | JavaScript | Expo SDK 57

Lista simples de tarefas: adicionar, concluir, reabrir e filtrar. O nome do usuário fica salvo em **AsyncStorage** e as tarefas em **SQLite**, usando `SQLiteProvider` e `useSQLiteContext`.

## Abrir no celular por outra rede

```powershell
cd C:\Users\pedro\Downloads\INF204-aula08\aula08
npm install
npm start
```

Escaneie o QR no Expo Go compatível com SDK 57. O comando abre um túnel Cloudflare e imprime o QR HTTPS (`exps://`): celular e computador podem estar em redes diferentes, incluindo dados móveis. Ambos precisam ter internet para carregar o projeto; mantenha o terminal aberto. Algumas redes podem bloquear serviços de túnel. O QR é temporário e deve ser obtido novamente ao reiniciar o servidor.

Para ver no navegador, abra `http://localhost:8089` ou o endereço HTTPS mostrado no terminal. Para iniciar apenas no computador, sem túnel, use `npm run web` quando nenhum servidor estiver aberto.

O iniciador usa as portas 8088 (Metro) e 8089 (proxy com headers do SQLite Web). No Windows x64, baixa o executável oficial `cloudflared` na primeira execução, confere o hash publicado no GitHub e guarda em `.cache`, ignorada pelo Git. Não instala serviço nem exige conta Cloudflare. Para usar um executável já instalado em outro sistema, defina `CLOUDFLARED_PATH`.

Há também `npm run start:ngrok`, que usa o túnel padrão do Expo. Na preparação desta aula, esse serviço expirou a conexão; por isso a inicialização padrão usa Cloudflare. Referência: [Quick Tunnels oficiais](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

## Usar

1. Toque em **Mudar nome**, digite seu nome e salve.
2. Escreva uma tarefa e toque em **Adicionar**.
3. Toque em uma tarefa para concluir ou voltar a pendente.
4. Alterne entre **Todas**, **Pendentes** e **Concluídas**.
5. Recarregue o aplicativo: o nome, as tarefas e os estados de conclusão continuam salvos.

O aplicativo inicia sem tarefas de exemplo. Cada aparelho tem sua própria lista; não há conta ou sincronização na nuvem. No celular, as operações de tarefas e preferências usam apenas armazenamento local. O Expo Go ainda precisa alcançar o servidor de desenvolvimento para carregar o JavaScript; uma instalação independente do PC exigiria gerar um aplicativo instalável.

## Como funciona

- `SQLiteProvider` abre `inf204-pratica08.db` e inicializa a tabela antes de mostrar a tela.
- `useSQLiteContext` entrega a conexão ao hook de tarefas.
- `SELECT` lê as tarefas; `INSERT` adiciona; `UPDATE` altera a conclusão.
- Os textos e IDs são enviados por parâmetros `?`, sem concatenação de entradas do usuário no SQL.
- O banco usa WAL e versão de esquema para manter a inicialização repetível sem apagar dados.
- `AsyncStorage.getItem/setItem` lê e guarda o nome como string.
- As tarefas só mudam na tela após serem gravadas. Toques repetidos durante a gravação são bloqueados.

O roteiro principal está implementado. Os desafios opcionais de DELETE, objeto de usuário em JSON e branch TypeScript ficam para uma etapa futura.

## Arquitetura

```text
aula08/
  App.js                       # providers, carregamento e erro de inicializacao
  src/
    database/tasks.js          # esquema, migracao e consultas parametrizadas
    services/preferences.js    # nome salvo em armazenamento chave-valor
    hooks/useTasks.js          # leitura, gravacao e estados de operacao
    screens/TasksScreen.js     # tela principal e filtros
    components/
      TaskRow.js               # checkbox e texto da tarefa
      NameEditor.js            # edicao do nome
      Feedback.js              # carregamento e estados vazios
    theme.js                   # cores compartilhadas
  tests/tasks.test.mjs          # SQLite real e contrato das preferencias
  metro.config.cjs              # suporte a arquivos WASM
  scripts/
    start.mjs                  # inicia Expo, tunel e QR; --local dispensa tunel
    header-proxy.mjs           # headers de isolamento e WebSocket no navegador
```

## Conferir

```powershell
npm test
npx expo install --check
npm run build:web
```

Os 7 testes usam o SQLite real do Node 24 para verificar criação, persistência em arquivo, reabertura, parametrização, validação e mudança de conclusão. O armazenamento do nome é testado com uma implementação em memória do contrato AsyncStorage. A verificação de interface usou o SQLite Web real, incluindo adicionar, concluir, filtros, recarregar, salvar nome, modo sem rede, toque duplo e tela de 320 px; não substitui testar o banco nativo no celular.

A auditoria de 04/11/2026 registrou 15 alertas nas dependências (2 baixos, 11 moderados e 2 altos). Os altos vêm do Expo CLI e de sua dependência Zod; a correção automática sugerida muda para SDK 58, incompatível com o SDK 57 solicitado. Nenhuma atualização forçada foi aplicada.

## SQLite no navegador

O suporte web do Expo SQLite é experimental. `metro.config.cjs` habilita WASM. O proxy na porta 8089 adiciona `Cross-Origin-Opener-Policy` e `Cross-Origin-Embedder-Policy` inclusive ao HTML, exigidos pelo worker e SharedArrayBuffer. Use o endereço 8089 ou o túnel HTTPS; abrir 8088 diretamente não oferece esses headers. Um `dist` servido sem esses headers pode não funcionar. A persistência no navegador pertence àquele navegador e endereço, e pode ser apagada ao limpar os dados do site.

Referência: [SQLite no Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/).

Branch: `feature/pratica-08`. Apenas `aula08` pertence a esta branch. A pasta `aula08` no diretório principal do PC é um atalho para este worktree.
