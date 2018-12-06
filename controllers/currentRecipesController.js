


//Controller for the view recipe page

recipeBox.controller('currentRecipeController', function($scope, $routeParams, authenticationService,recipesService, $location) {
	if(authenticationService.getUserStatus())
	{
		$scope.getUserStatus = authenticationService.getUserName();
	}
	else
	{
		$location.path('/login_page');	
	}
	$scope.recipe = {};

	init();

	function init() {
	//Grab recipeID from route
	var recipeID = ($routeParams.recipeID) ? parseInt($routeParams.recipeID) : -1;
	if (recipeID > -1) 
	{
		// Grab the recipe from the recipe service
		$scope.recipe = recipesService.getRecipe(recipeID);
	}


}

$scope.deleteRecipe = function(id)
{
	if (confirm("Are you sure you want to delete this recipe?"))
	{
		let thisId = id;
		recipesService.deleteRecipe(thisId, $scope.getUserStatus);
		$location.path('/main_page');	
	}
}



//Merges the ingredients from the current recipe to the shopping list on the shopping list page

$scope.mergeIngredientsToList = function()
{
	if(confirm("Are you sure you want to merge these recipe ingredients to the shopping list?"))
	{
		let currentIng = $scope.recipe.recipeIngredients;
		for(let i = 0; i < currentIng.length; i++)
		{
				if(currentIng[i].type === "Measurement")
				{
					currentIng[i].units = "1";
				}
				// If the type is unit, add to units.  
				else if(currentIng[i].type === "Unit")
				{
					currentIng[i].amount = "";
				}	
			recipesService.insertIngredients(currentIng[i].type, currentIng[i].units, currentIng[i].amount, currentIng[i].measurement, currentIng[i].ingredient); 
		}

			alert("Success");

	}
}


})






