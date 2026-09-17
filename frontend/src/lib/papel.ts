// Normaliza o campo "role" (string livre vindo da API) para o papel tipado
// que o front usa — qualquer valor que não seja "admin" cai em "cliente",
// nunca o contrário, para nenhum utilizador ganhar acesso admin por engano.
export type Papel = 'cliente' | 'admin';

export function comoPapel(role: string): Papel {
  return role === 'admin' ? 'admin' : 'cliente';
}
