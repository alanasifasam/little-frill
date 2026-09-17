// tabela de clientes + editor lateral (novo/editar), CRUD via api/admin/clientes
import { useCallback, useEffect, useState } from 'react';
import { apagarCliente, criarCliente, editarCliente, getClientesAdmin, type ClienteLinha, type NovoCliente } from '../../api/admin/clientes';
import { mensagemErro } from '../../lib/erroApi';

const RASCUNHO_NOVO: NovoCliente = { nome: '', sobrenome: '', email: '', tel: '', cp: '', localidade: '' };

export function useAdminClientes() {
  const [clientes, setClientes] = useState<ClienteLinha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');
  const [editId, setEditId] = useState<number | 'novo' | null>(null);
  const [rascunho, setRascunho] = useState<NovoCliente>(RASCUNHO_NOVO);

  const carregar = useCallback(() => {
    setCarregando(true);
    getClientesAdmin()
      .then((lista) => {
        setClientes(lista);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar os clientes.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function abrirNovo() {
    setEditId('novo');
    setRascunho(RASCUNHO_NOVO);
    setAviso('');
  }

  function abrirEdicao(id: number) {
    const c = clientes.find((x) => x.id === id);
    if (!c) return;
    setEditId(id);
    setRascunho({ nome: c.nome, sobrenome: c.sobrenome, email: c.email, tel: c.tel, cp: c.cp, localidade: c.localidade });
    setAviso('');
  }

  function cancelar() {
    setEditId(null);
    setAviso('');
  }

  function atualizarRascunho<K extends keyof NovoCliente>(campo: K, valor: NovoCliente[K]) {
    setRascunho((r) => ({ ...r, [campo]: valor }));
  }

  async function guardar() {
    try {
      if (editId === 'novo' || editId === null) {
        const criado = await criarCliente(rascunho);
        setAviso(`Cliente criado: ${criado.nome}.`);
      } else {
        const atualizado = await editarCliente(editId, rascunho);
        setAviso(`Cadastro atualizado: ${atualizado.nome}.`);
      }
      setEditId(null);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível guardar o cadastro.'));
    }
  }

  async function apagar(id: number) {
    const resultado = await apagarCliente(id);
    setAviso(
      resultado.apagado
        ? `${resultado.nome} apagada dos cadastros.`
        : `${resultado.nome} tem encomendas no histórico — não pode ser apagada.`
    );
    if (resultado.apagado) setEditId(null);
    carregar();
  }

  return {
    clientes, carregando, erro, aviso,
    editId, rascunho, atualizarRascunho,
    abrirNovo, abrirEdicao, cancelar, guardar, apagar,
  };
}
