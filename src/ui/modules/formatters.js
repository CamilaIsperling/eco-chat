export function formatarDataHora(valor) {
  if (!valor) {
    return '-';
  }

  return new Date(valor).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
