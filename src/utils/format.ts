export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function orderTotal(lines: { unitPriceCents: number; qty: number }[]): number {
  return lines.reduce((sum, l) => sum + l.unitPriceCents * l.qty, 0);
}

export const statusLabels: Record<string, string> = {
  aguardando_pagamento: 'Aguardando pagamento',
  aguardando_cozinheiro: 'Aguardando o cozinheiro',
  aceito: 'Pedido aceito',
  entregue: 'Entregue',
  recusado: 'Recusado pelo cozinheiro',
  cancelado: 'Cancelado',
};
