// os 20 produtos do protótipo (docs/prototipo/Casa Arrais.html), usados por api/produtos.ts até a API .NET existir
import type { Produto } from '../models/produto';

export const PRODUTOS_MOCK: Produto[] = [
  { id: 1, nome: 'Bolsa Alentejo', tipo: 'Bolsa', sec: 'acessorios', preco: 48, padrao: 'xadrez', cor: 'rosa', stock: 6, medidas: '34 × 28 × 12 cm', tecido: 'Algodão xadrez, forro de sarja', combina: [5, 3], nova: true },
  { id: 2, nome: 'Bolsa Tote de Linho', tipo: 'Bolsa', sec: 'acessorios', preco: 42, padrao: 'liso', cor: 'verde', stock: 3, medidas: '38 × 32 × 10 cm', tecido: 'Linho lavado, alças de fita', combina: [4] },
  { id: 3, nome: 'Necessaire Grande', tipo: 'Necessaire', sec: 'acessorios', preco: 26, padrao: 'floral', cor: 'lilas', stock: 12, medidas: '24 × 15 × 9 cm', tecido: 'Algodão floral, interior impermeável', combina: [13, 5], nova: true },
  { id: 4, nome: 'Necessaire Pequena', tipo: 'Necessaire', sec: 'acessorios', preco: 18, padrao: 'xadrez', cor: 'azul', stock: 9, medidas: '18 × 11 × 7 cm', tecido: 'Algodão xadrez, fecho de metal', combina: [8] },
  { id: 5, nome: 'Porta-moedas Coração', tipo: 'Porta-moedas', sec: 'acessorios', preco: 12, padrao: 'floral', cor: 'rosa', stock: 20, medidas: '11 × 9 cm', tecido: 'Retalhos de algodão, mola de metal', combina: [1] },
  { id: 6, nome: 'Capa de Portátil 13"', tipo: 'Capa', sec: 'acessorios', preco: 38, padrao: 'xadrez', cor: 'amarelo', stock: 5, medidas: '34 × 24 cm', tecido: 'Algodão acolchoado, velcro', combina: [4, 5] },
  { id: 7, nome: 'Capa de Portátil 15"', tipo: 'Capa', sec: 'acessorios', preco: 42, padrao: 'liso', cor: 'azul', stock: 4, medidas: '39 × 28 cm', tecido: 'Linho acolchoado, velcro', combina: [3] },
  { id: 8, nome: 'Capa de Kindle', tipo: 'Capa', sec: 'acessorios', preco: 22, padrao: 'floral', cor: 'verde', stock: 7, medidas: '19 × 14 cm', tecido: 'Algodão floral, elástico de fita', combina: [5], nova: true },
  { id: 9, nome: 'Babete com folho', tipo: 'Bebé', sec: 'bebe', preco: 14, padrao: 'xadrez', cor: 'rosa', stock: 15, medidas: '22 × 26 cm', tecido: 'Algodão duplo, atrás em felpo', combina: [10] },
  { id: 10, nome: 'Saco de fraldas', tipo: 'Bebé', sec: 'bebe', preco: 34, padrao: 'floral', cor: 'lilas', stock: 6, medidas: '32 × 26 × 10 cm', tecido: 'Algodão floral, bolsos interiores', combina: [9, 4] },
  { id: 11, nome: 'Guardanapos (jogo de 4)', tipo: 'Mesa', sec: 'mesa', preco: 24, padrao: 'xadrez', cor: 'verde', stock: 10, medidas: '40 × 40 cm cada', tecido: 'Linho, bainha à mão', combina: [12] },
  { id: 12, nome: 'Caminho de mesa', tipo: 'Mesa', sec: 'mesa', preco: 28, padrao: 'liso', cor: 'amarelo', stock: 5, medidas: '140 × 40 cm', tecido: 'Linho lavado', combina: [11], nova: true },
  { id: 13, nome: 'Toalha de mão bordada', tipo: 'Banho', sec: 'banho', preco: 16, padrao: 'floral', cor: 'azul', stock: 11, medidas: '50 × 30 cm', tecido: 'Felpo com barra de algodão', combina: [14] },
  { id: 14, nome: 'Cesto de banho', tipo: 'Banho', sec: 'banho', preco: 30, padrao: 'xadrez', cor: 'lilas', stock: 3, medidas: '28 × 20 cm', tecido: 'Algodão engomado, aro de vime', combina: [13] },
  { id: 15, nome: 'Fronha com folho', tipo: 'Cama', sec: 'cama', preco: 32, padrao: 'floral', cor: 'rosa', stock: 8, medidas: '50 × 70 cm', tecido: 'Percal de algodão', combina: [16] },
  { id: 16, nome: 'Colcha de retalhos', tipo: 'Cama', sec: 'cama', preco: 86, padrao: 'xadrez', cor: 'lilas', stock: 2, medidas: '220 × 240 cm', tecido: 'Retalhos de algodão, enchimento fino', combina: [15] },
  { id: 17, nome: 'Luva de forno', tipo: 'Cozinha', sec: 'cozinha', preco: 15, padrao: 'listras', cor: 'rosa', stock: 14, medidas: '30 × 18 cm', tecido: 'Algodão com manta térmica', combina: [18] },
  { id: 18, nome: 'Avental com folho', tipo: 'Cozinha', sec: 'cozinha', preco: 34, padrao: 'floral', cor: 'amarelo', stock: 6, medidas: 'Tamanho único, fitas 1,2 m', tecido: 'Algodão floral, bolso frontal', combina: [17], nova: true },
  { id: 19, nome: 'Cama para gato', tipo: 'Pets', sec: 'animais', preco: 40, padrao: 'xadrez', cor: 'azul', stock: 4, medidas: '50 × 40 cm', tecido: 'Algodão xadrez, enchimento lavável', combina: [20] },
  { id: 20, nome: 'Bandana para cão', tipo: 'Pets', sec: 'animais', preco: 9, padrao: 'listras', cor: 'verde', stock: 22, medidas: 'Ajustável 26–40 cm', tecido: 'Algodão, botão de pressão', combina: [19] },
];
