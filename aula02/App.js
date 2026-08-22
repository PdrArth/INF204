import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ItemTarefa from './ItemTarefa';

const tarefasIniciais = [
  { id: 1, descricao: 'Estudar ES6+', concluida: true },
  { id: 2, descricao: 'Configurar ambiente Expo', concluida: true },
  { id: 3, descricao: 'Entender o funcionamento do JSX', concluida: false },
  { id: 4, descricao: 'Finalizar Roteiro de Prática 02', concluida: false },
];

export default function App() {
  const [tarefas, setTarefas] = useState(tarefasIniciais);
  const tarefasPendentes = tarefas.filter((tarefa) => !tarefa.concluida);

  const adicionarTarefa = () => {
    setTarefas((tarefasAtuais) => {
      const proximaId = tarefasAtuais.length
        ? Math.max(...tarefasAtuais.map((tarefa) => tarefa.id)) + 1
        : 1;

      return [
        ...tarefasAtuais,
        {
          id: proximaId,
          descricao: `Nova tarefa ${proximaId}`,
          concluida: false,
        },
      ];
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.ola}>Olá, Pedro Arthur!</Text>
      <Text style={styles.titulo}>Lista de Tarefas</Text>

      <Text style={styles.subtitulo}>Todas as tarefas</Text>
      {tarefas.map((tarefa) => (
        <ItemTarefa key={tarefa.id} tarefa={tarefa} />
      ))}

      <Text style={styles.subtitulo}>Tarefas pendentes</Text>
      {tarefasPendentes.length > 0 ? (
        tarefasPendentes.map((tarefa) => (
          <ItemTarefa key={`pendente-${tarefa.id}`} tarefa={tarefa} />
        ))
      ) : (
        <Text style={styles.vazio}>Nenhuma tarefa pendente.</Text>
      )}

      <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
        <Text style={styles.botaoTexto}>Adicionar tarefa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  ola: {
    color: '#20325a',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  titulo: {
    color: '#20325a',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitulo: {
    color: '#20325a',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  vazio: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 10,
  },
  botao: {
    alignItems: 'center',
    backgroundColor: '#20325a',
    borderRadius: 8,
    marginTop: 14,
    padding: 15,
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
