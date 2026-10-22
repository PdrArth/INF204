import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, headingFont } from '../theme.js';

export default function ContactSheet({ user, favorite, favoritesReady, onClose, onToggleFavorite }) {
  if (!user) return null;
  const address = [user.address?.street, user.address?.suite, user.address?.city].filter(Boolean).join(', ');
  const fields = [
    ['E-MAIL', user.email], ['TELEFONE', user.phone], ['EMPRESA', user.company?.name],
    ['ENDEREÇO', address], ['SITE', user.website],
  ].filter(([, value]) => typeof value === 'string' && value.trim());

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel="Fechar ficha pelo fundo" onPress={onClose} />
        <SafeAreaView style={styles.sheet} edges={['bottom']} accessibilityViewIsModal>
          <View style={styles.top}>
            <Text style={styles.caption}>FICHA DO CONTATO</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar ficha" style={styles.close}>
              <Text style={styles.closeText}>Fechar ×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <Text accessibilityRole="header" style={styles.name}>{user.name}</Text>
            {user.username && <Text style={styles.username}>@{user.username}</Text>}
            <Pressable accessibilityRole="button" accessibilityLabel={`${favorite ? 'Remover dos' : 'Adicionar aos'} favoritos`} accessibilityState={{ selected: favorite, disabled: !favoritesReady }} disabled={!favoritesReady} onPress={() => onToggleFavorite(user.id)} style={styles.favoriteButton}>
              <Text style={styles.favoriteText}>{favorite ? '★ Nos seus favoritos' : '☆ Guardar nos favoritos'}</Text>
            </Pressable>
            {fields.map(([label, value]) => (
              <View key={label} style={styles.field}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <Text selectable style={styles.value}>{value}</Text>
              </View>
            ))}
            <Text style={styles.note}>Este contato é fictício, fornecido pela API da atividade.</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(33,32,27,0.42)', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { backgroundColor: colors.background, width: '100%', maxWidth: 640, maxHeight: '90%', borderTopLeftRadius: 18, borderTopRightRadius: 18, overflow: 'hidden' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  caption: { color: colors.muted, fontSize: 10, letterSpacing: 1.2 },
  close: { minHeight: 48, minWidth: 60, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.primary, fontSize: 14 },
  content: { padding: 26, paddingBottom: 32 },
  name: { fontFamily: headingFont, fontSize: 32, lineHeight: 38, color: colors.text },
  username: { fontSize: 14, color: colors.muted, marginTop: 6 },
  favoriteButton: { alignSelf: 'flex-start', minHeight: 46, justifyContent: 'center', marginTop: 10, marginBottom: 6 },
  favoriteText: { color: colors.primary, fontSize: 14, fontWeight: '500' },
  field: { paddingVertical: 15, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  fieldLabel: { color: colors.muted, fontSize: 10, letterSpacing: 1, marginBottom: 6 },
  value: { color: colors.text, fontSize: 16, lineHeight: 24 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 14 },
});
