import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme.js';

export default function NameEditor({ visible, name, onSave, onClose }) {
  const [draft, setDraft] = useState(name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => { if (visible) { setDraft(name); setError(null); } }, [visible, name]);

  async function save() {
    if (saving || !draft.trim()) return;
    setSaving(true);
    setError(null);
    try { await onSave(draft); onClose(); }
    catch { setError('Não foi possível guardar o nome. Tente novamente.'); }
    finally { setSaving(false); }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!saving) onClose(); }}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.dialog} accessibilityViewIsModal>
          <Text accessibilityRole="header" style={styles.title}>Como você quer ser chamado?</Text>
          <Text style={styles.hint}>Esse nome fica salvo só neste aparelho.</Text>
          <TextInput accessibilityLabel="Seu nome" value={draft} onChangeText={setDraft} maxLength={60} editable={!saving} autoFocus autoCapitalize="words" returnKeyType="done" onSubmitEditing={save} style={styles.input} />
          {error && <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>}
          <View style={styles.actions}>
            <Pressable accessibilityRole="button" disabled={saving} onPress={onClose} style={styles.cancel}><Text style={styles.cancelText}>Cancelar</Text></Pressable>
            <Pressable accessibilityRole="button" disabled={saving || !draft.trim()} onPress={save} style={[styles.save, (saving || !draft.trim()) && styles.disabled]}><Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar nome'}</Text></Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(25,35,29,0.3)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dialog: { width: '100%', maxWidth: 400, padding: 24, backgroundColor: colors.surface, borderRadius: 16 },
  title: { color: colors.text, fontSize: 21, fontWeight: '600', lineHeight: 28 },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text, fontSize: 16, marginTop: 22, minHeight: 48 },
  error: { color: colors.error, fontSize: 13, lineHeight: 19, marginTop: 10 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 18 },
  cancel: { minHeight: 46, paddingHorizontal: 12, justifyContent: 'center' },
  cancelText: { color: colors.muted, fontSize: 14 },
  save: { minHeight: 46, paddingHorizontal: 18, justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 8 },
  saveText: { color: colors.surface, fontSize: 14, fontWeight: '600' },
  disabled: { opacity: 0.5 },
});
