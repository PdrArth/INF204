import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, headingFont } from '../theme.js';

export default function UserCard({ user, letter, favorite, favoritesReady, onOpen, onToggleFavorite }) {
  return (
    <View style={styles.row}>
      <Text style={styles.letter} importantForAccessibility="no">{letter}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Ver ficha de ${user.name}`} onPress={() => onOpen(user)} style={({ pressed }) => [styles.person, pressed && styles.pressed]}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`${favorite ? 'Desmarcar' : 'Favoritar'} ${user.name}`} accessibilityState={{ selected: favorite, disabled: !favoritesReady }} disabled={!favoritesReady} hitSlop={4} onPress={() => onToggleFavorite(user.id)} style={({ pressed }) => [styles.starButton, pressed && styles.pressed]}>
        <Text style={[styles.star, favorite && styles.favorite]}>{favorite ? '★' : '☆'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 86, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  letter: { width: 28, alignSelf: 'flex-start', paddingTop: 22, color: colors.primary, fontSize: 17, fontFamily: headingFont },
  person: { flex: 1, minWidth: 0, justifyContent: 'center', paddingVertical: 19, paddingRight: 6 },
  name: { color: colors.text, fontSize: 17, fontWeight: '500', lineHeight: 24 },
  email: { color: colors.muted, fontSize: 13, marginTop: 4, lineHeight: 20 },
  starButton: { width: 44, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  star: { color: colors.muted, fontSize: 26 },
  favorite: { color: colors.primary },
  pressed: { opacity: 0.55 },
});
