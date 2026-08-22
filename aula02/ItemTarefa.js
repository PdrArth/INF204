import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ItemTarefa({ tarefa }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.textoTarefa, tarefa.concluida && styles.tarefaConcluida]}>
        {tarefa.concluida ? '[OK] ' : '[PENDENTE] '}
        {tarefa.descricao}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textoTarefa: {
    color: '#333333',
    fontSize: 16,
  },
  tarefaConcluida: {
    color: '#2e7d32',
  },
});
