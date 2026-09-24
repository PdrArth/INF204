import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhesProduto'>;

export default function ProductDetailsScreen({ route, navigation }: Props) {
  const { itemId, nomeProduto, ativo } = route.params;

  const abrirOutroProduto = () => {
    navigation.push('DetalhesProduto', {
      itemId: itemId + 1,
      nomeProduto: 'Headset sem fio',
      ativo: false,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.conteudo}>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>ROTA COM PARÂMETROS</Text>
        </View>
        <Text style={styles.titulo}>{nomeProduto}</Text>
        <Text style={styles.subtitulo}>A tela recebeu os dados enviados pela rota inicial.</Text>

        <View style={styles.card}>
          <View style={styles.linhaDados}>
            <Text style={styles.rotulo}>ID do produto</Text>
            <Text style={styles.valor}>{itemId}</Text>
          </View>
          <View style={styles.linhaDados}>
            <Text style={styles.rotulo}>Status</Text>
            <Text style={[styles.valor, ativo ? styles.ativo : styles.inativo]}>
              {ativo ? 'Disponível' : 'Esgotado'}
            </Text>
          </View>
          <View style={styles.divisor} />
          <Text style={styles.explicacao}>
            `route.params` funciona como uma encomenda: a tela anterior envia os dados e esta tela abre a caixa.
          </Text>
        </View>

        <Pressable accessibilityRole="button" style={styles.botaoPrincipal} onPress={abrirOutroProduto}>
          <Text style={styles.textoBotaoPrincipal}>Usar navigation.push</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.botaoSecundario} onPress={() => navigation.goBack()}>
          <Text style={styles.textoBotaoSecundario}>Voltar uma tela</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.botaoLink} onPress={() => navigation.popToTop()}>
          <Text style={styles.textoBotaoLink}>Voltar para a navegação principal</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { flex: 1, padding: 22 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginTop: 8 },
  badgeTexto: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.7 },
  titulo: { color: colors.primaryDark, fontSize: 30, fontWeight: '800', marginTop: 20 },
  subtitulo: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 7 },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, marginTop: 24, shadowColor: '#183A57', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  linhaDados: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  rotulo: { color: colors.muted, fontSize: 15 },
  valor: { color: colors.text, fontSize: 16, fontWeight: '800' },
  ativo: { color: colors.success },
  inativo: { color: '#B04444' },
  divisor: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  explicacao: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  botaoPrincipal: { minHeight: 48, backgroundColor: colors.primary, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  textoBotaoPrincipal: { color: colors.surface, fontSize: 15, fontWeight: '800' },
  botaoSecundario: { minHeight: 48, borderWidth: 1, borderColor: colors.primary, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  textoBotaoSecundario: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  botaoLink: { alignItems: 'center', padding: 14, marginTop: 5 },
  textoBotaoLink: { color: colors.muted, fontSize: 13, fontWeight: '700' },
});
