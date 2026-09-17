# INF204 - Desenvolvimento para Dispositivos Móveis

Repositório utilizado para organizar as práticas da disciplina INF204.

## Aluno

- Nome: Pedro Arthur
- Matrícula: 22.305

## Organização do repositório

A branch `main` contém apenas este arquivo de orientação. Cada prática fica isolada em sua própria branch, evitando misturar os códigos das diferentes aulas.

| Branch | Conteúdo | Pasta no Windows |
| --- | --- | --- |
| `main` | Orientações do repositório | `Projetos Aulas Comuputação movel` |
| `feature/pratica-01` | Projeto da Aula 1 | `INF204-aula01` |
| `feature/pratica-02` | Projeto da Aula 2 | `INF204-aula02` |
| `feature/pratica-03` | Perfis editáveis e jogo da velha da Aula 3 | `INF204-aula03` |
| `feature/pratica-04` | Urna, estados, porcentagens e mesário | `INF204-aula04` |
| `feature/pratica-05` | Agenda telefônica com FlatList | `INF204-aula05` |

As próximas aulas devem seguir o padrão `feature/pratica-N`, mantendo somente a pasta correspondente àquela prática.

## Como executar uma aula

Abra a pasta da aula desejada no terminal. Para a Aula 4, por exemplo:

```bash
cd C:\Users\pedro\Downloads\INF204-aula04\aula04
npm install
npx expo start
```

Para a Aula 5:

```powershell
cd C:\Users\pedro\Downloads\INF204-aula05\aula05
npm install
npm start
```

Depois que o Expo iniciar:

- Pressione `w` para abrir no navegador.
- Ou escaneie o QR Code usando o aplicativo Expo Go.

## Como funcionam as pastas

As pastas das aulas foram configuradas com Git worktrees. Cada pasta está permanentemente vinculada à sua própria branch. Dessa forma, não é necessário executar `git switch` para alternar entre as aulas: basta abrir a pasta correspondente.

## Compare & pull request

As pastas `aula01`, `aula02`, `aula03`, `aula04` e `aula05` na pasta principal do PC são atalhos locais para os códigos reais. Para commits e comandos Git de uma aula, use a pasta `INF204-aulaNN` correspondente. Os atalhos são ignorados pelo Git.

A Aula 4 inclui uma coleção de materiais em PDF:

- [01 - Aprenda os conceitos](https://github.com/PdrArth/INF204/blob/feature/pratica-04/aula04/Guia-01-Aprenda-Conceitos-PT04.pdf)
- [02 - Código explicado](https://github.com/PdrArth/INF204/blob/feature/pratica-04/aula04/Guia-02-Codigo-Explicado-PT04.pdf)
- [03 - Faça passo a passo](https://github.com/PdrArth/INF204/blob/feature/pratica-04/aula04/Guia-03-Faca-Passo-a-Passo-PT04.pdf)
- [04 - Teste, entrega e erros](https://github.com/PdrArth/INF204/blob/feature/pratica-04/aula04/Guia-04-Teste-Entrega-Erros-PT04.pdf)

O GitHub pode mostrar o botão **Compare & pull request** quando uma branch possui conteúdo diferente da `main`. Isso é normal e não representa erro ou arquivo duplicado. Um Pull Request só precisa ser criado quando for solicitado pelo professor.
