# Roteiro de Testes Funcionais (Conferência)

Este roteiro é baseado na "Tabela 2 - Cenários para conferência funcional" da especificação da prova. Ele deve ser executado na mesma sessão, **sem fechar ou recarregar o aplicativo** entre o cadastro, o detalhe e o retorno.

## Pré-requisitos
- Iniciar o aplicativo com o estado limpo (sem produtos cadastrados).
- Executar os cenários em ordem, pois eles dependem do estado acumulado das etapas anteriores.

---

### Cenário 1: Partes vazias
- **Ação:** Iniciar o app (lista vazia) ou deixar apenas uma das partes sem itens durante o uso.
- **Resultado Esperado:** A parte que não tem itens (seja a de Ativos ou a de Inativos) deve exibir a sua respectiva mensagem explicativa de lista vazia.

### Cenário 2: Cadastro ativo
- **Ação:** Cadastrar um produto com Nome: `"Arroz 1 kg"`, Preço: `7,50`, Status: `Ativo`.
- **Resultado Esperado:** 
  - O produto aparece **apenas uma vez** na lista de "Produtos ativos".
  - O preço é exibido formatado como `R$ 7,50`.
  - O formulário de cadastro fica limpo (resetado) ao finalizar.

### Cenário 3: Cadastro inativo
- **Ação:** Cadastrar um produto com Nome: `"Café 250 g"`, Preço: `12.90`, Status: `Inativo`.
- **Resultado Esperado:** 
  - O produto aparece **somente** na lista de "Produtos inativos".
  - O preço é exibido formatado como `R$ 12,90`.

### Cenário 4: Entrada inválida
- **Ação (Nome):** Tentar cadastrar com nome vazio ou apenas contendo espaços (`"   "`).
- **Ação (Preço):** Tentar cadastrar com preço vazio, e com os seguintes valores: `abc`, `0` (obs: o PDF diz que 0 pode ser válido no RF2, mas no cenário 4 pede para testar o 0 dependendo da interpretação da tabela. Pela RF2: "pode ser igual a zero", mas se o roteiro pede pra rejeitar, vamos validar de acordo com o RF2 e verificar se o cenário 4 quis dizer `0` como erro. *Correção:* a prova no RF2 diz "pode ser igual a zero", portanto 0 **deve ser aceito**, o que a tabela 4 propõe tentar é se a interface acusa erro para certas coisas. Vamos seguir o RF2 rigoroso e bloquear apenas negativos e inválidos). *Os itens a bloquear com certeza são*: vazio, `abc`, `-5`, `12abc`, e `12,345`.
- **Resultado Esperado:** Cada tentativa inválida deve ser recusada. Uma mensagem de erro deve aparecer e os dados preenchidos nos campos devem ser preservados (não apagar o que o usuário já digitou).

### Cenário 5: Desativação
- **Ação:** Tocar no item "Arroz" na lista da tela inicial para abrir os detalhes. Conferir as informações da tela e clicar em "Desativar produto".
- **Resultado Esperado:**
  - A situação por escrito e o texto do botão mudam imediatamente na tela de detalhes.
  - Ao voltar para a tela inicial, o "Arroz" deve ter sumido da lista de ativos e aparecer **somente** em inativos.

### Cenário 6: Reativação
- **Ação:** Abrir novamente o "Arroz" (que agora está em Inativos) e clicar para Ativá-lo. Retornar à tela inicial.
- **Resultado Esperado:** 
  - O "Arroz" volta a aparecer somente em ativos.
  - O "Café" deve permanecer inativo, com os mesmos dados, sem sofrer nenhuma alteração.

### Cenário 7: Identidade e navegação
- **Ação:** Cadastrar **outro** produto chamado `"Arroz"` (nomes iguais permitidos), mas com preço `9,00`. Abrir o detalhe de cada um dos arrozes. Alternar a situação de apenas um deles.
- **Resultado Esperado:** Cada "Arroz" deve mostrar o preço correspondente. Alterar o status de um não deve alterar o status do outro (comprovando que o `id` gerado é único e estável).

### Cenário 8: Id inexistente
- **Ação:** Forçar a abertura da rota de detalhes com um `id` que não existe (via navegador web se estiver testando lá, ou link de teste).
- **Resultado Esperado:** O aplicativo não deve quebrar. Deve apresentar a mensagem `"Produto não encontrado"` e fornecer uma ação clara que retorne com sucesso à tela inicial.

### Cenário 9: Retorno sem histórico
- **Ação:** Abrir uma rota de detalhe de produto diretamente como entrada inicial do aplicativo (sem ter passado pela tela inicial, logo, o histórico de navegação está vazio). Tentar voltar.
- **Resultado Esperado:** A ação de retorno deve conseguir abrir a tela inicial, mesmo que o produto não exista. Não deve quebrar nem fechar o aplicativo. (Implementado via verificação `router.canGoBack()`).
