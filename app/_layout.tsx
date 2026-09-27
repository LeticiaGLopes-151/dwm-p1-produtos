import { Stack } from 'expo-router';
import { ProdutosProvider } from '../src/contexts/ProdutosContext';

export default function Layout() {
  return (
    <ProdutosProvider>
      <Stack screenOptions={{ headerShown: true, headerBackTitle: '' }}>
        <Stack.Screen name="index" options={{ title: 'Meus Produtos' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Novo Produto', presentation: 'modal' }} />
        <Stack.Screen name="produtos/[id]" options={{ title: 'Detalhes do Produto' }} />
      </Stack>
    </ProdutosProvider>
  );
}
