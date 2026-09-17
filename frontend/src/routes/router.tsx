// createBrowserRouter com as rotas do handoff §5 (Layout como rota-mãe, lazy nas páginas de checkout)
// + a área administrativa (AdminLayout próprio, todas as páginas lazy — ver docs/AdminEspec.md)
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { CatalogoPage } from '../pages/CatalogoPage';
import { ProdutoPage } from '../pages/ProdutoPage';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { LoginPage } from '../pages/LoginPage';
import { RegistoPage } from '../pages/RegistoPage';
import { MinhasEncomendasPage } from '../pages/MinhasEncomendasPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'catalogo', Component: CatalogoPage },
      { path: 'catalogo/:sec', Component: CatalogoPage },
      { path: 'produto/:id', Component: ProdutoPage },
      { path: 'carrinho', Component: CarrinhoPage },
      {
        path: 'checkout/morada',
        lazy: async () => {
          const { MoradaPage } = await import('../pages/checkout/MoradaPage');
          return { Component: MoradaPage };
        },
      },
      {
        path: 'checkout/pagamento',
        lazy: async () => {
          const { PagamentoPage } = await import('../pages/checkout/PagamentoPage');
          return { Component: PagamentoPage };
        },
      },
      {
        path: 'checkout/confirmacao',
        lazy: async () => {
          const { ConfirmacaoPage } = await import('../pages/checkout/ConfirmacaoPage');
          return { Component: ConfirmacaoPage };
        },
      },
      { path: 'entrar', Component: LoginPage },
      { path: 'registo', Component: RegistoPage },
      { path: 'minhas-encomendas', Component: MinhasEncomendasPage },
    ],
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      {
        index: true,
        lazy: async () => {
          const { PainelPage } = await import('../pages/admin/PainelPage');
          return { Component: PainelPage };
        },
      },
      {
        path: 'stock',
        lazy: async () => {
          const { StockPage } = await import('../pages/admin/StockPage');
          return { Component: StockPage };
        },
      },
      {
        path: 'produtos',
        lazy: async () => {
          const { ProdutosPage } = await import('../pages/admin/ProdutosPage');
          return { Component: ProdutosPage };
        },
      },
      {
        path: 'encomendas',
        lazy: async () => {
          const { EncomendasPage } = await import('../pages/admin/EncomendasPage');
          return { Component: EncomendasPage };
        },
      },
      {
        path: 'carrinhos',
        lazy: async () => {
          const { CarrinhosPage } = await import('../pages/admin/CarrinhosPage');
          return { Component: CarrinhosPage };
        },
      },
      {
        path: 'clientes',
        lazy: async () => {
          const { ClientesPage } = await import('../pages/admin/ClientesPage');
          return { Component: ClientesPage };
        },
      },
      {
        path: 'pagamentos',
        lazy: async () => {
          const { PagamentosPage } = await import('../pages/admin/PagamentosPage');
          return { Component: PagamentosPage };
        },
      },
      {
        path: 'vendas',
        lazy: async () => {
          const { VendasPage } = await import('../pages/admin/VendasPage');
          return { Component: VendasPage };
        },
      },
      {
        path: 'financeiro',
        lazy: async () => {
          const { FinanceiroPage } = await import('../pages/admin/FinanceiroPage');
          return { Component: FinanceiroPage };
        },
      },
      {
        path: 'site',
        lazy: async () => {
          const { SitePage } = await import('../pages/admin/SitePage');
          return { Component: SitePage };
        },
      },
    ],
  },
]);
