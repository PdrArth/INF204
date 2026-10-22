import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import axios from 'axios';
import api from '../src/services/api.js';
import { getUsers, getErrorMessage } from '../src/services/users.js';

const example = [{ id: 1, name: 'Pedro Arthur', email: 'pedro@example.test' }];
let mode = 'success';
let server;
let endpoint;
const originalURL = api.defaults.baseURL;

before(async () => {
  server = http.createServer((req, res) => {
    assert.equal(req.url, '/users');
    res.setHeader('Content-Type', 'application/json');
    if (mode === 'error') { res.writeHead(503); res.end('{"error":"unavailable"}'); }
    else if (mode === 'slow') { /* Cliente cancela por timeout/AbortController. */ }
    else if (mode === 'empty') res.end('[]');
    else if (mode === 'invalid') res.end('{"unexpected":true}');
    else res.end(JSON.stringify(example));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  endpoint = `http://127.0.0.1:${server.address().port}`;
  api.defaults.baseURL = endpoint;
});

after(() => {
  api.defaults.baseURL = originalURL;
  server.closeAllConnections();
  server.close();
});

test('GET /users converte JSON e devolve os usuarios', async () => {
  mode = 'success';
  assert.deepEqual(await getUsers(), example);
  assert.equal(api.defaults.timeout, 10000);
});

test('lista vazia e uma resposta valida', async () => {
  mode = 'empty';
  assert.deepEqual(await getUsers(), []);
});

test('HTTP 503 e convertido em mensagem para o usuario', async () => {
  mode = 'error';
  await assert.rejects(getUsers(), error => {
    assert.equal(error.response.status, 503);
    assert.match(getErrorMessage(error), /indisponível/);
    return true;
  });
});

test('resposta inesperada e rejeitada antes da renderizacao', async () => {
  mode = 'invalid';
  await assert.rejects(getUsers(), error => {
    assert.match(getErrorMessage(error), /dados inesperados/);
    return true;
  });
});

test('timeout encerra o pedido e permite tentar novamente', async () => {
  mode = 'slow';
  api.defaults.timeout = 50;
  try {
    await assert.rejects(getUsers(), error => {
      assert.equal(error.code, 'ECONNABORTED');
      assert.match(getErrorMessage(error), /demorou demais/);
      return true;
    });
  } finally { api.defaults.timeout = 10000; }
  mode = 'success';
  assert.deepEqual(await getUsers(), example);
});

test('AbortController cancela pedidos de uma tela desmontada', async () => {
  mode = 'slow';
  const controller = new AbortController();
  const pending = getUsers({ signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, error => axios.isCancel(error));
});

test('configuracao ausente produz uma orientacao clara', async () => {
  api.defaults.baseURL = undefined;
  try {
    await assert.rejects(getUsers(), error => {
      assert.match(getErrorMessage(error), /EXPO_PUBLIC_API_URL/);
      return true;
    });
  } finally { api.defaults.baseURL = endpoint; }
});
