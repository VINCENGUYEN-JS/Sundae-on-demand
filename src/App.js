import { useState } from "react";

import "./App.css";
import Container from "react-bootstrap/Container";
import { OrderDetailsProvider } from "./contexts/OrderDetails.jsx";
import OrderConfirmation from "./pages/confirmation/OrderConfirmation";
import OrderEntry from "./pages/entry/OrderEntry";
import OrderSummary from "./pages/summary/OrderSummary";

function App() {
  const [orderPhrase, setOrderPhrase] = useState("inProgress");

  let Component = OrderEntry;

  switch (orderPhrase) {
    case "inProgress":
      Component = OrderEntry;
      break;
    case "review":
      Component = OrderSummary;
      break;
    case "completed":
      Component = OrderConfirmation;
      break;
    default:
  }

  return (
    <Container>
      <OrderDetailsProvider>
        <Component setOrderPhrase={setOrderPhrase} />
      </OrderDetailsProvider>
    </Container>
  );
}

export default App;
