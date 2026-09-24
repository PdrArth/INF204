import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.conteudo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>PA</Text>
        </View>
        <Text style={styles.etiqueta}>ABA INDEPENDENTE</Text>
        <Text style={styles.titulo}>Perfil do aluno</Text>
        <Text style={styles.texto}>
          Esta tela pertence ao Bottom Tab Navigator. Ela troca de contexto sem empilhar uma nova rota.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitulo}>Pedro Arthur</Text>
          <Text style={styles.infoTexto}>INF204 • Desenvolvimento para Dispositivos Móveis</Text>
          <View style={styles.linha} />
          <Text style={styles.infoLegenda}>Arquitetura usada</Text>
          <Text style={styles.infoValor}>Stack + Bottom Tabs + TypeScript</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { flex: 1, padding: 22 },
  avatar: { width: 76, height: 76, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  avatarTexto: { color: colors.surface, fontSize: 24, fontWeight: '800' },
  etiqueta: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 26 },
  titulo: { color: colors.primaryDark, fontSize: 30, fontWeight: '800', marginTop: 7 },
  texto: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 10, maxWidth: 520 },
  infoCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, marginTop: 28, shadowColor: '#183A57', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  infoTitulo: { color: colors.text, fontSize: 20, fontWeight: '800' },
  infoTexto: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  linha: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  infoLegenda: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  infoValor: { color: colors.success, fontSize: 15, fontWeight: '800', marginTop: 5 },
});
