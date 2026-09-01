export const formatCurrency = (amountMinor: number, currency: string = 'INR'): string => {
  const amount = amountMinor / 100;
  if (currency === 'INR') {
    return `₹${amount.toFixed(2)}`;
  }
  return `${currency} ${amount.toFixed(2)}`;
};
