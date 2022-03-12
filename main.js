let trueRecipeName;
let recipeInfo = {};

const collectRecipeInfo = () => {
  const recipeName = document.querySelector("#recipe-name").value;
  recipeInfo.recipeName = recipeName;

  const recipeNotes = document.querySelector("#recipe-notes").value;
  recipeInfo.recipeNotes = recipeNotes;

  const recipeOGServingSize = document.querySelector(
    "#original-recipe-serving-size"
  ).value;
  if (recipeOGServingSize === NaN) {
    recipeInfo.servingSize = 1;
  } else {
    recipeInfo.servingSize = recipeOGServingSize;
  }

  const fullIngredientFactory = (qty, unit, name) => {
    return { qty, unit, name };
  };

  const collectIngredientInputs = () => {
    let ingredientInputArray = [];
    for (let i = 0; i < 10; i++) {
      ingredientInputArray[i] = document.querySelectorAll(
        `[data-ingredient-index="${i}"]`
      );
    }

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

  recipeInfo.fullIngredients = collectIngredientInputs();

  const collectBulkCostInputs = () => {
    let bulkCostInputArray = [];
    for (let i = 0; i < 10; i++) {
      bulkCostInputArray[i] = document.querySelectorAll(
        `[data-ingredient-bulk-cost-index="${i}"]`
      );
    }

    const fullBulkCostFactory = (qty, unit, cost) => {
      return { qty, unit, cost };
    };

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
      if (qty === "") {
        console.log("undefined");
      } else {
        fullBulkCost = fullBulkCostFactory(qty, unit, cost);
        console.log(fullBulkCost);
        fullBulkCostArray.push(fullBulkCost);
      }
    }

    return fullBulkCostArray;
  };

  recipeInfo.bulkCosts = collectBulkCostInputs();

  recipeInfo.recipeCosts = [];

  console.log(recipeInfo);

  return recipeInfo;
};

const resizeRecipe = (e) => {
  e.preventDefault();

  const resizeRecipeFn = (recipe, newServingSize) => {
    let copiedRecipe = JSON.parse(JSON.stringify(recipe));
    let ingredients = copiedRecipe.fullIngredients;
    let newRecipeRatio = newServingSize / copiedRecipe.servingSize;

    for (let i = 0; i < ingredients.length; i++) {
      ingredients[i].qty *= newRecipeRatio;
    }

    copiedRecipe.servingSize = newServingSize;

    return copiedRecipe;
  };

  let recipeInfo = collectRecipeInfo();
  const newServingSize = document.querySelector(
    "#new-recipe-serving-size"
  ).value;

  console.log(recipeInfo);

  recipeInfo = resizeRecipeFn(recipeInfo, newServingSize);

  console.log(recipeInfo);
  // displayIngredientCosts(); // here or elsewhere?
};

const btnResizeRecipe = document.querySelector(".btn-resize-recipe");
btnResizeRecipe.addEventListener("click", resizeRecipe);

const costingRecipe = (e) => {
  e.preventDefault();

  const determineMultiplier = (smallUnit, largeUnit, largeQty) => {
    if (
      (smallUnit === "cups" && largeUnit === "gallons") ||
      (smallUnit === "ounces" && largeUnit === "pounds") ||
      (smallUnit === "tablespoons" && largeUnit === "cups")
    ) {
      return 16;
    } else if (
      (smallUnit === "fluid-ounces" && largeUnit === "cups") ||
      (smallUnit === "pint" && largeUnit === "gallon")
    ) {
      return 8;
    } else if (smallUnit === "cups" && largeUnit === "fluid-ounces") {
      return 1 / 8;
    } else if (smallUnit === "teaspoons" && largeUnit === "cups") {
      return 48;
    } else if (smallUnit === "tablespoons" && largeUnit === "gallons") {
      return 256;
    } else if (smallUnit === "teaspoons" && largeUnit === "gallons") {
      return 768;
    } else if (smallUnit === "fluid-ounces" && largeUnit === "gallons") {
      return 128;
    } else if (smallUnit === "tablespoons" && largeUnit === "fluid-ounces") {
      return 2;
    } else if (smallUnit === "teaspoons" && largeUnit === "fluid-ounces") {
      return 6;
    } else if (smallUnit === "quart" && largeUnit === "gallon") {
      return 4;
    } else if (smallUnit === "each" && largeUnit === "each") {
      return largeQty;
    } else if (smallUnit === "dashes" || smallUnit === "pinches") {
      console.log("cannot calculate, placeholder here");
      return largeQty;
    } else {
      console.log("assuming same units");
      return 1;
    }
  };

  const calculateRecipeCosts = (recipe) => {
    let copiedRecipe = JSON.parse(JSON.stringify(recipe));
    let ingredients = copiedRecipe.fullIngredients;
    let bulkIngredients = copiedRecipe.bulkCosts;

    for (let i = 0; i < ingredients.length; i++) {
      let multiplier = determineMultiplier(
        ingredients[i].unit,
        bulkIngredients[i].unit,
        bulkIngredients[i].qty
      );

      let ingredientQty = ingredients[i].qty;
      let bulkSmallUnitQty = bulkIngredients[i].qty * multiplier;
      let costRatio = ingredientQty / bulkSmallUnitQty;
      let fullIngredientCost = bulkIngredients[i].cost * costRatio;

      copiedRecipe.recipeCosts[i] = {
        name: ingredients[i].name,
        cost: round(fullIngredientCost, 2),
      };
    }

    return copiedRecipe;
  };

  const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  let recipeInfo = collectRecipeInfo();

  recipeInfo = calculateRecipeCosts(recipeInfo);
  console.log(recipeInfo);

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

  recipeInfo.recipeCosts.forEach((ingredient) => {
    const div = document.createElement("div");
    div.classList.add("ingredient");

    const p1 = document.createElement("p");
    p1.classList.add("ingredient__name");
    p1.textContent = `${ingredient.name}`;
    div.appendChild(p1);

    const p2 = document.createElement("p");
    p2.classList.add("ingredient__cost");
    p2.textContent = `$${round(ingredient.cost, 2)}`;
    div.appendChild(p2);

    costs += round(ingredient.cost, 2);

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
