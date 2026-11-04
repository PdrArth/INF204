import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme.js';

export default function TaskRow({ task, disabled, onToggle }) {
  const done = task.concluida === 1;
  return (
    <Pressable accessibilityRole="checkbox" accessibilityLabel={task.descricao} accessibilityState={{ checked: done, disabled }} aria-checked={done} aria-disabled={disabled} disabled={disabled} onPress={() => onToggle(task)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.checkbox, done && styles.checked]} importantForAccessibility="no">
        {done && <Text style={styles.tick}>✓</Text>}
      </View>
      <Text style={[styles.description, done && styles.done]}>{task.descricao}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 76, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  checkbox: { width: 23, height: 23, borderWidth: 1.5, borderColor: '#89988E', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checked: { borderColor: colors.primary, backgroundColor: colors.primary },
  tick: { color: colors.surface, fontSize: 16, fontWeight: '700', lineHeight: 20 },
  description: { flex: 1, color: colors.text, fontSize: 16, lineHeight: 24 },
  done: { color: colors.muted, textDecorationLine: 'line-through' },
  pressed: { opacity: 0.6 },
});
