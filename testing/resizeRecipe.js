function resizeRecipe(recipe, newServingSize) {
  if (newServingSize <= 0) {
    return "Error!";
  }

  let copiedRecipe = JSON.parse(JSON.stringify(recipe));
  let ingredients = copiedRecipe.fullIngredients;
  let newRecipeRatio = newServingSize / copiedRecipe.servingSize;

  for (let i = 0; i < ingredients.length; i++) {
    ingredients[i].qty *= newRecipeRatio;
  }

  copiedRecipe.servingSize = newServingSize;

  return copiedRecipe;
}

module.exports = resizeRecipe;
