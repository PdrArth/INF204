const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const babel = require('@babel/core');

test('urna: votos seguros, dados derivados, mesário e reset', () => {
  const state = [];
  let cursor = 0;
  let functionalUpdates = 0;
  const react = {
    createElement(type, props, ...children) {
      return typeof type === 'function' ? type({ ...props, children }) : { type, props: props || {}, children };
    },
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], next => {
        if (typeof next === 'function') { functionalUpdates++; state[index] = next(state[index]); }
        else state[index] = next;
      }];
    },
  };
  const native = Object.fromEntries(['ScrollView', 'Text', 'TextInput', 'TouchableOpacity', 'View'].map(x => [x, x]));
  native.StyleSheet = { create: x => x };
  const code = babel.transformSync(fs.readFileSync(require.resolve('../App.js'), 'utf8'), {
    filename: require.resolve('../App.js'), presets: [require.resolve('babel-preset-expo')], babelrc: false, configFile: false,
  }).code;
  const context = { exports: {}, require: name => {
    if (name === 'react') return react;
    if (name === 'react-native') return native;
    if (name === 'react/jsx-runtime') return { jsx: (t,p) => react.createElement(t,p,p.children), jsxs: (t,p) => react.createElement(t,p,p.children) };
    return require(name);
  } };
  vm.runInNewContext(code, context);
  const render = () => { cursor = 0; return context.exports.default(); };
  const all = node => !node || typeof node !== 'object' ? [] : [node, ...[node.children].flat(Infinity).flatMap(all)];
  const words = node => node == null ? '' : typeof node !== 'object' ? String(node) : [node.children].flat(Infinity).map(words).join('');
  const button = (tree, label) => all(tree).find(n => n.type === 'TouchableOpacity' && words(n) === label);
  let tree = render();
  assert.match(words(tree), /Total de Votos: 0/);
  assert.doesNotMatch(words(tree), /NaN|Infinity/);
  const voteA = button(tree, 'Votar em A').props.onPress;
  for (let i = 0; i < 2; i++) voteA();
  button(tree, 'Votar em B').props.onPress();
  tree = render();
  assert.match(words(tree), /Candidato A: 2 votos \(66.7%\)/);
  assert.match(words(tree), /Candidato B: 1 votos \(33.3%\)/);
  assert.match(words(tree), /Total de Votos: 3/);
  all(tree).find(n => n.type === 'TextInput').props.onChangeText('Pedro Arthur');
  tree = render();
  assert.match(words(tree), /Mesário atual: Pedro Arthur/);
  button(tree, 'Votar em C').props.onPress();
  tree = render();
  assert.match(words(tree), /Candidato C: 1 votos \(25.0%\)/);
  assert.equal(functionalUpdates, 4);
  assert.equal(state.length, 4, 'Somente votos e mesário devem ter estado');
  button(tree, 'Zerar Urna').props.onPress();
  tree = render();
  assert.match(words(tree), /Total de Votos: 0/);
  assert.match(words(tree), /Mesário atual: Pedro Arthur/);
  assert.doesNotMatch(words(tree), /NaN|Infinity/);
  assert.equal(all(tree).find(n => n.type === 'TextInput').props.value, 'Pedro Arthur');
});
