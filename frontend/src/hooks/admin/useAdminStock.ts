// formulário de movimento + inventário + movimentos do mês
import { useCallback, useEffect, useState } from 'react';
import { getStock, registarEntrada, registarSaida, registarVenda, type StockDTO } from '../../api/admin/stock';
import { MOTIVOS } from '../../mocks/admin/movimentosStock.mock';
import type { MotivoSaida } from '../../models/admin/movimentoStock';
import { mensagemErro } from '../../lib/erroApi';
import { useAdminStockContext } from './useAdminStockContext';

export function useAdminStock() {
  const { notificarStockAlterado } = useAdminStockContext();
  const [stock, setStock] = useState<StockDTO | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [motivo, setMotivo] = useState<MotivoSaida>('quebra');

  const carregar = useCallback(() => {
    setCarregando(true);
    getStock()
      .then((dto) => {
        setStock(dto);
        setErro(null);
        setProdutoId((atual) => atual ?? dto.inventario[0]?.produtoId ?? null);
      })
      .catch(() => setErro('Não foi possível carregar o stock.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const nomeProduto = (id: number) => stock?.inventario.find((i) => i.produtoId === id)?.nome ?? '';

  async function registar(tipo: 'entrada' | 'saida' | 'venda') {
    if (produtoId === null) return;
    const qtyValida = Math.max(1, qty || 1);
    try {
      if (tipo === 'entrada') {
        await registarEntrada(produtoId, qtyValida);
        setAviso(`Entrada de ${qtyValida} × ${nomeProduto(produtoId)} registada.`);
      } else if (tipo === 'saida') {
        await registarSaida(produtoId, qtyValida, motivo);
        setAviso(`Saída (${MOTIVOS[motivo].toLowerCase()}) de ${qtyValida} × ${nomeProduto(produtoId)} registada.`);
      } else {
        const { referencia } = await registarVenda(produtoId, qtyValida);
        setAviso(`Venda ${referencia} registada: ${qtyValida} × ${nomeProduto(produtoId)}. Caixa de hoje e stock atualizados.`);
      }
      carregar();
      notificarStockAlterado();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível registar o movimento.'));
    }
  }

  return {
    stock, carregando, erro, aviso,
    produtoId, setProdutoId, qty, setQty, motivo, setMotivo,
    registrarEntrada: () => registar('entrada'),
    registrarSaida: () => registar('saida'),
    registrarVenda: () => registar('venda'),
  };
}
