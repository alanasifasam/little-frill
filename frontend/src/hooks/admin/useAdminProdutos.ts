// tabela do catálogo + editor lateral (novo/editar), CRUD via api/admin/produtos
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  alternarAtivo, alternarDestaque, alternarNovo, apagarProduto, criarProduto, editarProduto, getProdutosAdmin,
  type NovoProdutoAdmin, type ProdutoAdminLinha, type ProdutoFotoDTO,
} from '../../api/admin/produtos';
import { mensagemErro } from '../../lib/erroApi';
import { useAdminStockContext } from './useAdminStockContext';

const RASCUNHO_NOVO: NovoProdutoAdmin = {
  nome: '', tipo: 'Bolsa', sec: 'acessorios', preco: 0, padrao: 'xadrez', cor: 'rosa',
  medidas: '', tecido: '', combina: [], custo: 0, stock: 0,
};

export function useAdminProdutos() {
  const { versao } = useAdminStockContext();
  const [produtos, setProdutos] = useState<ProdutoAdminLinha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');
  const [editId, setEditId] = useState<number | 'novo' | null>(null);
  const [rascunho, setRascunho] = useState<NovoProdutoAdmin>(RASCUNHO_NOVO);

  const carregar = useCallback(() => {
    setCarregando(true);
    getProdutosAdmin()
      .then((lista) => {
        setProdutos(lista);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Movimentos de stock (entrada/saída/venda) feitos em /admin/stock mudam
  // `versao` do AdminStockContext — recarrega para a coluna de stock aqui
  // não ficar desatualizada. `versaoInicial` evita o fetch duplicado no
  // primeiro render (o efeito de mount acima já trata desse caso).
  const versaoInicial = useRef(true);
  useEffect(() => {
    if (versaoInicial.current) {
      versaoInicial.current = false;
      return;
    }
    carregar();
  }, [versao, carregar]);

  function abrirNovo() {
    setEditId('novo');
    setRascunho(RASCUNHO_NOVO);
    setAviso('');
  }

  function abrirEdicao(id: number) {
    const p = produtos.find((x) => x.id === id);
    if (!p) return;
    setEditId(id);
    setRascunho({
      nome: p.nome, tipo: p.tipo, sec: p.sec, preco: p.preco, padrao: p.padrao, cor: p.cor,
      medidas: p.medidas, tecido: p.tecido, combina: p.combina, custo: p.custo, stock: p.stock,
      nova: p.nova,
    });
    setAviso('');
  }

  function cancelar() {
    setEditId(null);
    setAviso('');
  }

  function atualizarRascunho<K extends keyof NovoProdutoAdmin>(campo: K, valor: NovoProdutoAdmin[K]) {
    setRascunho((r) => ({ ...r, [campo]: valor }));
  }

  async function guardar() {
    try {
      const guardado =
        editId === 'novo' || editId === null
          ? await criarProduto(rascunho)
          : await editarProduto(editId, rascunho);
      setAviso(editId === 'novo' || editId === null ? `Peça criada: ${guardado.nome}.` : `Peça atualizada: ${guardado.nome}.`);
      setEditId(null);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível guardar a peça.'));
    }
  }

  /** Atualiza a galeria de uma peça em memória depois de um upload/apagar de foto — sem recarregar tudo. */
  function atualizarFotosProduto(id: number, fotos: ProdutoFotoDTO[]) {
    setProdutos((atual) => atual.map((p) => (p.id === id ? { ...p, fotos } : p)));
  }

  async function apagar(id: number) {
    try {
      const resultado = await apagarProduto(id);
      setAviso(
        resultado.desativada
          ? `${resultado.nome} já tem vendas — foi escondida da loja em vez de apagada, para o histórico não partir.`
          : `${resultado.nome} apagada.`
      );
      setEditId(null);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível apagar a peça.'));
    }
  }

  async function alternar(id: number, campo: 'ativo' | 'destaque' | 'nova') {
    try {
      if (campo === 'ativo') await alternarAtivo(id);
      else if (campo === 'destaque') await alternarDestaque(id);
      else await alternarNovo(id);
      setAviso('');
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível atualizar a peça.'));
    }
  }

  return {
    produtos, carregando, erro, aviso,
    editId, rascunho, atualizarRascunho,
    abrirNovo, abrirEdicao, cancelar, guardar, apagar, alternar, atualizarFotosProduto,
  };
}
