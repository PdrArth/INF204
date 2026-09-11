# Prática 04 - Simulador de votação

Pedro Arthur | INF204 | JavaScript e Expo

Três candidatos com votos independentes, atualização segura usando callbacks, total e porcentagens derivados, identificação do mesário e botão para zerar a urna. Inclui os dois desafios extras do roteiro.

## Executar

```powershell
cd C:\Users\pedro\Downloads\INF204-aula04\aula04
npm install
npm start
```

Pressione `w` para abrir no navegador. Para celular, use Expo Go compatível com o SDK instalado e a mesma rede Wi-Fi.

## Conferir

- Digite o nome: a mensagem do mesário muda imediatamente.
- Vote duas vezes em A e uma em B: total 3; A 66,7%, B 33,3%, C 0%.
- Zere a urna: votos e porcentagens voltam a zero; o nome é preservado.
- Recarregar reinicia tudo: não há banco de dados. É uma simulação, não uma urna real.
- Porcentagens são arredondadas para uma casa decimal e podem somar 99,9%.

```powershell
npm test
npx expo export --platform web
```

O teste automatizado verifica os callbacks e a renderização lógica com componentes nativos simulados; não substitui teste em aparelho.

## Material de estudo

Os PDFs estão separados por finalidade, como uma pequena apostila:

1. `Guia-01-Aprenda-Conceitos-PT04.pdf`: explica o que é State, Props, useState, callback, re-renderização e dados derivados.
2. `Guia-02-Codigo-Explicado-PT04.pdf`: acompanha os trechos reais do `App.js` e explica o que cada parte faz.
3. `Guia-03-Faca-Passo-a-Passo-PT04.pdf`: mostra como criar, abrir, executar e testar o projeto.
4. `Guia-04-Teste-Entrega-Erros-PT04.pdf`: traz checklist, testes, Git, branches e soluções para erros comuns.

Leia na ordem 01, 02, 03 e 04 para estudar do conceito até a entrega.

## Arquivos do projeto

- `App.js`: tela, componente Candidato, estados, eventos e estilos.
- `app.json`: nome e configuração Expo.
- `package.json` e `package-lock.json`: comandos e dependências.
- `tests/urna.test.cjs`: testes de comportamento.
- `Guia-*.pdf`: coleção de materiais de estudo da Prática 04.

Branch: `feature/pratica-04`. Apenas `aula04` pertence a esta branch.
