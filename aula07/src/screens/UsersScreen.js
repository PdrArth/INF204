import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../components/UserCard.js';
import ListFeedback from '../components/ListFeedback.js';
import ContactSheet from '../components/ContactSheet.js';
import useFavorites from '../hooks/useFavorites.js';
import { getUsers, getErrorMessage } from '../services/users.js';
import { contactLetter, filterContacts } from '../utils/contacts.js';
import { colors, headingFont } from '../theme.js';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const request = useRef(null);
  const { favorites, ready, storageError, toggleFavorite } = useFavorites();

  async function loadUsers() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers({ signal: controller.signal });
      if (!controller.signal.aborted) {
        setUsers(data);
        setUpdatedAt(new Date());
      }
    } catch (cause) {
      if (!controller.signal.aborted) setError(getErrorMessage(cause));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    return () => request.current?.abort();
  }, []);

  const visibleUsers = filterContacts(users, { query, favorites, onlyFavorites });
  const favoriteCount = users.filter(user => favorites.includes(user.id)).length;
  const currentContact = selected ? users.find(user => user.id === selected.id) || selected : null;
  const updateTime = updatedAt?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.byline}>
            <Text style={styles.owner}>AGENDA DO PEDRO</Text>
            <Text style={styles.edition}>nº 07</Text>
          </View>
          <Text style={styles.title} accessibilityRole="header">Caderneta<Text style={styles.titleDot}>.</Text></Text>
          <Text style={styles.subtitle}>Nome, contato e uma estrela para não esquecer.</Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            accessibilityLabel="Buscar contatos"
            value={query}
            onChangeText={setQuery}
            placeholder="Nome, empresa ou cidade"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => setQuery('')} style={styles.clearSearch}>
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.tabs}>
          {[false, true].map(favoriteTab => (
            <Pressable
              key={String(favoriteTab)}
              accessibilityRole="tab"
              accessibilityLabel={favoriteTab ? 'Favoritos' : 'Todos os contatos'}
              accessibilityState={{ selected: onlyFavorites === favoriteTab }}
              onPress={() => setOnlyFavorites(favoriteTab)}
              style={[styles.tab, onlyFavorites === favoriteTab && styles.activeTab]}
            >
              <Text style={[styles.tabText, onlyFavorites === favoriteTab && styles.activeText]}>
                {favoriteTab ? 'Favoritos' : 'Todos'} <Text style={styles.tabCount}>{favoriteTab ? favoriteCount : users.length}</Text>
              </Text>
            </Pressable>
          ))}
        </View>

        {storageError && <Text style={styles.warning} accessibilityLiveRegion="polite">{storageError}</Text>}
        {error && users.length > 0 && <Text style={styles.warning} accessibilityLiveRegion="polite">Não consegui atualizar. {error} A lista anterior continua disponível.</Text>}

        {loading && users.length === 0 ? (
          <ListFeedback loading title="Buscando pessoas..." message="Abrindo sua lista de contatos." />
        ) : error && users.length === 0 ? (
          <ListFeedback title="Não foi possível carregar" message={error} onRetry={loadUsers} />
        ) : (
          <FlatList
            data={visibleUsers}
            keyExtractor={item => String(item.id)}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderItem={({ item, index }) => (
              <UserCard
                user={item}
                letter={index === 0 || contactLetter(item) !== contactLetter(visibleUsers[index - 1]) ? contactLetter(item) : ''}
                favorite={favorites.includes(item.id)}
                favoritesReady={ready}
                onOpen={setSelected}
                onToggleFavorite={toggleFavorite}
              />
            )}
            ListEmptyComponent={
              <ListFeedback
                title={query.trim() ? 'Nenhum contato por aqui' : onlyFavorites ? 'Sua lista mais curta' : 'Nenhum usuário encontrado'}
                message={query.trim() ? 'Tente outro nome, empresa ou cidade.' : onlyFavorites ? 'Marque a estrela ao lado de um nome. Ele fica guardado nos favoritos deste aparelho.' : 'A API não retornou contatos desta vez.'}
                onRetry={query.trim() ? () => setQuery('') : onlyFavorites ? () => setOnlyFavorites(false) : undefined}
                actionLabel={query.trim() ? 'Limpar busca' : 'Ver todos os contatos'}
              />
            }
            contentContainerStyle={visibleUsers.length ? styles.list : styles.emptyList}
          />
        )}

        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.footnote}>{query.trim() ? visibleUsers.length + ' de ' + users.length + ' contatos' : 'Contatos fictícios · INF204'}</Text>
            <Text style={styles.updated}>{updateTime ? 'Consultado às ' + updateTime : 'Prática de consumo de API'}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Atualizar contatos" disabled={loading} accessibilityState={{ disabled: loading }} onPress={loadUsers} style={styles.refresh}>
            {loading ? <ActivityIndicator size="small" color={colors.primary} /> : <Text style={styles.refreshText}>Atualizar ↻</Text>}
          </Pressable>
        </View>

        <ContactSheet user={currentContact} favorite={currentContact ? favorites.includes(currentContact.id) : false} favoritesReady={ready} onClose={() => setSelected(null)} onToggleFavorite={toggleFavorite} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 24 },
  header: { paddingTop: 22, paddingBottom: 24 },
  byline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  owner: { color: colors.muted, fontSize: 10, fontWeight: '600', letterSpacing: 1.5 },
  edition: { color: colors.primary, fontFamily: headingFont, fontStyle: 'italic', fontSize: 14 },
  title: { color: colors.text, fontFamily: headingFont, fontSize: 44, fontWeight: '400', letterSpacing: -1.5 },
  titleDot: { color: colors.primary },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 6 },
  searchBox: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 6, minHeight: 48, flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1, minWidth: 0, color: colors.text, fontSize: 15, paddingHorizontal: 14, paddingVertical: 14 },
  clearSearch: { width: 44, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  clearText: { fontSize: 24, color: colors.muted },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 16 },
  tab: { minHeight: 48, marginRight: 28, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: colors.primary },
  tabText: { color: colors.muted, fontSize: 14 },
  activeText: { color: colors.text, fontWeight: '600' },
  tabCount: { color: colors.muted, fontWeight: '400', fontSize: 12 },
  warning: { color: colors.error, fontSize: 12, lineHeight: 18, paddingVertical: 12 },
  list: { paddingBottom: 12 },
  emptyList: { flexGrow: 1 },
  footer: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 5, paddingBottom: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerInfo: { flex: 1, paddingRight: 8 },
  footnote: { color: colors.muted, fontSize: 10, lineHeight: 16 },
  updated: { color: colors.muted, fontSize: 10, lineHeight: 16 },
  refresh: { minWidth: 90, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  refreshText: { color: colors.primary, fontSize: 13, fontWeight: '500' },
});
