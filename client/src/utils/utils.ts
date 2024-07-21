export const formatCurrency = (amount: any) => {
  let number = parseFloat(amount);

  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};
