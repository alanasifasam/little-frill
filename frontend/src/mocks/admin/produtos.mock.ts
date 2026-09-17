// os 8 produtos do protótipo de admin (`P` em docs/prototipo/prototipoAdmin.dc.html),
// cruzados com mocks/produtos.mock.ts (mesmos ids) para preencher tipo/sec/medidas/combina
import type { ProdutoAdmin } from '../../models/admin/produtoAdmin';

export const TIPOS = ['Bolsa', 'Necessaire', 'Capa', 'Porta-moedas', 'Bebé', 'Mesa', 'Banho', 'Cama', 'Cozinha', 'Pets'];

/** `base` só existe no mock (stock inicial + movimentos) — a API real não tem
 * este conceito (ver `models/admin/produtoAdmin.ts`). Fica só aqui, restrito
 * ao "back-end" em memória que os restantes separadores admin ainda usam. */
export type ProdutoAdminMock = ProdutoAdmin & { base: number };

export const PRODUTOS_ADMIN_MOCK: ProdutoAdminMock[] = [
  {
    id: 1, nome: 'Bolsa Alentejo', tipo: 'Bolsa', sec: 'acessorios', preco: 48, padrao: 'xadrez', cor: 'rosa',
    stock: 6, medidas: '34 × 28 × 12 cm', tecido: 'Algodão xadrez, forro de sarja', combina: [5, 3],
    custo: 17.2, base: 6, ativo: true, destaque: false,
  },
  {
    id: 3, nome: 'Necessaire Grande', tipo: 'Necessaire', sec: 'acessorios', preco: 26, padrao: 'floral', cor: 'lilas',
    stock: 12, medidas: '24 × 15 × 9 cm', tecido: 'Algodão floral, interior impermeável', combina: [5],
    custo: 8.4, base: 12, ativo: true, destaque: false,
  },
  {
    id: 5, nome: 'Porta-moedas Coração', tipo: 'Porta-moedas', sec: 'acessorios', preco: 12, padrao: 'floral', cor: 'rosa',
    stock: 20, medidas: '11 × 9 cm', tecido: 'Retalhos de algodão', combina: [1],
    custo: 3.1, base: 20, ativo: true, destaque: false,
  },
  {
    id: 7, nome: 'Capa de Portátil 15"', tipo: 'Capa', sec: 'acessorios', preco: 42, padrao: 'liso', cor: 'azul',
    stock: 4, medidas: '39 × 28 cm', tecido: 'Linho acolchoado', combina: [3],
    custo: 15.6, base: 4, ativo: true, destaque: false,
  },
  {
    id: 9, nome: 'Babete com folho', tipo: 'Bebé', sec: 'bebe', preco: 14, padrao: 'xadrez', cor: 'rosa',
    stock: 15, medidas: '22 × 26 cm', tecido: 'Algodão duplo, atrás em felpo', combina: [],
    custo: 4.2, base: 15, ativo: true, destaque: false,
  },
  {
    id: 12, nome: 'Caminho de mesa', tipo: 'Mesa', sec: 'mesa', preco: 28, padrao: 'liso', cor: 'amarelo',
    stock: 5, medidas: '140 × 40 cm', tecido: 'Linho lavado', combina: [],
    custo: 9.8, base: 5, ativo: true, destaque: false,
  },
  {
    id: 17, nome: 'Luva de forno', tipo: 'Cozinha', sec: 'cozinha', preco: 15, padrao: 'listras', cor: 'rosa',
    stock: 14, medidas: '30 × 18 cm', tecido: 'Algodão com manta térmica', combina: [],
    custo: 5.1, base: 14, ativo: true, destaque: false,
  },
  {
    id: 19, nome: 'Cama para gato', tipo: 'Pets', sec: 'animais', preco: 40, padrao: 'xadrez', cor: 'azul',
    stock: 4, medidas: '50 × 40 cm', tecido: 'Algodão xadrez, enchimento lavável', combina: [],
    custo: 14.5, base: 4, ativo: true, destaque: false,
  },
];
