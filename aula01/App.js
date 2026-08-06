import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [contagem, setContagem] = useState(0);

  const incrementar = () => setContagem((valorAtual) => valorAtual + 1);
  const decrementar = () => setContagem((valorAtual) => Math.max(0, valorAtual - 1));
  const zerar = () => setContagem(0);

  return (
    <View style={styles.container}>
      <Text style={styles.ola}>Ola, Turma de ADS306!</Text>

      <Text style={styles.titulo}>Contagem Atual:</Text>
      <Text style={styles.numero}>{contagem}</Text>

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={[styles.botao, styles.botaoIncrementar]} onPress={incrementar}>
          <Text style={styles.botaoTexto}>Incrementar +1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, styles.botaoDecrementar]} onPress={decrementar}>
          <Text style={styles.botaoTexto}>Decrementar -1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, styles.botaoZerar]} onPress={zerar}>
          <Text style={styles.botaoTexto}>Zerar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    padding: 20
  },
  ola: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00695c',
    marginBottom: 20
  },
  titulo: {
    fontSize: 20,
    color: '#333333'
  },
  numero: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 24
  },
  botoesContainer: {
    width: '100%',
    maxWidth: 360,
    gap: 10
  },
  botao: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center'
  },
  botaoIncrementar: {
    backgroundColor: '#2e7d32'
  },
  botaoDecrementar: {
    backgroundColor: '#c62828'
  },
  botaoZerar: {
    backgroundColor: '#455a64'
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
