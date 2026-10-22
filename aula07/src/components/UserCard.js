import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme.js';

export default function UserCard({ user }) {
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('');

  return (
    <View style={styles.card}>
      <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email} selectable>{user.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 18 },
  avatar: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.primary, fontSize: 15, fontWeight: '800' },
  details: { flex: 1, minWidth: 0 },
  name: { color: colors.text, fontSize: 17, fontWeight: '700', lineHeight: 24 },
  email: { color: colors.muted, fontSize: 14, marginTop: 3, lineHeight: 21 },
});
