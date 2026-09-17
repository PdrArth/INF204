const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const babel = require('@babel/core');

function carregarAgenda() {
  const state = [];
  let cursor = 0;
  const react = {
    createElement(type, props, ...children) {
      return typeof type === 'function'
        ? type({ ...props, children })
        : { type, props: props || {}, children };
    },
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], next => {
        state[index] = typeof next === 'function' ? next(state[index]) : next;
      }];
    },
  };
  const native = Object.fromEntries(
    ['FlatList', 'Text', 'TouchableOpacity', 'View'].map(name => [name, name]),
  );
  native.StyleSheet = { create: styles => styles };
  const code = babel.transformSync(
    fs.readFileSync(require.resolve('../App.js'), 'utf8'),
    {
      filename: require.resolve('../App.js'),
      presets: [require.resolve('babel-preset-expo')],
      babelrc: false,
      configFile: false,
    },
  ).code;
  const context = {
    exports: {},
    require: name => {
      if (name === 'react') return react;
      if (name === 'react-native') return native;
      if (name === 'react/jsx-runtime') {
        return {
          jsx: (type, props) => react.createElement(type, props, props.children),
          jsxs: (type, props) => react.createElement(type, props, props.children),
        };
      }
      return require(name);
    },
  };
  vm.runInNewContext(code, context);
  return {
    render() {
      cursor = 0;
      return context.exports.default();
    },
    state,
  };
}

function todosOsNos(node) {
  if (!node || typeof node !== 'object') return [];
  return [node, ...[node.children].flat(Infinity).flatMap(todosOsNos)];
}

function texto(node) {
  if (node == null) return '';
  if (typeof node !== 'object') return String(node);
  return [node.children].flat(Infinity).map(texto).join('');
}

function botao(tree, label) {
  return todosOsNos(tree).find(
    node => node.type === 'TouchableOpacity' && texto(node) === label,
  );
}

test('agenda: FlatList, limpar, estado vazio e restauracao', () => {
  const agenda = carregarAgenda();
  let tree = agenda.render();
  const lista = todosOsNos(tree).find(node => node.type === 'FlatList');

  assert.equal(lista.props.data.length, 7);
  assert.equal(lista.props.data[0].nome, 'Alice Silva');
  assert.equal(lista.props.data[0].telefone, '(31) 99999-1111');
  assert.equal(typeof lista.props.renderItem, 'function');
  assert.equal(typeof lista.props.keyExtractor, 'function');
  assert.equal(typeof lista.props.ItemSeparatorComponent, 'function');
  assert.equal(typeof lista.props.ListEmptyComponent, 'function');
  assert.equal(lista.props.keyExtractor(lista.props.data[0]), '1');
  assert.match(texto(lista.props.renderItem({ item: lista.props.data[0] })), /Alice Silva/);

  botao(tree, 'Limpar tudo').props.onPress();
  tree = agenda.render();
  const listaVazia = todosOsNos(tree).find(node => node.type === 'FlatList');
  assert.equal(listaVazia.props.data.length, 0);
  assert.match(texto(listaVazia.props.ListEmptyComponent()), /Agenda vazia/);

  botao(tree, 'Restaurar contatos').props.onPress();
  tree = agenda.render();
  const listaRestaurada = todosOsNos(tree).find(node => node.type === 'FlatList');
  assert.equal(listaRestaurada.props.data.length, 7);
  assert.equal(agenda.state.length, 1, 'A agenda precisa de apenas um estado');
});
