// os 5 cadastros do protótipo (CLIENTES0)
import type { Cliente } from '../../models/admin/cliente';

// nome fica com o nome completo (ex-facto) e sobrenome fica vazio aqui: este
// mock só serve para satisfazer o tipo Cliente e alimentar db.clientes, ainda
// lido por Carrinhos/Encomendas/Pagamentos (painel.ts › clientePorId) que
// exibem `cliente.nome` como nome completo — a página de Clientes em si já
// não lê este ficheiro (passou a vir do backend real).
export const CLIENTES_MOCK: Cliente[] = [
  { id: 1, nome: 'Maria Arrais', sobrenome: '', email: 'maria@exemplo.pt', tel: '912 000 000', cp: '1250-066', localidade: 'Lisboa' },
  { id: 2, nome: 'Ana Coutinho', sobrenome: '', email: 'ana.coutinho@exemplo.pt', tel: '936 118 204', cp: '2775-320', localidade: 'Parede' },
  { id: 3, nome: 'Rita Vaz', sobrenome: '', email: 'rita.vaz@exemplo.pt', tel: '967 442 013', cp: '4000-322', localidade: 'Porto' },
  { id: 4, nome: 'Helena Brito', sobrenome: '', email: 'helena@exemplo.pt', tel: '925 780 551', cp: '3000-370', localidade: 'Coimbra' },
  { id: 5, nome: 'Sofia Nunes', sobrenome: '', email: 'sofia.nunes@exemplo.pt', tel: '918 224 907', cp: '8000-142', localidade: 'Faro' },
];
