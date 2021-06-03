import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:3030/scoops", (req, res, ctx) => {
    return res(
      ctx.json([
        { name: "Chocolate", imagePath: "/images/chocolate.png" },
        { name: "Vanilla", imagePath: "/images/vanilla.png" },
      ])
    );
  }),
  rest.get("http://localhost:3030/toppings", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "Cherries",
          imagePath: "/images/cherries.png",
          alt: "Cherries topping",
        },
        {
          name: "M&Ms",
          imagePath: "/images/m-and-ms.png",
          alt: "M&Ms topping",
        },
        {
          name: "Hot fudge",
          imagePath: "/images/hot-fudge.png",
          alt: "Hot fudge topping",
        },
      ])
    );
  }),
  rest.post("http://localhost:3030/order", (req, res, ctx) => {
    return res(ctx.json({ orderNumber: 123455676 }));
  }),
];
