const calculateRecipeCosts = require("./calculateRecipeCosts");

const mockRecipe = {
  recipeName: "Chocolate Milk",
  recipeNotes: "Luscious!",
  servingSize: 2,
  fullIngredients: [
    {
      name: "milk",
      qty: 2,
      unit: "cups",
    },
    {
      name: "cocoa powder",
      qty: 1,
      unit: "ounces",
    },
    {
      name: "sugar",
      qty: 2,
      unit: "ounces",
    },
  ],
  bulkCosts: [
    {
      qty: 3,
      unit: "gallons",
      cost: 15,
    },
    {
      qty: 25,
      unit: "pounds",
      cost: 5,
    },
    {
      qty: 30,
      unit: "pounds",
      cost: 10,
    },
  ],
  recipeCosts: [],
};

test("processes recipe (cups & gallons, ounces & pounds)", () => {
  expect(calculateRecipeCosts(mockRecipe)).toEqual({
    recipeName: "Chocolate Milk",
    recipeNotes: "Luscious!",
    servingSize: 2,
    fullIngredients: [
      {
        name: "milk",
        qty: 2,
        unit: "cups",
      },
      {
        name: "cocoa powder",
        qty: 1,
        unit: "ounces",
      },
      {
        name: "sugar",
        qty: 2,
        unit: "ounces",
      },
    ],
    bulkCosts: [
      {
        qty: 3,
        unit: "gallons",
        cost: 15,
      },
      {
        qty: 25,
        unit: "pounds",
        cost: 5,
      },
      {
        qty: 30,
        unit: "pounds",
        cost: 10,
      },
    ],
    recipeCosts: [
      {
        name: "milk",
        cost: 0.63,
      },
      {
        name: "cocoa powder",
        cost: 0.01,
      },
      {
        name: "sugar",
        cost: 0.04,
      },
    ],
  });
});
