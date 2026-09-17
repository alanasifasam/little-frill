// conta do mês, margem, ponto de equilíbrio, projeção, histórico de 6 meses,
// gestão das linhas de custo fixo e dos custos variáveis pontuais
import { useCallback, useEffect, useState } from 'react';
import { getFinanceiro, type FinanceiroDTO } from '../../api/admin/financeiro';
import {
  atualizarCustoFixo,
  criarCustoFixo,
  removerCustoFixo as removerCustoFixoApi,
  type EdicaoCustoFixo,
  type NovoCustoFixo,
} from '../../api/admin/custosFixos';
import {
  atualizarCustoVariavel,
  criarCustoVariavel,
  listarCustosVariaveis,
  removerCustoVariavel as removerCustoVariavelApi,
  type CustoVariavelDTO,
  type EdicaoCustoVariavel,
  type NovoCustoVariavel,
} from '../../api/admin/custosVariaveis';
import { mensagemErro } from '../../lib/erroApi';

export function useAdminFinanceiro() {
  const [financeiro, setFinanceiro] = useState<FinanceiroDTO | null>(null);
  const [custosVariaveis, setCustosVariaveis] = useState<CustoVariavelDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(() => {
    setCarregando(true);
    Promise.all([getFinanceiro(), listarCustosVariaveis()])
      .then(([dto, variaveis]) => {
        setFinanceiro(dto);
        setCustosVariaveis(variaveis);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar os custos e o lucro.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Os totais (fixosTotal, lucro, margem, projeções…) são derivados no
  // servidor a partir das linhas de custo fixo ativas — por isso qualquer
  // mutação volta a carregar o `financeiro` inteiro em vez de só atualizar
  // a lista local.
  async function adicionarCustoFixo(input: NovoCustoFixo): Promise<boolean> {
    try {
      await criarCustoFixo(input);
      setAviso('Custo fixo adicionado.');
      carregar();
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível adicionar o custo fixo.'));
      return false;
    }
  }

  async function editarCustoFixo(id: number, input: EdicaoCustoFixo): Promise<boolean> {
    try {
      await atualizarCustoFixo(id, input);
      setAviso('Custo fixo atualizado.');
      carregar();
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível atualizar o custo fixo.'));
      return false;
    }
  }

  async function removerCustoFixo(id: number): Promise<boolean> {
    try {
      await removerCustoFixoApi(id);
      setAviso('Custo fixo removido.');
      carregar();
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível remover o custo fixo.'));
      return false;
    }
  }

  // O total do mês (`custoVariavelTotal`, `custosVariaveisDoMes`) também é
  // derivado no servidor — por isso as mutações voltam a carregar tanto o
  // `financeiro` como a lista completa de custos variáveis.
  async function adicionarCustoVariavel(input: NovoCustoVariavel): Promise<boolean> {
    try {
      await criarCustoVariavel(input);
      setAviso('Custo variável adicionado.');
      carregar();
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível adicionar o custo variável.'));
      return false;
    }
  }

  async function editarCustoVariavel(id: number, input: EdicaoCustoVariavel): Promise<boolean> {
    try {
      await atualizarCustoVariavel(id, input);
      setAviso('Custo variável atualizado.');
      carregar();
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível atualizar o custo variável.'));
      return false;
    }
  }

  async function removerCustoVariavel(id: number): Promise<boolean> {
    try {
      await removerCustoVariavelApi(id);
      setAviso('Custo variável removido.');
      carregar();
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível remover o custo variável.'));
      return false;
    }
  }

  return {
    financeiro, custosVariaveis, carregando, erro, aviso,
    adicionarCustoFixo, editarCustoFixo, removerCustoFixo,
    adicionarCustoVariavel, editarCustoVariavel, removerCustoVariavel,
  };
}
