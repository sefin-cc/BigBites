import { useState, useEffect } from "react";

interface AddOns {
  label: string;
  price: number;
}

interface MenuItems {
  qty: number;
  subId: string;
  itemId: string;
  label: string;
  fullLabel: string;
  description: string;
  price: number;
  time: string;
  image: string;
  addOns: Array<AddOns>;
  selectedAddOns: Array<AddOns>;
}


const useCartTotal = (items: MenuItems[]) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let calculatedTotal = 0;
    items.forEach(item => {
      // Calculate price for each item (item.price * item.qty)
      let itemTotal = item.price * item.qty;

      // Add selected add-ons price
      item.selectedAddOns.forEach(addOn => {
        itemTotal += Number(addOn.price);
      });

      // Add the item total to the grand total
      calculatedTotal += itemTotal;
    });

    setTotal(Number(calculatedTotal.toFixed(2)));

  }, [items]); // Re-run whenever items change

  return total;
};

export default useCartTotal;
