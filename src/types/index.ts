export interface Produto {
  id: string;
  nome: string;
  preco: number;
  ativo: boolean;
}

export interface ProdutosContextData {
  produtos: Produto[];
  produtosAtivos: Produto[];
  produtosInativos: Produto[];
  adicionarProduto: (nome: string, preco: number, ativo: boolean) => void;
  alterarSituacaoProduto: (id: string) => void;
}
