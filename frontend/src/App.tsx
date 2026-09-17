// <BrowserRouter> + AppRouter + CarrinhoProvider + AuthProvider (ver plano de estrutura)
import { RouterProvider } from 'react-router-dom';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes/router';

function App() {
  return (
    <AuthProvider>
      <CarrinhoProvider>
        <RouterProvider router={router} />
      </CarrinhoProvider>
    </AuthProvider>
  );
}

export default App;
