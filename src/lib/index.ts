import { formatDistanceStrict } from "date-fns/formatDistanceStrict";

export function getDateDifference(date: string | number | Date) {
  const distance = formatDistanceStrict(new Date(), new Date(date));
  return distance + " ago";
}

export function renderProductCount(page: number, perPageProduct: number, totalProduct: number) {
  const startNumber = (page - 1) * perPageProduct;
  let endNumber = page * perPageProduct;
  if (endNumber > totalProduct) {
    endNumber = totalProduct;
  }
  return `Showing ${startNumber + 1}-${endNumber} of ${totalProduct} products`;
}

export function calculateDiscount(price: number, discount: number) {
  const afterDiscount = Number((price - price * (discount / 100)).toFixed(2));
  return currency(afterDiscount);
}

export function currency(price: number, fraction: number = 2) {
  return Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    maximumFractionDigits: fraction
  }).format(price);
<<<<<<< HEAD
}
=======
}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
