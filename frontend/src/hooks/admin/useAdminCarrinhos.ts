// carrinhos abertos: converter em encomenda (regra 6) ou apagar
import { useCallback, useEffect, useState } from 'react';
import { apagarCarrinho, converterCarrinho, getCarrinhosAdmin, type CarrinhoLinha } from '../../api/admin/carrinhos';

export function useAdminCarrinhos() {
  const [carrinhos, setCarrinhos] = useState<CarrinhoLinha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(() => {
    setCarregando(true);
    getCarrinhosAdmin()
      .then((lista) => {
        setCarrinhos(lista);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar os carrinhos.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function converter(id: number) {
    const atual = carrinhos.find((c) => c.id === id);
    if (!atual) return;
    const { ref } = await converterCarrinho(id);
    setAviso(`Carrinho de ${atual.clienteNome} virou a encomenda ${ref}, por pagar.`);
    carregar();
  }

  async function apagar(id: number) {
    await apagarCarrinho(id);
    setAviso('Carrinho abandonado apagado.');
    carregar();
  }

  return { carrinhos, carregando, erro, aviso, converter, apagar };
}
