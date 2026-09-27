import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useProdutos } from '../src/contexts/ProdutosContext';
import { useRouter } from 'expo-router';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [ativo, setAtivo] = useState(true);
  
  const [erroNome, setErroNome] = useState('');
  const [erroPreco, setErroPreco] = useState('');

  const { adicionarProduto } = useProdutos();
  const router = useRouter();

  const handleCadastrar = () => {
    let isValid = true;
    const nomeTrimmed = nome.trim();

    if (nomeTrimmed.length === 0) {
      setErroNome('O nome deve ter pelo menos um caractere.');
      isValid = false;
    } else {
      setErroNome('');
    }

    // Regex para validar número positivo com até 2 casas decimais e vírgula ou ponto
    const regexPreco = /^\d+([.,]\d{1,2})?$/;
    if (!preco) {
      setErroPreco('O preço é obrigatório.');
      isValid = false;
    } else if (!regexPreco.test(preco)) {
      setErroPreco('Preço inválido. Use formato válido (ex: 12,50 ou 12.5).');
      isValid = false;
    } else {
      setErroPreco('');
    }

    if (isValid) {
      const precoNumber = parseFloat(preco.replace(',', '.'));
      adicionarProduto(nomeTrimmed, precoNumber, ativo);
      
      // Limpa os campos
      setNome('');
      setPreco('');
      setAtivo(true);
      
      // Retorna para a tela inicial
      router.replace('/');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Produto</Text>
          <TextInput
            style={[styles.input, erroNome ? styles.inputError : null]}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Arroz 1 kg"
          />
          {erroNome ? <Text style={styles.errorText}>{erroNome}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={[styles.input, erroPreco ? styles.inputError : null]}
            value={preco}
            onChangeText={setPreco}
            keyboardType="numeric"
            placeholder="Ex: 12,50"
          />
          {erroPreco ? <Text style={styles.errorText}>{erroPreco}</Text> : null}
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.label}>Situação Inicial: {ativo ? 'Ativo' : 'Inativo'}</Text>
          <Switch
            value={ativo}
            onValueChange={setAtivo}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={ativo ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
          <Text style={styles.buttonText}>Cadastrar Produto</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
