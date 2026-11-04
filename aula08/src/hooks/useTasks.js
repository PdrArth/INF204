import { useEffect, useMemo, useRef, useState } from 'react';
import { createTaskRepository } from '../database/tasks.js';

export default function useTasks(db) {
  const repository = useMemo(() => createTaskRepository(db), [db]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const locked = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    let active = true;
    repository.list().then(rows => { if (active) setTasks(rows); }).catch(() => {
      if (active) setError('Não consegui abrir suas tarefas. Tente recarregar a lista.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; mounted.current = false; };
  }, [repository]);

  async function reload() {
    if (locked.current || loading) return;
    locked.current = true;
    setBusy(true);
    setError(null);
    try {
      const rows = await repository.list();
      if (mounted.current) setTasks(rows);
    } catch {
      if (mounted.current) setError('Não consegui abrir suas tarefas. Tente recarregar a lista.');
    } finally {
      locked.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  async function mutate(operation) {
    if (locked.current || loading) return false;
    locked.current = true;
    setBusy(true);
    setError(null);
    let saved = false;
    try {
      await operation();
      saved = true;
      const rows = await repository.list();
      if (mounted.current) setTasks(rows);
    } catch (cause) {
      if (mounted.current) setError(saved
        ? 'A alteração foi salva. Recarregue a lista para vê-la.'
        : cause.message === 'TASK_INVALID' ? 'Escreva uma tarefa com até 500 caracteres.' : 'Não consegui salvar a alteração. Tente novamente.');
    } finally {
      locked.current = false;
      if (mounted.current) setBusy(false);
    }
    return saved;
  }

  return {
    tasks, loading, busy, error, reload,
    addTask: text => mutate(() => repository.add(text)),
    toggleTask: task => mutate(() => repository.setCompleted(task.id, task.concluida !== 1)),
  };
}
