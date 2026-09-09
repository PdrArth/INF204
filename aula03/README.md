# Prática Laboratorial 03 - INF204

Pedro Arthur — Matrícula 22.305

## Objetivo

Praticar os Core Components do React Native, StyleSheet, Flexbox e interatividade com useState.

## Funcionalidades

- Três perfis em ScrollView com View, Text e Image remota de tamanho definido.
- TextInput altera cada nome imediatamente e independentemente.
- TouchableOpacity alterna Seguir/Já Seguindo com estilo cinza aplicado por array.
- JogoDaVelha.js: grade 3x3 em Flexbox, turnos X/O, vitória, empate e reinício.
- Avatar com inicial caso a imagem remota não carregue. Os outros dois perfis são exemplos fictícios.

## Executar

Abra um terminal nesta pasta:

```bash
npm ci
npx expo start
```

Pressione `w` para Web ou use Expo Go na mesma rede. As imagens remotas precisam de internet. Os estados reiniciam ao recarregar o aplicativo.

## Conferir

Edite os três nomes; siga e deixe de seguir cada perfil; role até o jogo; teste alternância, casa ocupada, vitória, empate e reinício.

```bash
npx expo export --platform web
```

Entrega: branch `feature/pratica-03`, somente a pasta `aula03`.
