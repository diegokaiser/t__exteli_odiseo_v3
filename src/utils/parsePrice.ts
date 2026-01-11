export const parsePrice = (price: string | number): string => {
  const numeric = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numeric)) {
    throw new Error(`Invalid price value ${price}`);
  }
  return numeric.toFixed(2);
};
