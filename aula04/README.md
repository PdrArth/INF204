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

## Arquivos

- `App.js`: tela, componente Candidato, estados, eventos e estilos.
- `app.json`: nome e configuração Expo.
- `package.json` e `package-lock.json`: comandos e dependências.
- `tests/urna.test.cjs`: testes de comportamento.
- `Guia-Pratica04.pdf`: explicações curtas com analogias.

Branch: `feature/pratica-04`. Apenas `aula04` pertence a esta branch.
