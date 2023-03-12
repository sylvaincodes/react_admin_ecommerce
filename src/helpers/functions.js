export const getProductOffer = (price, sale_price) => {
  const offer = ((price - sale_price) / price) * 100;

  return offer.toFixed(0);
};

