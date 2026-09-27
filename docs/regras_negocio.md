# Documentação de Regras de Negócio e Validações

Este documento centraliza todas as regras funcionais exigidas na prova, especificando como o aplicativo deve se comportar na validação de dados, exibição de informações e transições de estado.

## 1. Entidade: Produto (RF1)

Cada produto na lista deve ser modelado com as seguintes propriedades:
- **`id` (string):** Identificador único e estável. Deve ser gerado no momento do cadastro (ex: UUID, timestamp). Como nomes iguais são permitidos, o `id` é a única forma de diferenciar os itens.
- **`nome` (string):** Nome do produto.
- **`preco` (number):** Preço em reais (armazenado internamente como tipo numérico).
- **`ativo` (boolean):** Situação do produto (`true` para ativo, `false` para inativo).

## 2. Validações de Cadastro (RF2 e Cenário 4)

Antes de um produto ser adicionado ao estado global, os inputs devem passar pelas seguintes validações:

### Regras do Campo "Nome"
- **Obrigatório:** O campo não pode estar vazio.
- **Tamanho mínimo:** Deve conter pelo menos 1 caractere útil.
- **Tratamento:** A validação deve ocorrer após remover espaços em branco nas extremidades (utilizando o método `.trim()`). Nomes contendo apenas espaços (ex: `"   "`) devem ser rejeitados.

### Regras do Campo "Preço"
- **Obrigatório:** O campo não pode estar vazio.
- **Formato Numérico:** Deve aceitar apenas números. Letras ou caracteres especiais são bloqueados.
- **Valor Positivo:** Não pode conter sinal de negativo (ex: `-5` é inválido). Pode ser igual a zero.
- **Separador Decimal:** Deve aceitar tanto ponto (`.`) quanto vírgula (`,`).
- **Casas Decimais:** Permitido no máximo duas casas decimais. (ex: `12`, `12.5`, `12,50` são válidos; `12,254` é inválido).
- **Lógica de Validação Sugerida:** Validar a string crua com a Regex `/^\d+([.,]\d{1,2})?$/`. A conversão para `number` (com `parseFloat`) só ocorre se a regex passar.

### Comportamento do Formulário (UI/UX)
- **Situação Inicial:** O controle de ativo/inativo deve vir marcado como "Ativo" por padrão, mas permitir alteração antes de salvar.
- **Falha na Validação:** 
  - Apresentar mensagem de erro identificável (embaixo do campo ou via alerta).
  - **Preservação:** Os dados digitados não devem ser apagados.
  - **Bloqueio:** A ação de salvar fica indisponível/não prossegue enquanto houver erros.
- **Sucesso no Cadastro:**
  - O produto é inserido na lista global.
  - O formulário deve ser completamente limpo (resetado aos valores padrão).
  - O usuário deve ser redirecionado para a tela inicial (`router.replace('/')`). Não é necessário exibir mensagem de sucesso (basta a transição de tela).

## 3. Regras de Exibição (Tela Inicial - RF3)

- **Separação:** Produtos ativos e inativos devem ser exibidos em seções distintas ("Produtos ativos" e "Produtos inativos"). Um produto não pode aparecer nas duas listas ao mesmo tempo.
- **Formatação de Moeda:** O preço sempre deve ser exibido com cifrão, vírgula como separador decimal e exatas duas casas decimais.
  - **Formato exigido:** `R$ 12,50`.
- **Estados Vazios:** Se não houver produtos ativos, a seção de ativos deve exibir uma mensagem explicativa. O mesmo vale para a seção de inativos. (Ex: *"Nenhum produto ativo cadastrado"*).

## 4. Regras de Detalhe e Alteração (RF4, Cenários 5 e 6)

- **Exibição de Status:** A situação deve estar escrita explicitamente por extenso ("Ativo" ou "Inativo").
- **Ações de Mudança:**
  - Produto Ativo exibe o botão: "Desativar produto".
  - Produto Inativo exibe o botão: "Ativar produto".
- **Comportamento da Ação:**
  - A mudança ocorre na hora (o texto do status e o botão mudam imediatamente na tela de detalhes).
  - A tela **não deve** navegar automaticamente após a mudança.
- **Tratamento de Exceções:**
  - Acesso a um ID inexistente (Cenário 8): Exibir a mensagem *"Produto não encontrado"* e fornecer uma ação clara (botão) para voltar à tela inicial.

## 5. Regras Globais de Comportamento
- **Volatilidade:** Nenhum dado é salvo em disco ou API. Fechar ou recarregar o aplicativo pelo Expo reseta o aplicativo para o estado inicial (lista vazia).
- **Atualização sem Duplicação:** Ao alternar um status de Ativo para Inativo (ou vice-versa), o produto deve trocar de lista na Home perfeitamente, sem clonar ou sumir (gerenciado automaticamente pelo filtro derivado no `ProdutosProvider`).
