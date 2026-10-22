const STORAGE_KEY = '@inf204/pratica07/favorites-v1';

export function createFavoritesStore(storage) {
  function validate(ids) {
    if (!Array.isArray(ids) || ids.some(id => !Number.isInteger(id))) throw new Error('INVALID_FAVORITES');
    return [...new Set(ids)];
  }
  return {
    async read() {
      const saved = await storage.getItem(STORAGE_KEY);
      return saved === null ? [] : validate(JSON.parse(saved));
    },
    async write(ids) {
      await storage.setItem(STORAGE_KEY, JSON.stringify(validate(ids)));
    },
  };
}
