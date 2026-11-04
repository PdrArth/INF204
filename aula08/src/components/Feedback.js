import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme.js';

export default function Feedback({ title, message, loading, onRetry }) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      {loading && <ActivityIndicator color={colors.primary} size="large" />}
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}><Text style={styles.buttonText}>Recarregar lista</Text></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 180, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background },
  title: { color: colors.text, fontSize: 19, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  message: { color: colors.muted, fontSize: 14, lineHeight: 22, maxWidth: 300, textAlign: 'center', marginTop: 8 },
  button: { minHeight: 46, justifyContent: 'center', paddingHorizontal: 20, marginTop: 18, borderRadius: 8, backgroundColor: colors.primary },
  buttonText: { color: colors.surface, fontWeight: '600', fontSize: 14 },
});
