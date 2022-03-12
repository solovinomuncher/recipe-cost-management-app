const resizeRecipe = require("./resizeRecipe");

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

test("returns a recipe", () => {
  expect(resizeRecipe(mockRecipe, 2)).toEqual(mockRecipe);
});

test("handles zero as input", () => {
  expect(resizeRecipe(mockRecipe, 0)).toBe("Error!");
});

test("handles negative as input", () => {
  expect(resizeRecipe(mockRecipe, -1)).toBe("Error!");
});

test("increases ingredient qty & serving size from 2 to 4 servings", () => {
  expect(resizeRecipe(mockRecipe, 4)).toEqual({
    recipeName: "Chocolate Milk",
    recipeNotes: "Luscious!",
    servingSize: 4,
    fullIngredients: [
      {
        name: "milk",
        qty: 4,
        unit: "cups",
      },
      {
        name: "cocoa powder",
        qty: 2,
        unit: "ounces",
      },
      {
        name: "sugar",
        qty: 4,
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
  });
});

test("decreases ingredient qty & serving size from 2 to 1 servings", () => {
  expect(resizeRecipe(mockRecipe, 1)).toEqual({
    recipeName: "Chocolate Milk",
    recipeNotes: "Luscious!",
    servingSize: 1,
    fullIngredients: [
      {
        name: "milk",
        qty: 1,
        unit: "cups",
      },
      {
        name: "cocoa powder",
        qty: 0.5,
        unit: "ounces",
      },
      {
        name: "sugar",
        qty: 1,
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
  });
});
