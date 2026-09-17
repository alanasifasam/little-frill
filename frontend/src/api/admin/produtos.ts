// GET/POST /api/admin/produtos, PUT/DELETE /api/admin/produtos/{id},
// PATCH .../ativo, PATCH .../destaque, PATCH .../novo, POST .../fotos (multipart),
// DELETE .../fotos/{fotoId}, PUT .../fotos/{fotoId}/principal, PATCH .../fotos/{fotoId}/foco
import { client } from '../client';
import type { ProdutoAdmin } from '../../models/admin/produtoAdmin';

export interface ProdutoAdminLinha extends ProdutoAdmin {
  vendidas: number;
}

export async function getProdutosAdmin(): Promise<ProdutoAdminLinha[]> {
  const { data } = await client.get<ProdutoAdminLinha[]>('/admin/produtos');
  return data;
}

export type NovoProdutoAdmin = Omit<ProdutoAdmin, 'id' | 'ativo' | 'destaque' | 'fotoKey'>;

export async function criarProduto(dados: NovoProdutoAdmin): Promise<ProdutoAdminLinha> {
  const { data } = await client.post<ProdutoAdminLinha>('/admin/produtos', dados);
  return data;
}

export async function editarProduto(id: number, dados: NovoProdutoAdmin): Promise<ProdutoAdminLinha> {
  const { data } = await client.put<ProdutoAdminLinha>(`/admin/produtos/${id}`, dados);
  return data;
}

export interface ApagarProdutoResultado {
  desativada: boolean;
  nome: string;
}

/** Produto com vendas nunca é apagado — o apagar transforma-se em desativar (regra 3). */
export async function apagarProduto(id: number): Promise<ApagarProdutoResultado> {
  const { data } = await client.delete<ApagarProdutoResultado>(`/admin/produtos/${id}`);
  return data;
}

export async function alternarAtivo(id: number): Promise<boolean> {
  const { data } = await client.patch<boolean>(`/admin/produtos/${id}/ativo`);
  return data;
}

export async function alternarDestaque(id: number): Promise<boolean> {
  const { data } = await client.patch<boolean>(`/admin/produtos/${id}/destaque`);
  return data;
}

export async function alternarNovo(id: number): Promise<boolean> {
  const { data } = await client.patch<boolean>(`/admin/produtos/${id}/novo`);
  return data;
}

export interface ProdutoFotoDTO {
  id: number;
  key: string;
  ordem: number;
  principal: boolean;
  focoX: number;
  focoY: number;
}

/** Envia uma fotografia nova (multipart) para a galeria da peça. Devolve a foto criada. */
export async function adicionarFotoProduto(id: number, ficheiro: File): Promise<ProdutoFotoDTO> {
  const formData = new FormData();
  formData.append('ficheiro', ficheiro);
  const { data } = await client.post<ProdutoFotoDTO>(`/admin/produtos/${id}/fotos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function removerFotoProduto(id: number, fotoId: number): Promise<void> {
  await client.delete(`/admin/produtos/${id}/fotos/${fotoId}`);
}

/** Designa esta foto como principal (não mexe em `ordem`). Devolve só a foto alterada. */
export async function definirFotoPrincipal(id: number, fotoId: number): Promise<ProdutoFotoDTO> {
  const { data } = await client.put<ProdutoFotoDTO>(`/admin/produtos/${id}/fotos/${fotoId}/principal`);
  return data;
}

/** Roda a foto 90° (direita ou esquerda). Devolve só a foto alterada — a key muda a cada rotação. */
export async function rodarFotoProduto(id: number, fotoId: number, sentidoHorario: boolean): Promise<ProdutoFotoDTO> {
  const { data } = await client.patch<ProdutoFotoDTO>(`/admin/produtos/${id}/fotos/${fotoId}/rodar`, { sentidoHorario });
  return data;
}

/** Atualiza o ponto focal (percentagem 0-100) desta foto. Devolve só a foto alterada. */
export async function definirFocoProduto(id: number, fotoId: number, focoX: number, focoY: number): Promise<ProdutoFotoDTO> {
  const { data } = await client.patch<ProdutoFotoDTO>(`/admin/produtos/${id}/fotos/${fotoId}/foco`, { focoX, focoY });
  return data;
}
