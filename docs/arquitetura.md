# Planejamento da Arquitetura do Aplicativo de Produtos

Com base no documento da prova, preparei um planejamento detalhado de como estruturar o projeto para atender a todos os requisitos técnicos (RT1, RT2, RT3) e funcionais.

## 1. Estrutura de Pastas e Arquivos

O projeto utilizará o **Expo Router** (que se baseia na pasta `app/` para roteamento) e organizaremos o restante do código em uma pasta `src/` para separar a lógica das rotas, conforme exigido no RT3.

```text
/
├── app/                      # Rotas do Expo Router
│   ├── _layout.tsx           # Layout raiz (Onde o ProdutosProvider será montado)
│   ├── index.tsx             # Tela inicial (Listas e botão de acesso ao cadastro)
│   ├── cadastro.tsx          # Tela de cadastro (Formulário e validações)
│   └── produtos/
│       └── [id].tsx          # Tela de detalhe do produto (Rota dinâmica)
├── src/
│   ├── contexts/
│   │   └── ProdutosContext.tsx # Contexto, Provider e Hook customizado (useProdutos)
│   ├── types/
│   │   └── index.ts          # Definição do tipo Produto e contratos do Contexto
│   └── components/           # (Opcional, mas recomendado)
│       ├── FormularioProduto.tsx # Componente do formulário de cadastro
│       └── ItemProduto.tsx       # Componente para renderizar cada item na lista
```

## 2. O `ProdutosProvider` (Fonte de verdade compartilhada - RT2)

O coração do aplicativo será o Contexto. Ele deve guardar **apenas uma lista** de produtos.

**Estado (`state`):**
- Um array de objetos do tipo `Produto`.

**Dados Derivados (Calculados):**
- Produtos Ativos: Filtrados a partir da lista principal.
- Produtos Inativos: Filtrados a partir da lista principal.
*(Não crie arrays separados no estado para ativos e inativos. Filtre-os em tempo de renderização ou dentro do contexto).*

**Funções/Ações:**
- `adicionarProduto(nome, preco, ativo)`: Cria um novo objeto `Produto` (gerando um ID único, como um `Math.random().toString()` ou `Date.now().toString()`), e o adiciona à lista de forma imutável (usando spread operator `[...]`).
- `alterarSituacaoProduto(id)`: Busca o produto pelo ID na lista e inverte seu status (`ativo = !ativo`), retornando uma nova lista atualizada (sem mutar o array original).

**Onde montar:**
No arquivo `app/_layout.tsx`. Ao envolver o `<Stack />` do Expo Router com o `<ProdutosProvider>`, o estado ficará disponível para todas as telas (Cadastro, Inicial e Detalhes) sem se perder na navegação, e será "resetado" quando o app for recarregado (já que não usaremos AsyncStorage).

## 3. Tipagem (TypeScript - RT3)

No arquivo `src/types/index.ts`, definiremos o modelo de dados e o contrato do contexto:

```typescript
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
```

## 4. Gestão de Estado Local vs Global

- **Estado Global (Contexto):** A lista principal de produtos.
- **Estado Local (`useState`):**
  - **No Formulário:** Os valores digitados nos inputs (`nome`, `preco`, `situacaoInicial`), além de mensagens de erro de validação.
  - **Por que?** Porque enquanto o usuário está digitando, o produto ainda não existe na lista. Somente após a validação e o clique em "Cadastrar" é que enviamos esses dados para o Contexto.

## 5. Roteamento e Navegação (Expo Router - RT1, RT4)

- **`app/_layout.tsx`**: Define a navegação base usando `<Stack>`.
- **`app/index.tsx`**:
  - Exibe um botão ou link para acessar o cadastro (`router.push('/cadastro')`).
  - Mapeia e renderiza a lista de `produtosAtivos` e `produtosInativos`.
  - Ao clicar em um produto, usa o `router.push(/produtos/${id})`.
- **`app/cadastro.tsx`**:
  - Exibe o formulário de cadastro (com seus estados locais para os inputs e erros).
  - Após a validação bem-sucedida, salva o produto no Contexto, limpa os campos e volta para a tela inicial (`router.replace('/')`).
- **`app/produtos/[id].tsx`**:
  - Pega o `id` da URL usando `useLocalSearchParams()`.
  - Busca o produto correspondente no contexto usando esse `id`.
  - Exibe os detalhes e o botão de "Ativar/Desativar".
  - **Ação de retorno (produto encontrado ou não):** Deve verificar se há histórico de navegação. Se `router.canGoBack()` for `true`, utiliza `router.back()`. Se for `false` (acesso direto sem histórico), força a ida para a tela inicial usando `router.replace('/')`.

## 6. Validações e Regras de Negócio

- **Preço:** A validação deve ser rigorosa antes da conversão. Usaremos uma Expressão Regular (Regex) como `/^\d+([.,]\d{1,2})?$/` para garantir que a string contenha apenas números, um ponto ou vírgula opcional e, no máximo, duas casas decimais. Se a string passar na Regex, aí sim substituímos a vírgula por ponto (`replace(',', '.')`) e convertemos para número (`parseFloat`). Entradas como "12abc" ou "12,254" serão rejeitadas pela Regex.
- **Nome:** Usar `.trim()` para remover espaços e verificar se o comprimento é maior que 0.
