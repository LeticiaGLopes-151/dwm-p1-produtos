import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProdutos } from '../../src/contexts/ProdutosContext';

export default function DetalhesProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { produtos, alterarSituacaoProduto } = useProdutos();
  const router = useRouter();

  const produto = produtos.find(p => p.id === id);

  const handleReturn = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (!produto) {
    return (
      <View style={styles.containerNotFound}>
        <Text style={styles.titleNotFound}>Produto não encontrado</Text>
        <TouchableOpacity style={styles.buttonReturn} onPress={handleReturn}>
          <Text style={styles.buttonText}>Voltar para o Início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleToggleStatus = () => {
    alterarSituacaoProduto(produto.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{produto.nome}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.label}>Preço</Text>
        <Text style={styles.valuePrice}>
          R$ {produto.preco.toFixed(2).replace('.', ',')}
        </Text>

        <View style={styles.divider} />
        
        <Text style={styles.label}>Situação</Text>
        <Text style={[styles.value, { color: produto.ativo ? '#28a745' : '#dc3545' }]}>
          {produto.ativo ? 'Ativo' : 'Inativo'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, produto.ativo ? styles.buttonDanger : styles.buttonSuccess]} 
        onPress={handleToggleStatus}
      >
        <Text style={styles.buttonText}>
          {produto.ativo ? 'Desativar produto' : 'Ativar produto'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  containerNotFound: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleNotFound: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonReturn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  valuePrice: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
