// Cliente — cadastro do ateliê (AdminEspec §2)

export interface Cliente {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  tel: string;
  /** Código postal português, formato 0000-000. */
  cp: string;
  localidade: string;
}
