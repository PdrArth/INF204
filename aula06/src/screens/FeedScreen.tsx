import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';
import { MainTabParamList, RootStackParamList } from '../types/navigation';

type FeedNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Feed'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function FeedScreen() {
  const navigation = useNavigation<FeedNavigationProp>();

  const abrirDetalhes = () => {
    navigation.navigate('DetalhesProduto', {
      itemId: 86,
      nomeProduto: 'Controle PS5',
      ativo: true,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.conteudo}>
        <Text style={styles.etiqueta}>INF204 • PRÁTICA 06</Text>
        <Text style={styles.titulo}>Navegação mobile</Text>
        <Text style={styles.subtitulo}>
          Uma aba pode abrir uma tela de detalhes por cima da navegação principal.
        </Text>

        <View style={styles.card}>
          <View style={styles.icone}>
            <Text style={styles.iconeTexto}>⌘</Text>
          </View>
          <Text style={styles.cardEtiqueta}>PRODUTO EM DESTAQUE</Text>
          <Text style={styles.cardTitulo}>Controle PS5</Text>
          <Text style={styles.cardTexto}>
            Toque no botão para enviar informações da tela inicial para a tela de detalhes.
          </Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
            onPress={abrirDetalhes}
          >
            <Text style={styles.textoBotao}>Ver detalhes do produto</Text>
            <Text style={styles.seta}>→</Text>
          </Pressable>
        </View>

        <View style={styles.legenda}>
          <Text style={styles.legendaNumero}>01</Text>
          <View style={styles.legendaConteudo}>
            <Text style={styles.legendaTitulo}>Stack + Tabs</Text>
            <Text style={styles.legendaTexto}>As abas ficam dentro da pilha principal.</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { flex: 1, padding: 22 },
  etiqueta: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginTop: 14 },
  titulo: { color: colors.primaryDark, fontSize: 32, fontWeight: '800', marginTop: 7 },
  subtitulo: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 8, maxWidth: 520 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginTop: 30,
    padding: 22,
    shadowColor: '#183A57',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  icone: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  iconeTexto: { color: colors.primary, fontSize: 31, fontWeight: '800' },
  cardEtiqueta: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 22 },
  cardTitulo: { color: colors.text, fontSize: 25, fontWeight: '800', marginTop: 6 },
  cardTexto: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 9 },
  botao: { minHeight: 50, backgroundColor: colors.primary, borderRadius: 14, marginTop: 22, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  botaoPressionado: { opacity: 0.8 },
  textoBotao: { color: colors.surface, fontSize: 15, fontWeight: '800' },
  seta: { color: colors.surface, fontSize: 24 },
  legenda: { flexDirection: 'row', alignItems: 'center', marginTop: 28, paddingHorizontal: 4 },
  legendaNumero: { color: colors.primary, fontSize: 20, fontWeight: '800', marginRight: 14 },
  legendaConteudo: { flex: 1 },
  legendaTitulo: { color: colors.text, fontSize: 15, fontWeight: '800' },
  legendaTexto: { color: colors.muted, fontSize: 13, marginTop: 3 },
});
