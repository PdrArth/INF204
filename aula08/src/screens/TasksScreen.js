import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feedback from '../components/Feedback.js';
import NameEditor from '../components/NameEditor.js';
import TaskRow from '../components/TaskRow.js';
import useTasks from '../hooks/useTasks.js';
import { createPreferences } from '../services/preferences.js';
import { colors } from '../theme.js';

const preferences = createPreferences(AsyncStorage);
const filters = [{ id: 'all', label: 'Todas' }, { id: 'pending', label: 'Pendentes' }, { id: 'done', label: 'Concluídas' }];

export default function TasksScreen() {
  const db = useSQLiteContext();
  const { tasks, loading, busy, error, reload, addTask, toggleTask } = useTasks(db);
  const [name, setName] = useState('Visitante');
  const [nameReady, setNameReady] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let active = true;
    preferences.readName().then(value => { if (active) setName(value); })
      .catch(() => { if (active) setNameError('Não consegui ler seu nome salvo. Você pode defini-lo novamente.'); })
      .finally(() => { if (active) setNameReady(true); });
    return () => { active = false; };
  }, []);

  async function saveName(value) {
    const saved = await preferences.saveName(value);
    setName(saved);
    setNameError(null);
  }

  async function add() {
    if (!draft.trim() || busy || loading) return;
    if (await addTask(draft)) setDraft('');
  }

  const completed = tasks.filter(task => task.concluida === 1).length;
  const pending = tasks.length - completed;
  const visible = tasks.filter(task => filter === 'all' || (filter === 'done' ? task.concluida === 1 : task.concluida !== 1));
  const counts = { all: tasks.length, pending, done: completed };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headingRow}>
              <Text accessibilityRole="header" style={styles.title}>Tarefas</Text>
              <Text style={styles.practice}>08 / INF204</Text>
            </View>
            <View style={styles.nameRow}>
              <Text style={styles.greeting}>{nameReady ? 'Olá, ' + name + '.' : 'Abrindo suas preferências...'}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Mudar nome" disabled={!nameReady} onPress={() => setEditingName(true)} style={styles.editName}><Text style={styles.editNameText}>Mudar nome</Text></Pressable>
            </View>
            <Text style={styles.summary}>{pending} {pending === 1 ? 'pendente' : 'pendentes'} · {completed} {completed === 1 ? 'concluída' : 'concluídas'}</Text>
          </View>

          <View style={styles.composer}>
            <TextInput accessibilityLabel="Nova tarefa" placeholder="O que você precisa fazer?" placeholderTextColor={colors.muted} value={draft} onChangeText={setDraft} maxLength={500} editable={!busy && !loading} returnKeyType="done" onSubmitEditing={add} style={styles.input} />
            <Pressable accessibilityRole="button" accessibilityLabel="Adicionar tarefa" accessibilityState={{ disabled: busy || loading || !draft.trim() }} aria-disabled={busy || loading || !draft.trim()} disabled={busy || loading || !draft.trim()} onPress={add} style={[styles.add, (busy || loading || !draft.trim()) && styles.addDisabled]}><Text style={styles.addText}>Adicionar</Text></Pressable>
          </View>

          <View style={styles.filters}>
            {filters.map(item => (
              <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: filter === item.id }} aria-selected={filter === item.id} onPress={() => setFilter(item.id)} style={[styles.filter, filter === item.id && styles.selectedFilter]}><Text style={[styles.filterText, filter === item.id && styles.selectedText]}>{item.label} <Text style={styles.count}>{counts[item.id]}</Text></Text></Pressable>
            ))}
          </View>

          {nameError && <Text accessibilityLiveRegion="polite" style={styles.error}>{nameError}</Text>}
          {error && <View style={styles.errorBox}><Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text><Pressable accessibilityRole="button" disabled={busy} onPress={reload} style={styles.reload}><Text style={styles.reloadText}>Recarregar lista</Text></Pressable></View>}

          {loading ? <Feedback loading title="Abrindo sua lista" message="Só um instante." /> : (
            <FlatList
              data={visible}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => <TaskRow task={item} disabled={busy} onToggle={toggleTask} />}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={visible.length ? styles.list : styles.emptyList}
              ListEmptyComponent={<Feedback title={filter === 'done' ? 'Uma coisa de cada vez.' : filter === 'pending' && tasks.length ? 'Tudo em dia.' : 'Sua lista começa aqui.'} message={filter === 'done' ? 'As tarefas que você concluir aparecem aqui.' : filter === 'pending' && tasks.length ? 'Nenhuma tarefa pendente por enquanto.' : 'Anote a primeira tarefa no campo acima.'} />}
            />
          )}

          <View style={styles.footer}>
            {busy && <ActivityIndicator size="small" color={colors.primary} />}
            <Text style={styles.footerText}>{busy ? 'Salvando...' : error ? 'Confira a mensagem acima' : loading ? 'Carregando...' : 'Salvo neste aparelho'}</Text>
            <Text style={styles.footerRight}>Sem conta. Sem nuvem.</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      <NameEditor visible={editingName} name={name} onSave={saveName} onClose={() => setEditingName(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  content: { flex: 1, width: '100%', maxWidth: 620, alignSelf: 'center', paddingHorizontal: 22 },
  header: { paddingTop: 28, paddingBottom: 23 },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 34, fontWeight: '600', letterSpacing: -1 },
  practice: { color: colors.muted, fontSize: 10, letterSpacing: 1.2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  greeting: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 21 },
  editName: { minHeight: 44, justifyContent: 'center', paddingLeft: 5 },
  editNameText: { color: colors.primary, fontSize: 12 },
  summary: { color: colors.muted, fontSize: 13, marginTop: 1 },
  composer: { flexDirection: 'row', gap: 9, alignItems: 'stretch' },
  input: { flex: 1, minWidth: 0, minHeight: 50, fontSize: 14, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 13, paddingVertical: 12 },
  add: { minHeight: 50, paddingHorizontal: 15, justifyContent: 'center', borderRadius: 8, backgroundColor: colors.primary },
  addDisabled: { opacity: 0.45 },
  addText: { color: colors.surface, fontSize: 13, fontWeight: '600' },
  filters: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 24, gap: 5 },
  filter: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  selectedFilter: { borderBottomColor: colors.primary },
  filterText: { color: colors.muted, fontSize: 12 },
  selectedText: { color: colors.primary, fontWeight: '600' },
  count: { fontSize: 11, fontWeight: '400' },
  list: { paddingBottom: 20 },
  emptyList: { flexGrow: 1 },
  errorBox: { paddingTop: 8 },
  error: { color: colors.error, fontSize: 12, lineHeight: 19, paddingTop: 8 },
  reload: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  reloadText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  footer: { minHeight: 52, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 7 },
  footerText: { color: colors.muted, fontSize: 10 },
  footerRight: { flex: 1, textAlign: 'right', color: colors.muted, fontSize: 10 },
});
