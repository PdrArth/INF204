const collator = new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true });

export function normalizeText(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterContacts(users, { query = '', favorites = [], onlyFavorites = false } = {}) {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  return users.filter(user => {
    if (onlyFavorites && !favorites.includes(user.id)) return false;
    const text = normalizeText([user.name, user.email, user.company?.name, user.address?.city].filter(Boolean).join(' '));
    return words.every(word => text.includes(word));
  }).sort((a, b) => collator.compare(a.name, b.name));
}

export function contactLetter(user) {
  return user.name.trim().charAt(0).toLocaleUpperCase('pt-BR') || '#';
}
