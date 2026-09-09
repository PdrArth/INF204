import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import JogoDaVelha from './JogoDaVelha';

const perfis = [
  { id: 1, nome: 'Pedro Arthur', profissao: 'Estudante de desenvolvimento mobile', avatar: 'https://i.pravatar.cc/240?img=12' },
  { id: 2, nome: 'Ana Silva', profissao: 'Designer de interfaces', avatar: 'https://i.pravatar.cc/240?img=47' },
  { id: 3, nome: 'Lucas Santos', profissao: 'Desenvolvedor de software', avatar: 'https://i.pravatar.cc/240?img=13' },
];

function CartaoPerfil({ perfil }) {
  const [nome, setNome] = useState(perfil.nome);
  const [seguindo, setSeguindo] = useState(false);
  const [falhaImagem, setFalhaImagem] = useState(false);
  return (
    <View style={styles.cartao}>
      {falhaImagem ? <View style={[styles.avatar, styles.fallback]}><Text style={styles.inicial}>{nome.trim().charAt(0) || '?'}</Text></View> :
        <Image source={{ uri: perfil.avatar }} style={styles.avatar} accessibilityLabel={`Avatar de ${nome}`} onError={() => setFalhaImagem(true)} />}
      <Text style={styles.nome}>{nome || 'Sem nome'}</Text>
      <Text style={styles.profissao}>{perfil.profissao}</Text>
      <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: seguindo }} activeOpacity={0.7}
        style={[styles.botao, seguindo && styles.botaoDesativado]} onPress={() => setSeguindo(!seguindo)}>
        <Text style={styles.textoBotao}>{seguindo ? 'Já Seguindo' : 'Seguir'}</Text>
      </TouchableOpacity>
      {seguindo && <Text accessibilityLiveRegion="polite" style={styles.status}>Seguindo {nome || 'este perfil'}</Text>}
      <TextInput accessibilityLabel={`Alterar nome do perfil ${perfil.id}`} style={styles.input} placeholder="Alterar nome..." value={nome} onChangeText={setNome} />
    </View>
  );
}

export default function App() {
  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Prática 03 • Perfis</Text>
      {perfis.map((perfil) => <CartaoPerfil key={perfil.id} perfil={perfil} />)}
      <JogoDaVelha />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 40 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#14325A', marginBottom: 24 },
  cartao: { width: '100%', maxWidth: 420, backgroundColor: '#FFF', padding: 24, borderRadius: 15, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  fallback: { backgroundColor: '#DFEAF4', alignItems: 'center', justifyContent: 'center' },
  inicial: { fontSize: 40, color: '#14325A' },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#14325A', textAlign: 'center' },
  profissao: { fontSize: 16, color: '#505050', marginBottom: 20, textAlign: 'center' },
  botao: { backgroundColor: '#0064A0', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginBottom: 16 },
  botaoDesativado: { backgroundColor: '#606060' },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  status: { color: '#505050', marginBottom: 12 },
  input: { width: '100%', borderWidth: 1, borderColor: '#AAA', borderRadius: 8, padding: 12, textAlign: 'center' },
});
