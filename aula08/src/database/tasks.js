const SCHEMA = `
  CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL CHECK(length(trim(descricao)) > 0),
    concluida INTEGER NOT NULL DEFAULT 0 CHECK(concluida IN (0, 1))
  );
`;

export async function initializeDatabase(db) {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  const version = await db.getFirstAsync('PRAGMA user_version;');
  if (version.user_version > 1) throw new Error('DATABASE_VERSION_UNSUPPORTED');
  if (version.user_version === 0) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(SCHEMA);
      await db.execAsync('PRAGMA user_version = 1;');
    });
  }
}

export function normalizeTask(value) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 500) {
    throw new Error('TASK_INVALID');
  }
  return value.trim();
}

export function createTaskRepository(db) {
  return {
    list() {
      return db.getAllAsync('SELECT id, descricao, concluida FROM tarefas ORDER BY id DESC;');
    },
    async add(description) {
      // Valores do usuario entram como parametros, nunca concatenados ao SQL.
      const text = normalizeTask(description);
      return db.runAsync('INSERT INTO tarefas (descricao, concluida) VALUES (?, ?);', [text, 0]);
    },
    async setCompleted(id, completed) {
      if (!Number.isInteger(id) || id < 1 || typeof completed !== 'boolean') throw new Error('TASK_INVALID');
      const result = await db.runAsync('UPDATE tarefas SET concluida = ? WHERE id = ?;', [completed ? 1 : 0, id]);
      if (result.changes !== 1) throw new Error('TASK_NOT_FOUND');
      return result;
    },
  };
}
