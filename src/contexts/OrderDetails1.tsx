import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { pricePerItem } from "../constants";

type OptionCountsProps = {
  scoops: Map<string, number>;
  toppings: Map<string, number>;
};

type TotalProps = {
  scoops: number;
  toppings: number;
  grandTotal: number;
};

type updateItemCountFn = (
  itemName: string,
  newItemCount: string,
  optionType: keyof OptionCountsProps
) => void;

type OrderProps<T> = T & {
  children: React.ReactNode;
};

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

function OrderDetailsProvider<T>({ children, ...props }: OrderProps<T>) {
  //use obj + map
  const [optionCounts, setOptionCounts] = useState<OptionCountsProps>({
    scoops: new Map(),
    toppings: new Map(),
  });

  const [total, setTotals] = useState<TotalProps>({
    scoops: 0,
    toppings: 0,
    grandTotal: 0,
  });

  function calculateSubtotal(
    orderType: keyof OptionCountsProps,
    optionCounts: OptionCountsProps
  ) {
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
      scoops: scoopsSubtotal,
      toppings: toppingsSubtotal,
      grandTotal,
    });
  }, [optionCounts]);

  const value = useMemo(() => {
    const updateItemCount: updateItemCountFn = (
      itemName,
      newItemCount,
      optionType
    ) => {
      const newOptionCounts = { ...optionCounts };

      const optionCountsMap = newOptionCounts[optionType];

      optionCountsMap.set(itemName, Number(newItemCount));

      setOptionCounts(newOptionCounts);
    };

    return [
      {
        ...optionCounts,
        total,
      },
      updateItemCount,
    ];
  }, [optionCounts, total]);

  return (
    <OrderDetails.Provider value={value} {...props}>
      {children}
    </OrderDetails.Provider>
  );
}

export { OrderDetailsProvider, useOrderDetails };
