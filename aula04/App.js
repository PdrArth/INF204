import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Props são informações recebidas do pai; o estado permanece na urna.
function Candidato({ nome, votos, total, onVotar }) {
  const percentual = total === 0 ? 0 : (votos / total) * 100;
  return (
    <View style={styles.candidatoContainer}>
      <Text style={styles.nomeCandidato}>Candidato {nome}: {votos} votos ({percentual.toFixed(1)}%)</Text>
      <TouchableOpacity accessibilityRole="button" style={styles.botaoVotar} onPress={onVotar}>
        <Text style={styles.textoBotao}>Votar em {nome}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function UrnaEletronica() {
  const [votosA, setVotosA] = useState(0);
  const [votosB, setVotosB] = useState(0);
  const [votosC, setVotosC] = useState(0);
  const [nomeMesario, setNomeMesario] = useState('');

  // Dados derivados: não precisam de estados adicionais.
  const totalVotos = votosA + votosB + votosC;
  const zerarUrna = () => {
    setVotosA(0);
    setVotosB(0);
    setVotosC(0);
  };

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.painel}>
        <Text style={styles.disciplina}>INF204 • PRÁTICA 04</Text>
        <Text style={styles.titulo}>Painel de Votação</Text>
        <Text style={styles.rotulo}>Nome do mesário</Text>
        <TextInput accessibilityLabel="Nome do mesário" style={styles.input} placeholder="Digite seu nome" value={nomeMesario} onChangeText={setNomeMesario} />
        <Text style={styles.mesario}>Mesário atual: {nomeMesario || 'Não informado'}</Text>
        <Candidato nome="A" votos={votosA} total={totalVotos} onVotar={() => setVotosA(prev => prev + 1)} />
        <Candidato nome="B" votos={votosB} total={totalVotos} onVotar={() => setVotosB(prev => prev + 1)} />
        <Candidato nome="C" votos={votosC} total={totalVotos} onVotar={() => setVotosC(prev => prev + 1)} />
        <View style={styles.rodape}>
          <Text style={styles.totalTexto} accessibilityLiveRegion="polite">Total de Votos: {totalVotos}</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.botaoZerar} onPress={zerarUrna}>
            <Text style={styles.textoBotao}>Zerar Urna</Text>
          </TouchableOpacity>
          <Text style={styles.aviso}>Simulação didática. Os dados são apagados ao recarregar o aplicativo.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20, paddingVertical: 48 },
  painel: { width: '100%', maxWidth: 540 },
  disciplina: { color: '#0064A0', textAlign: 'center', fontWeight: 'bold', marginBottom: 8 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, color: '#14325A', textAlign: 'center' },
  rotulo: { fontSize: 16, marginBottom: 8, color: '#14325A' },
  input: { backgroundColor: '#FFF', borderColor: '#8292A5', borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  mesario: { marginVertical: 16, color: '#14325A', fontSize: 16 },
  candidatoContainer: { width: '100%', backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center', elevation: 2 },
  nomeCandidato: { fontSize: 18, marginBottom: 10, textAlign: 'center', color: '#14325A' },
  botaoVotar: { backgroundColor: '#0064A0', padding: 14, borderRadius: 5, width: '80%', alignItems: 'center' },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  rodape: { marginTop: 20, alignItems: 'center', width: '100%', borderTopWidth: 1, borderColor: '#CCC', paddingTop: 20 },
  totalTexto: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#14325A' },
  botaoZerar: { backgroundColor: '#565F6B', padding: 15, borderRadius: 5 },
  aviso: { color: '#565F6B', fontSize: 13, textAlign: 'center', marginTop: 16, lineHeight: 19 },
});
