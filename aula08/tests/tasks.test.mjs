import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdtempSync, rmdirSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { initializeDatabase, createTaskRepository } from '../src/database/tasks.js';
import { createPreferences } from '../src/services/preferences.js';

function adapter(native) {
  return {
    execAsync: async sql => { native.exec(sql); },
    getFirstAsync: async (sql, params = []) => native.prepare(sql).get(...params),
    getAllAsync: async (sql, params = []) => native.prepare(sql).all(...params).map(row => ({ ...row })),
    runAsync: async (sql, params = []) => native.prepare(sql).run(...params),
    async withTransactionAsync(callback) {
      native.exec('BEGIN');
      try { await callback(); native.exec('COMMIT'); }
      catch (error) { native.exec('ROLLBACK'); throw error; }
    },
  };
}

let folder;
let filename;
let native;
let db;
let repository;
let firstId;

before(async () => {
  folder = mkdtempSync(join(tmpdir(), 'inf204-pt08-test-'));
  filename = join(folder, 'tasks.db');
  native = new DatabaseSync(filename);
  db = adapter(native);
  await initializeDatabase(db);
  repository = createTaskRepository(db);
});

after(() => {
  native?.close();
  // Remove somente os arquivos que este teste criou, sem exclusao recursiva.
  const safe = resolve(folder);
  assert.ok(safe.startsWith(resolve(tmpdir()) + sep) && safe.includes('inf204-pt08-test-'));
  for (const suffix of ['', '-wal', '-shm']) if (existsSync(filename + suffix)) unlinkSync(filename + suffix);
  rmdirSync(folder);
});

test('inicializacao cria banco versionado e pode ser repetida sem perder dados', async () => {
  assert.equal((await db.getFirstAsync('PRAGMA user_version')).user_version, 1);
  assert.deepEqual(await repository.list(), []);
  firstId = Number((await repository.add('  Estudar persistência  ')).lastInsertRowid);
  await initializeDatabase(db);
  assert.deepEqual(await repository.list(), [{ id: firstId, descricao: 'Estudar persistência', concluida: 0 }]);
});

test('tarefas em branco e acima do limite nao entram no banco', async () => {
  const count = (await repository.list()).length;
  for (const text of ['', '   ', 'a'.repeat(501)]) await assert.rejects(repository.add(text), /TASK_INVALID/);
  assert.equal((await repository.list()).length, count);
});

test('SQL e apostrofos digitados sao guardados como texto, sem alterar a tabela', async () => {
  const description = "Revisar SQL'); DROP TABLE tarefas; --";
  await repository.add(description);
  const rows = await repository.list();
  assert.equal(rows[0].descricao, description);
  assert.equal(rows.length, 2);
});

test('concluir e reabrir tarefa afeta somente o ID indicado', async () => {
  await repository.setCompleted(firstId, true);
  assert.equal((await repository.list()).find(task => task.id === firstId).concluida, 1);
  assert.equal((await repository.list())[0].concluida, 0);
  await repository.setCompleted(firstId, false);
  assert.equal((await repository.list()).find(task => task.id === firstId).concluida, 0);
  await assert.rejects(repository.setCompleted(99999, true), /TASK_NOT_FOUND/);
  await assert.rejects(repository.setCompleted(0, true), /TASK_INVALID/);
});

test('tarefas e conclusao sobrevivem ao fechamento e reabertura do arquivo SQLite', async () => {
  await repository.setCompleted(firstId, true);
  native.close();
  native = new DatabaseSync(filename);
  db = adapter(native);
  await initializeDatabase(db);
  repository = createTaskRepository(db);
  assert.equal((await repository.list()).find(task => task.id === firstId).concluida, 1);
  assert.equal((await repository.list()).length, 2);
});

test('AsyncStorage guarda o nome como string e permite recuperar em outra instancia', async () => {
  const data = new Map();
  const storage = { getItem: async key => data.get(key) ?? null, setItem: async (key, value) => { assert.equal(typeof value, 'string'); data.set(key, value); } };
  const preferences = createPreferences(storage);
  assert.equal(await preferences.readName(), 'Visitante');
  assert.equal(await preferences.saveName('  Pedro Arthur  '), 'Pedro Arthur');
  assert.equal(await createPreferences(storage).readName(), 'Pedro Arthur');
  await assert.rejects(preferences.saveName(' '), /NAME_INVALID/);
  await assert.rejects(preferences.saveName('x'.repeat(61)), /NAME_INVALID/);
});

test('falha de armazenamento e propagada para a interface tratar', async () => {
  const preferences = createPreferences({ getItem: async () => { throw new Error('read failed'); }, setItem: async () => { throw new Error('disk full'); } });
  await assert.rejects(preferences.readName(), /read failed/);
  await assert.rejects(preferences.saveName('Pedro'), /disk full/);
});
