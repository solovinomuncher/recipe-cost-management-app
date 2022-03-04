let ingredients, bulkIngredients, ingredientCosts;
let trueRecipeName;

const resizeRecipe = (e) => {
  e.preventDefault();
  const recipeName = document.querySelector("#recipe-name").value;
  const recipeNotes = document.querySelector("#recipe-notes").value;
  const recipeOGServingSize = document.querySelector(
    "#original-recipe-serving-size"
  ).value;
  const recipeNewServingSize = document.querySelector(
    "#new-recipe-serving-size"
  ).value;

  const collectIngredientInputs = () => {
    let ingredientInputArray = [];
    for (let i = 0; i < 10; i++) {
      ingredientInputArray[i] = document.querySelectorAll(
        `[data-ingredient-index="${i}"]`
      );
    }
    return ingredientInputArray;
  };

  const ingredientInputArray = collectIngredientInputs();
  console.log(ingredientInputArray);
  console.log(ingredientInputArray[0]);

  const fullIngredientFactory = (qty, unit, name) => {
    return { qty, unit, name };
  };

  const generateFullIngredientArray = () => {
    let fullIngredientArray = [];
    for (let i = 0; i < 10; i++) {
      let qty, unit, name, fullIngredient;
      ingredientInputArray[i].forEach((input) => {
        if (input.type === "number") {
          qty = input.value;
        } else if (input.type === "select-one") {
          unit = input.value;
        } else if (input.type === "text") {
          name = input.value;
        }
      });
      if (qty === "") {
        console.log("undefined");
      } else {
        fullIngredient = fullIngredientFactory(qty, unit, name);
        console.log(fullIngredient);
        fullIngredientArray.push(fullIngredient);
      }
    }

    return fullIngredientArray;
  };

  const fullIngredientArray = generateFullIngredientArray();
  console.log(fullIngredientArray[0]);
  console.log(fullIngredientArray);

  const calculateRecipeRatio = () => {
    if (recipeNewServingSize === "") {
      return 1;
    } else {
      return recipeNewServingSize / recipeOGServingSize;
    }
  };

  const newRecipeRatio = calculateRecipeRatio();

  fullIngredientArray.forEach((ingredient) => {
    ingredient.qty = ingredient.qty * newRecipeRatio;
  });

  console.log(fullIngredientArray);
  ingredients = fullIngredientArray;
  trueRecipeName = recipeName;
};

const btnResizeRecipe = document.querySelector(".btn-resize-recipe");
btnResizeRecipe.addEventListener("click", resizeRecipe);

const costingRecipe = (e) => {
  e.preventDefault();
  const collectBulkCostInputs = () => {
    let bulkCostInputArray = [];
    for (let i = 0; i < 10; i++) {
      bulkCostInputArray[i] = document.querySelectorAll(
        `[data-ingredient-bulk-cost-index="${i}"]`
      );
    }
    return bulkCostInputArray;
  };

  const bulkCostInputArray = collectBulkCostInputs();
  console.log(bulkCostInputArray);
  console.log(bulkCostInputArray[0]);

  const fullBulkCostFactory = (qty, unit, cost) => {
    return { qty, unit, cost };
  };

  const generateFullBulkCostArray = () => {
    let fullBulkCostArray = [];
    for (let i = 0; i < 10; i++) {
      let qty, unit, cost, fullBulkCost;
      bulkCostInputArray[i].forEach((input) => {
        if (input.id === "bulk-weight") {
          qty = input.value;
        } else if (input.type === "select-one") {
          unit = input.value;
        } else if (input.id === "bulk-cost") {
          cost = input.value;
        }
      });
      if (qty === undefined) {
        console.log("undefined");
      } else {
        fullBulkCost = fullBulkCostFactory(qty, unit, cost);
        console.log(fullBulkCost);
        fullBulkCostArray.push(fullBulkCost);
      }
    }

    return fullBulkCostArray;
  };

  const fullBulkCostArray = generateFullBulkCostArray();
  console.log(fullBulkCostArray[0]);
  console.log(fullBulkCostArray);

  // scenario: 2 cup milk needed, 5 gallon milk have, how many cups in have?
  // recipe qty = 2
  // recipe units = cup
  // bulk qty = 5
  // bulk units = gallon

  // how many (recipe units) are in (bulk units)? = ratio
  // eg how many cups are in a gallon = 16 cups per 1 gallon
  // how many (recipe units) are in (bulk in recipe units)?
  // eg multiply 5 and 16 = 96 cups

  // scenario continued: 5gal/96 cup milk have, 2 cups need, ratio?
  // what percentage is (recipe qty in recipe units) of (bulk qty in recipe units)?
  // eg 2 cups / 96 cups = 2%

  // most common bulk imperial units:
  // WEIGHT: ounces (oz) and pounds (lbs)
  // VOLUME: cups (cups) and gallons (gal)
  // DO NOT USE: 1 gal = 128 fluid oz (water)
  // DO NOT USE: 1 cup = 8 fluid oz (water)

  // 1 cup = 16 tbsp
  // 1 cup = 48 tsp

  // 1 gal = 16 cups
  // 1 lb = 16 oz

  // 1 fluid oz = 2 tbsp
  // 1 fluid oz = 6 tsp

  // 1 pint = 2 cups
  // 1 pint = 16 fl oz
  // 1 quart = 4 cups
  // 1 quart = 32 fl oz
  // 1 gal = 8 pints
  // 1 gal = 4 quarts

  // COMMON DRY CUP TO WEIGHTS
  // 1 cup flour = 4.2 oz
  // 1 cup whole wheat flour = 4.6 oz
  // 1 cup almond flour = 3.9 oz

  console.log(fullBulkCostArray);
  bulkIngredients = fullBulkCostArray;
  console.log(ingredients);
  let recipeIngredientCosts = [];

  const recipeIngredientCostFactory = (ingredient, recipeCost) => {
    return { ingredient, recipeCost };
  };

  for (let i = 0; i < ingredients.length; i++) {
    let newBulkQty, percentage, recipeIngredientCost, object, multiplier;
    if (
      ingredients[i].unit === "cups" &&
      bulkIngredients[i].unit === "gallons"
    ) {
      multiplier = 16;
    } else if (
      ingredients[i].unit === "cups" &&
      bulkIngredients[i].unit === "fluid-ounces"
    ) {
      multiplier = 1 / 8;
    } else if (
      ingredients[i].unit === "ounces" &&
      bulkIngredients[i].unit === "pounds"
    ) {
      multiplier = 16;
    } else if (
      ingredients[i].unit === "tablespoons" &&
      bulkIngredients[i].unit === "cups"
    ) {
      multiplier = 16;
    } else if (
      ingredients[i].unit === "teaspoons" &&
      bulkIngredients[i].unit === "cups"
    ) {
      multiplier = 48;
    } else if (
      ingredients[i].unit === "tablespoons" &&
      bulkIngredients[i].unit === "gallons"
    ) {
      multiplier = 256;
    } else if (
      ingredients[i].unit === "teaspoons" &&
      bulkIngredients[i].unit === "gallons"
    ) {
      multiplier = 768;
    } else if (
      ingredients[i].unit === "fluid-ounces" &&
      bulkIngredients[i].unit === "gallons"
    ) {
      multiplier = 128;
    } else if (
      ingredients[i].unit === "fluid-ounces" &&
      bulkIngredients[i].unit === "cups"
    ) {
      multiplier = 8;
    } else if (
      ingredients[i].unit === "tablespoons" &&
      bulkIngredients[i].unit === "fluid-ounces"
    ) {
      multiplier = 2;
    } else if (
      ingredients[i].unit === "teaspoons" &&
      bulkIngredients[i].unit === "fluid-ounces"
    ) {
      multiplier = 6;
    } else if (
      ingredients[i].unit === "pint" &&
      bulkIngredients[i].unit === "gallon"
    ) {
      multiplier = 8;
    } else if (
      ingredients[i].unit === "quart" &&
      bulkIngredients[i].unit === "gallon"
    ) {
      multiplier = 4;
    } else if (
      ingredients[i].unit === "each" &&
      bulkIngredients[i].unit === "each"
    ) {
      multiplier = bulkIngredients[i].qty;
    } else if (
      ingredients[i].unit === "dashes" ||
      ingredients[i].unit === "pinches"
    ) {
      multiplier = bulkIngredients[i].qty;
      console.log("cannot calculate, placeholder here");
    } else {
      multiplier = 1;
      console.log("assuming same units");
    }
    newBulkQty = bulkIngredients[i].qty * multiplier;
    percentage = ingredients[i].qty / newBulkQty;
    console.log(percentage);
    recipeIngredientCost = percentage * bulkIngredients[i].cost;
    console.log(recipeIngredientCost);
    object = recipeIngredientCostFactory(
      ingredients[i].name,
      recipeIngredientCost
    );
    recipeIngredientCosts.push(object);
  }
  console.log(recipeIngredientCosts);
  ingredientCosts = recipeIngredientCosts;

  displayIngredientCosts(); // here or elsewhere?
};

const round = (value, precision) => {
  let multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const displayIngredientCosts = () => {
  const main = document.querySelector("main");

  const title = document.createElement("h2");
  title.classList.add("recipe-cost-printout__title");
  title.textContent = "Recipe & Ingredient Costs";

  const recipeTitle = document.createElement("h3");
  recipeTitle.classList.add("recipe-title");
  recipeTitle.textContent = `${trueRecipeName}`;

  const recipeCost = document.createElement("p");
  recipeCost.classList.add("recipe-total-cost");

  const container = document.createElement("div");
  container.classList.add("container");

  let costs = 0;

  ingredientCosts.forEach((ingredient) => {
    const div = document.createElement("div");
    div.classList.add("ingredient");

    const p1 = document.createElement("p");
    p1.classList.add("ingredient__name");
    p1.textContent = `${ingredient.ingredient}`;
    div.appendChild(p1);

    const p2 = document.createElement("p");
    p2.classList.add("ingredient__cost");
    p2.textContent = `$${round(ingredient.recipeCost, 2)}`;
    div.appendChild(p2);

    costs += round(ingredient.recipeCost, 2);

    container.appendChild(div);
  });

  main.appendChild(title);
  main.appendChild(recipeTitle);
  recipeCost.textContent = `Total Cost: $${costs}`;
  main.appendChild(recipeCost);

  // final step
  main.appendChild(container);
};

const btnCostingRecipe = document.querySelector(".btn-costing-recipe");
btnCostingRecipe.addEventListener("click", costingRecipe);

const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const clearRecipe = (e) => {
  e.preventDefault();
  const main = document.querySelector("main");
  removeAllChildNodes(main);
};

const btnClearRecipe = document.querySelector(".btn-clear-recipe");
btnClearRecipe.addEventListener("click", clearRecipe);
