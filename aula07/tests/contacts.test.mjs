import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterContacts } from '../src/utils/contacts.js';
import { createFavoritesStore } from '../src/services/favorites.js';

const users = [
  { id: 2, name: 'Zélia Costa', email: 'zelia@example.test', company: { name: 'Café Central' }, address: { city: 'Viçosa' } },
  { id: 1, name: 'Ana Ribeiro', email: 'ana@example.test' },
];

test('busca ignora acentos e combina nome, cidade e empresa sem alterar a lista original', () => {
  assert.deepEqual(filterContacts(users, { query: 'zelia vicosa cafe' }).map(user => user.id), [2]);
  assert.deepEqual(filterContacts(users).map(user => user.id), [1, 2]);
  assert.equal(users[0].id, 2);
  assert.deepEqual(filterContacts(users, { query: 'inexistente' }), []);
});

test('busca e filtro de favoritos funcionam juntos', () => {
  assert.deepEqual(filterContacts(users, { favorites: [2], onlyFavorites: true, query: 'costa' }).map(user => user.id), [2]);
  assert.deepEqual(filterContacts(users, { favorites: [], onlyFavorites: true }), []);
});

test('favoritos podem ser lidos em outra instancia e nao duplicam IDs', async () => {
  const memory = new Map();
  const storage = { getItem: async key => memory.get(key) ?? null, setItem: async (key, value) => { memory.set(key, value); } };
  const first = createFavoritesStore(storage);
  assert.deepEqual(await first.read(), []);
  await first.write([2, 2, 1]);
  assert.deepEqual(await createFavoritesStore(storage).read(), [2, 1]);
  await first.write([]);
  assert.deepEqual(await first.read(), []);
});

test('erro de armazenamento e dado corrompido nao sao tratados como favoritos salvos', async () => {
  await assert.rejects(createFavoritesStore({ getItem: async () => '{' }).read(), SyntaxError);
  await assert.rejects(createFavoritesStore({ getItem: async () => '["id"]' }).read(), /INVALID_FAVORITES/);
  await assert.rejects(createFavoritesStore({ setItem: async () => { throw new Error('disk full'); } }).write([1]), /disk full/);
});
