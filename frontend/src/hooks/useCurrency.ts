const formatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0
});

export function formatCurrency(value: number): string {
  return formatter.format(value);
}
