import React, { createContext, useState, useContext, useMemo } from 'react';
import { Produto, ProdutosContextData } from '../types';

const ProdutosContext = createContext<ProdutosContextData | undefined>(undefined);

export function ProdutosProvider({ children }: { children: React.ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const produtosAtivos = useMemo(() => produtos.filter(p => p.ativo), [produtos]);
  const produtosInativos = useMemo(() => produtos.filter(p => !p.ativo), [produtos]);

  const adicionarProduto = (nome: string, preco: number, ativo: boolean) => {
    const novoProduto: Produto = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      nome,
      preco,
      ativo,
    };
    setProdutos(prev => [...prev, novoProduto]);
  };

  const alterarSituacaoProduto = (id: string) => {
    setProdutos(prev => 
      prev.map(produto => 
        produto.id === id 
          ? { ...produto, ativo: !produto.ativo }
          : produto
      )
    );
  };

  return (
    <ProdutosContext.Provider value={{
      produtos,
      produtosAtivos,
      produtosInativos,
      adicionarProduto,
      alterarSituacaoProduto
    }}>
      {children}
    </ProdutosContext.Provider>
  );
}

export function useProdutos() {
  const context = useContext(ProdutosContext);
  if (!context) {
    throw new Error('useProdutos deve ser usado dentro de um ProdutosProvider');
  }
  return context;
}
