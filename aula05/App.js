import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Dados estaticos: ficam fora do componente e nao sao recriados a cada renderizacao.
const contatosIniciais = [
  { id: '1', nome: 'Alice Silva', telefone: '(31) 99999-1111' },
  { id: '2', nome: 'Bruno Costa', telefone: '(31) 98888-2222' },
  { id: '3', nome: 'Carlos Souza', telefone: '(31) 97777-3333' },
  { id: '4', nome: 'Diana Rocha', telefone: '(31) 96666-4444' },
  { id: '5', nome: 'Eduardo Lima', telefone: '(31) 95555-5555' },
  { id: '6', nome: 'Fernanda Alves', telefone: '(31) 94444-6666' },
  { id: '7', nome: 'Gabriel Mendes', telefone: '(31) 93333-7777' },
];

export default function Agenda() {
  const [contatos, setContatos] = useState(contatosIniciais);

  const renderizarContato = ({ item }) => (
    <View style={styles.cardContato}>
      <View>
        <Text style={styles.nomeText}>{item.nome}</Text>
        <Text style={styles.telefoneText}>{item.telefone}</Text>
      </View>
      <Text style={styles.indicador}>›</Text>
    </View>
  );

  const renderizarSeparador = () => <View style={styles.separador} />;

  const renderizarVazio = () => (
    <View style={styles.containerVazio}>
      <Text style={styles.iconeVazio}>☎</Text>
      <Text style={styles.textoVazio}>Agenda vazia</Text>
      <Text style={styles.ajudaVazio}>Toque em “Restaurar contatos” para preencher a lista novamente.</Text>
    </View>
  );

  const limparAgenda = () => setContatos([]);
  const restaurarContatos = () => setContatos(contatosIniciais);

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.etiqueta}>INF204 • PRÁTICA 05</Text>
          <Text style={styles.titulo}>Minha agenda</Text>
          <Text style={styles.subtitulo}>Lista virtualizada de contatos</Text>
        </View>
        <View style={styles.iconeCabecalho}>
          <Text style={styles.iconeCabecalhoTexto}>☎</Text>
        </View>
      </View>

      <View style={styles.painel}>
        <View style={styles.resumoLinha}>
          <Text style={styles.resumoTexto}>
            {contatos.length} {contatos.length === 1 ? 'contato' : 'contatos'}
          </Text>
          <Text style={styles.resumoLegenda}>FlatList ativa</Text>
        </View>

        <FlatList
          data={contatos}
          keyExtractor={(item) => item.id}
          renderItem={renderizarContato}
          ItemSeparatorComponent={renderizarSeparador}
          ListEmptyComponent={renderizarVazio}
          contentContainerStyle={contatos.length === 0 ? styles.listaVazia : styles.lista}
        />

        <View style={styles.acoes}>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.botaoLimpar}
            onPress={limparAgenda}
          >
            <Text style={styles.textoBotaoSecundario}>Limpar tudo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.botaoRestaurar}
            onPress={restaurarContatos}
          >
            <Text style={styles.textoBotaoPrincipal}>Restaurar contatos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.rodape}>
        A lista usa virtualização para renderizar itens com eficiência.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FB',
    paddingTop: 54,
    paddingHorizontal: 20,
  },
  cabecalho: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  etiqueta: {
    color: '#2E6B9F',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  titulo: {
    color: '#112A46',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitulo: {
    color: '#63758A',
    fontSize: 15,
    marginTop: 5,
  },
  iconeCabecalho: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#DCECF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeCabecalhoTexto: {
    color: '#16689B',
    fontSize: 28,
  },
  painel: {
    width: '100%',
    maxWidth: 560,
    flex: 1,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#1C3854',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  resumoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  resumoTexto: {
    color: '#112A46',
    fontSize: 17,
    fontWeight: '800',
  },
  resumoLegenda: {
    color: '#2E6B9F',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#EAF5FC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  lista: {
    paddingBottom: 4,
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cardContato: {
    minHeight: 76,
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: '#F8FBFE',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nomeText: {
    color: '#173653',
    fontSize: 17,
    fontWeight: '800',
  },
  telefoneText: {
    color: '#6A7C8F',
    fontSize: 15,
    marginTop: 5,
  },
  indicador: {
    color: '#8EA5B9',
    fontSize: 28,
    fontWeight: '300',
    paddingLeft: 12,
  },
  separador: {
    height: 8,
    backgroundColor: '#FFFFFF',
  },
  containerVazio: {
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  iconeVazio: {
    color: '#8EA5B9',
    fontSize: 38,
    marginBottom: 10,
  },
  textoVazio: {
    color: '#173653',
    fontSize: 19,
    fontWeight: '800',
  },
  ajudaVazio: {
    color: '#6A7C8F',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  acoes: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5EDF4',
    marginTop: 14,
    paddingTop: 14,
  },
  botaoLimpar: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2A3A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoRestaurar: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: '#176B9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotaoSecundario: {
    color: '#B04444',
    fontSize: 14,
    fontWeight: '800',
  },
  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  rodape: {
    color: '#71859A',
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 560,
    alignSelf: 'center',
    textAlign: 'center',
    paddingVertical: 15,
  },
});
