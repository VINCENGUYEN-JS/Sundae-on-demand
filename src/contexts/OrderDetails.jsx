import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { pricePerItem } from "../constants";
import { formatCurrency } from "../utilities";

const OrderDetails = createContext({});

//create custom hook to check whether we're inside a provider context
function useOrderDetails() {
  const context = useContext(OrderDetails);
  if (!context) {
    throw new Error(
      "useOrderDetails must be used within a OrderDetailsProvider"
    );
  }
  return context;
}

function OrderDetailsProvider(props) {
  //use obj + map
  const [optionCounts, setOptionCounts] = useState({
    scoops: new Map(),
    toppings: new Map(),
  });

  const zeroCurrency = formatCurrency(0);

  const [totals, setTotals] = useState({
    scoops: zeroCurrency,
    toppings: zeroCurrency,
    grandTotal: zeroCurrency,
  });

  function calculateSubtotal(orderType, optionCounts) {
    let optionCount = 0;

    for (let count of optionCounts[orderType].values()) {
      optionCount += count;
    }
    return optionCount * pricePerItem[orderType];
  }

  useEffect(() => {
    const scoopsSubtotal = calculateSubtotal("scoops", optionCounts);
    const toppingsSubtotal = calculateSubtotal("toppings", optionCounts);
    const grandTotal = scoopsSubtotal + toppingsSubtotal;
    setTotals({
      scoops: formatCurrency(scoopsSubtotal),
      toppings: formatCurrency(toppingsSubtotal),
      grandTotal: formatCurrency(grandTotal),
    });
  }, [optionCounts]);

  const value = useMemo(() => {
    const updateItemCount = (itemName, newItemCount, optionType) => {
      const newOptionCounts = { ...optionCounts };

      const optionCountsMap = newOptionCounts[optionType];

      optionCountsMap.set(itemName, Number(newItemCount));

      setOptionCounts(newOptionCounts);
    };

    function resetOrder() {
      setOptionCounts({
        scoops: new Map(),
        toppings: new Map(),
      });
    }

    return [
      {
        ...optionCounts,
        totals,
      },
      updateItemCount,
      resetOrder,
    ];
  }, [optionCounts, totals]);

  return <OrderDetails.Provider value={value} {...props} />;
}
export { OrderDetailsProvider, useOrderDetails };
