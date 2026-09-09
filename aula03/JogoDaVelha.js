import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function vencedor(casas) {
  const linhas = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of linhas) {
    if (casas[a] && casas[a] === casas[b] && casas[a] === casas[c]) return casas[a];
  }
  return null;
}

export default function JogoDaVelha() {
  const [casas, setCasas] = useState(Array(9).fill(null));
  const ganhou = vencedor(casas);
  const empate = !ganhou && casas.every(Boolean);
  const jogador = casas.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
  function jogar(indice) {
    if (casas[indice] || ganhou || empate) return;
    setCasas(casas.map((valor, i) => i === indice ? jogador : valor));
  }
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Jogo da velha</Text>
      <Text accessibilityLiveRegion="polite" style={styles.status}>{ganhou ? `Vencedor: ${ganhou}` : empate ? 'Empate!' : `Vez de ${jogador}`}</Text>
      <View style={styles.tabuleiro}>
        {[0,1,2].map((linha) => <View key={linha} style={styles.linha}>
          {[0,1,2].map((coluna) => {
            const indice = linha * 3 + coluna;
            return <TouchableOpacity key={indice} accessibilityRole="button" accessibilityLabel={`Casa ${indice + 1}: ${casas[indice] || 'vazia'}`}
              disabled={Boolean(casas[indice] || ganhou || empate)} style={styles.casa} onPress={() => jogar(indice)}>
              <Text style={styles.marca}>{casas[indice]}</Text>
            </TouchableOpacity>;
          })}
        </View>)}
      </View>
      <TouchableOpacity accessibilityRole="button" style={styles.botao} onPress={() => setCasas(Array(9).fill(null))}><Text style={styles.textoBotao}>Reiniciar jogo</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 420, alignItems: 'center', paddingVertical: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#14325A' },
  status: { fontSize: 18, marginVertical: 16, color: '#505050' },
  tabuleiro: { width: '100%', maxWidth: 300, flexDirection: 'column' },
  linha: { flexDirection: 'row' },
  casa: { flex: 1, aspectRatio: 1, borderWidth: 1, borderColor: '#14325A', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  marca: { fontSize: 36, fontWeight: 'bold', color: '#0064A0' },
  botao: { marginTop: 20, backgroundColor: '#0064A0', padding: 14, borderRadius: 8 },
  textoBotao: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
