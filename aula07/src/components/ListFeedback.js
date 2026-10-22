import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme.js';

export default function ListFeedback({ loading = false, title, message, onRetry }) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {loading && <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Carregando usuários" />}
      <Text style={styles.title} accessibilityRole="header">{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable accessibilityRole="button" onPress={onRetry} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 250, alignItems: 'center', justifyContent: 'center', padding: 28 },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 18 },
  message: { color: colors.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 8, maxWidth: 320 },
  button: { minHeight: 48, borderRadius: 13, paddingHorizontal: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  buttonText: { color: colors.surface, fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.8 },
});
