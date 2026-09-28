# Projeto: Cadastro e Listagem de Produtos

Este é um projeto em React Native / Expo desenvolvido para a disciplina de Desenvolvimento Web e Mobile (DWM). O aplicativo permite gerenciar (cadastrar, listar, detalhar e desativar) produtos.

## Informações Acadêmicas

- **Nome Completo:** Letícia Gomes Lopes.
- **Matrícula:** 2023213500
- **Disciplina:** Desenvolvimento Web e Mobile (DWM)

---

## Instruções de Instalação e Execução

### Pré-requisitos
- Ter o [Node.js](https://nodejs.org/) instalado na máquina.
- (Opcional) Ter o aplicativo [Expo Go](https://expo.dev/go) instalado no celular para testar via dispositivo físico.

### Passo a Passo

1. **Clone o repositório ou extraia os arquivos do projeto:**
   Navegue até a pasta do projeto no seu terminal.

2. **Instale as dependências:**
   Execute o comando abaixo para baixar as bibliotecas necessárias:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start
   ```

4. **Acesse o aplicativo:**
   - **No navegador (Web):** Pressione a tecla `w` no terminal para abrir o aplicativo na web (ex: `localhost:8081`).
   - **No celular (Expo Go):** Escaneie o QR Code exibido no terminal utilizando o aplicativo Expo Go (Android) ou o app de Câmera (iOS).
   - **No Emulador:** Pressione `a` para abrir no Android Emulator ou `i` para abrir no iOS Simulator.

---

## Plataforma Testada

O aplicativo foi testado e validado na seguinte plataforma:

- Web (Navegador Google Chrome)

---

## Limitações Conhecidas

Ao utilizar este aplicativo, leve em consideração as seguintes limitações temporárias ou de escopo do projeto:
- **Persistência de Dados:** Os produtos cadastrados ficam salvos apenas em memória (durante a execução). Se o aplicativo for recarregado ou fechado, os dados serão perdidos, pois não há um banco de dados integrado nesta etapa.

---

## Fontes Consultadas

Durante o desenvolvimento deste projeto, foram utilizadas as seguintes fontes de estudo e consulta:

- **Documentação Oficial do Expo:** [https://docs.expo.dev/](https://docs.expo.dev/)
- **Documentação do React Native:** [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
- **Documentação do Expo Router:** [https://docs.expo.dev/router/introduction/](https://docs.expo.dev/router/introduction/)

---

## Relatório de Verificações e Testes

### Verificação de Tipos (TypeScript)
Durante o desenvolvimento, ao executar a verificação de tipos com o comando `npx tsc --noEmit`, identificou-se inicialmente o seguinte erro relacionado a uma rota inexistente nas abas de navegação:

```bash
src/components/app-tabs.web.tsx:27:38 - error TS2322: Type '"/explore"' is not assignable to type 'RelativePathString | ExternalPathString | "/cadastro" | `/cadastro?${string}` | `/cadastro#${string}` | "/" | `/?${string}` | `/#${string}` | "/_sitemap" | `/_sitemap?${string}` | ... 10 more ... | undefined'.

27           <TabTrigger name="explore" href="/explore" asChild>
```

**Resolução:** O erro acontecia porque o componente de abas originais do template tentava renderizar uma rota `"/explore"` que não foi mantida no projeto. A aba foi substituída para apontar para a rota existente `"/cadastro"`.
Atualmente, a execução de `npx tsc --noEmit` retorna com sucesso **sem apresentar nenhum erro (código de saída 0)**.

### Validação de Cenários de Teste

Todos os cenários descritos na "Tabela 2 - Cenários para conferência funcional" da especificação (e detalhados no `roteiro_testes.md`) foram testados manualmente com sucesso:

- **Cenário 1 (Partes vazias):** Mensagens de lista vazia exibidas corretamente.
- **Cenário 2 (Cadastro ativo):** Cadastro inserido corretamente na lista de ativos, reset do formulário e formatação de preço (`R$ 7,50`).
- **Cenário 3 (Cadastro inativo):** Cadastro inserido corretamente apenas na lista de inativos.
- **Cenário 4 (Entrada inválida):** Bloqueio de dados inválidos (nomes vazios, preços inválidos/negativos) preservando o formulário para correção.
- **Cenário 5 (Desativação):** Alteração instantânea na tela de detalhes e realocação do item para a lista de inativos.
- **Cenário 6 (Reativação):** Produto retorna para a lista de ativos sem afetar outros produtos.
- **Cenário 7 (Identidade e navegação):** Produtos com nomes iguais mantêm preços e estados independentes devido à geração de um `id` único.
- **Cenário 8 (ID Inexistente):** Testado o acesso direto a uma URL de detalhes do produto utilizando um ID que não consta no banco de dados em memória (ex: `http://localhost:8081/produtos/1790637566689lggm12a`). O aplicativo não quebrou, não gerou erros na tela e apresentou corretamente a mensagem *"Produto não encontrado"* e a ação *"Voltar para o Início"*.
- **Cenário 9 (Retorno sem Histórico):** A partir do acesso direto ao detalhe (mencionado no cenário 8), a pilha de navegação (histórico do app) encontrava-se vazia. Ao acionar o botão de retornar à tela inicial, o aplicativo tratou essa condição (validando `router.canGoBack()`) e redirecionou com sucesso o usuário para a lista principal (`/`), evitando o encerramento ou falha do app.

---

## Respostas Teóricas (Seção 8)

**1. Onde o provider está montado? Por que essa posição permite compartilhar a lista entre cadastro, tela inicial e detalhe?**
O `ProdutosProvider` está montado no arquivo raiz de layout (`app/_layout.tsx`), envolvendo o `<Stack>` de navegação. Essa posição (topo da árvore de componentes) garante que todas as telas (filhas do Stack) tenham acesso contínuo aos dados do contexto sem perder o estado durante as transições de tela.

**2. Quais dados ficam no estado local, quais ficam no provider e quais são derivados? Indiquem exemplos do aplicativo.**
- **Estado Local:** Ficam os dados temporários, como os campos digitados no formulário de cadastro (ex: `nome`, `preco`, mensagens de erro em `cadastro.tsx`).
- **Provider (Global):** Fica a "fonte da verdade", ou seja, a lista mestre completa de produtos (array `produtos` em `ProdutosContext.tsx`).
- **Derivados:** São calculados a partir do estado global. Exemplo: as listas `produtosAtivos` e `produtosInativos`, que são derivadas utilizando filtros em vez de duplicar dados em estados separados.

**3. Como a rota identifica o produto? Expliquem por que o detalhe consulta o contexto em vez de receber uma cópia dos dados.**
A rota identifica o produto através do parâmetro dinâmico na URL (`[id]`), capturado via `useLocalSearchParams()`. A tela de detalhes consulta o contexto (buscando pelo ID) em vez de receber uma cópia por parâmetro para garantir o princípio de "Fonte Única da Verdade" (Single Source of Truth). Se recebesse uma cópia, alterar o status do produto na tela de detalhes dessincronizaria essa cópia da lista global.

**4. Qual função ativa ou desativa um produto? Expliquem a atualização sem mutação e o que acontece com os produtos ao recarregar o aplicativo.**
A função é a `alterarSituacaoProduto(id)` no Contexto. Ela atualiza de forma imutável utilizando `.map()` para retornar um novo array de produtos, e usa o *spread operator* (`{ ...produto, ativo: !produto.ativo }`) para criar um novo objeto do produto modificado, em vez de alterar a propriedade diretamente (`produto.ativo = false`). Ao recarregar o aplicativo, como os dados estão salvos apenas em memória RAM (via `useState`), todos os produtos cadastrados são perdidos e o app retorna ao estado inicial vazio.
