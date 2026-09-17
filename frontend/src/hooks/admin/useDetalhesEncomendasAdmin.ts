// toggle de linha aberta na tabela de encomendas do admin + cache local do
// detalhe (itens) por referência, para não pedir duas vezes a mesma encomenda
import { useState } from 'react';
import { getEncomendaAdminDetalhe, type EncomendaAdminDetalhe } from '../../api/admin/encomendas';

export function useDetalhesEncomendasAdmin() {
  const [referenciaAberta, setReferenciaAberta] = useState<string | null>(null);
  const [detalhes, setDetalhes] = useState<Record<string, EncomendaAdminDetalhe>>({});
  const [carregandoRef, setCarregandoRef] = useState<string | null>(null);
  const [erroRef, setErroRef] = useState<string | null>(null);

  function alternar(ref: string) {
    if (referenciaAberta === ref) {
      setReferenciaAberta(null);
      return;
    }
    setReferenciaAberta(ref);
    if (detalhes[ref]) return;
    setCarregandoRef(ref);
    setErroRef(null);
    getEncomendaAdminDetalhe(ref)
      .then((detalhe) => setDetalhes((atual) => ({ ...atual, [ref]: detalhe })))
      .catch(() => setErroRef(ref))
      .finally(() => setCarregandoRef((atual) => (atual === ref ? null : atual)));
  }

  return { referenciaAberta, detalhes, carregandoRef, erroRef, alternar };
}
