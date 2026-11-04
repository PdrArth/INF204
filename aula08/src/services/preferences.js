const NAME_KEY = '@INF204:PT08:nome';

export function normalizeName(value) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 60) throw new Error('NAME_INVALID');
  return value.trim();
}

export function createPreferences(storage) {
  return {
    async readName() {
      const value = await storage.getItem(NAME_KEY);
      return value === null ? 'Visitante' : normalizeName(value);
    },
    async saveName(value) {
      const name = normalizeName(value);
      await storage.setItem(NAME_KEY, name);
      return name;
    },
  };
}
