import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../components/UserCard.js';
import ListFeedback from '../components/ListFeedback.js';
import { getUsers, getErrorMessage } from '../services/users.js';
import { colors } from '../theme.js';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const request = useRef(null);

  async function loadUsers() {
    // Cancelar o pedido anterior evita respostas antigas sobrescrevendo as novas.
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers({ signal: controller.signal });
      if (!controller.signal.aborted) setUsers(data);
    } catch (cause) {
      if (!controller.signal.aborted) setError(getErrorMessage(cause));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    // Busca inicial apos montar a tela. O efeito nao e uma funcao async.
    loadUsers();
    return () => request.current?.abort();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>DIRETÓRIO DE CONTATOS</Text>
          <Text style={styles.title} accessibilityRole="header">Pessoas</Text>
          <Text style={styles.subtitle}>Um lugar para encontrar quem você procura.</Text>
        </View>
        {loading ? (
          <ListFeedback loading title="Buscando pessoas..." message="Estamos consultando os contatos. Só um instante." />
        ) : error ? (
          <ListFeedback title="Não foi possível carregar" message={error} onRetry={loadUsers} />
        ) : (
          <>
            <View style={styles.summary}>
              <Text style={styles.section}>Todos os contatos</Text>
              <Text style={styles.count} accessibilityLabel={`${users.length} contatos`}>{users.length}</Text>
            </View>
            <FlatList
              data={users}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => <UserCard user={item} />}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={<ListFeedback title="Nenhum usuário encontrado" message="A consulta foi concluída, mas não há contatos para mostrar." />}
              contentContainerStyle={users.length ? styles.list : styles.emptyList}
            />
          </>
        )}
        <Text style={styles.footer}>Dados fictícios para demonstração • INF204</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20 },
  header: { paddingTop: 28, paddingBottom: 28 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 36, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 7 },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14 },
  section: { color: colors.text, fontSize: 16, fontWeight: '700' },
  count: { minWidth: 32, textAlign: 'center', backgroundColor: colors.soft, color: colors.primary, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 9, fontWeight: '800' },
  separator: { height: 10 },
  list: { paddingBottom: 12 },
  emptyList: { flexGrow: 1 },
  footer: { textAlign: 'center', color: colors.muted, fontSize: 11, paddingVertical: 14 },
});
