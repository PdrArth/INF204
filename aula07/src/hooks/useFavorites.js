import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFavoritesStore } from '../services/favorites.js';

const store = createFavoritesStore(AsyncStorage);

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(null);
  const latest = useRef([]);
  const queue = useRef(Promise.resolve());
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    store.read().then(ids => {
      if (!active) return;
      latest.current = ids;
      setFavorites(ids);
    }).catch(() => {
      if (active) setStorageError('Não deu para ler os favoritos salvos neste aparelho.');
    }).finally(() => {
      if (active) setReady(true);
    });
    return () => { active = false; mounted.current = false; };
  }, []);

  function toggleFavorite(id) {
    if (!ready) return;
    const next = latest.current.includes(id) ? latest.current.filter(item => item !== id) : [...latest.current, id];
    latest.current = next;
    setFavorites(next);
    // Serializa as gravacoes para preservar a ordem dos toques.
    queue.current = queue.current.then(() => store.write(next)).then(() => {
      if (mounted.current) setStorageError(null);
    }).catch(() => {
      if (mounted.current) setStorageError('Os favoritos mudaram só nesta sessão. Não foi possível salvar no aparelho.');
    });
  }

  return { favorites, ready, storageError, toggleFavorite };
}
