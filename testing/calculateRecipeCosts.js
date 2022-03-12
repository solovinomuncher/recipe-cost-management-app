const calculateRecipeCosts = (recipe) => {
  let copiedRecipe = JSON.parse(JSON.stringify(recipe));
  let ingredients = copiedRecipe.fullIngredients;
  let bulkIngredients = copiedRecipe.bulkCosts;

  const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

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

module.exports = calculateRecipeCosts;
