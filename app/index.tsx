import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useProdutos } from '../src/contexts/ProdutosContext';
import { useRouter } from 'expo-router';
import { Produto } from '../src/types';

export default function Home() {
  const { produtosAtivos, produtosInativos } = useProdutos();
  const router = useRouter();

  const renderItem = ({ item }: { item: Produto }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => router.push(`/produtos/${item.id}` as any)}
    >
      <Text style={styles.itemName}>{item.nome}</Text>
      <Text style={styles.itemPrice}>
        R$ {item.preco.toFixed(2).replace('.', ',')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { title: 'Produtos ativos', data: produtosAtivos },
          { title: 'Produtos inativos', data: produtosInativos }
        ]}
        keyExtractor={(item) => item.title}
        renderItem={({ item: section }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.data.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhum produto {section.title.split(' ')[1].slice(0, -1)} cadastrado.
              </Text>
            ) : (
              <FlatList
                data={section.data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/cadastro' as any)}
      >
        <Text style={styles.fabText}>Novo Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sectionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  fabText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
