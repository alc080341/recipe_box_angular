

recipeBox.controller('shoppingListController', function($scope, recipesService, authenticationService) {

	if(authenticationService.getUserStatus())
	{
		$scope.getUserStatus = authenticationService.getUserName();
	}
	else
	{
		$location.path('/login_page');	
	}

	$scope.ingredients = {};

	init();

	function init() {
		$scope.ingredients = recipesService.getShoppingList();
	}


	$scope.deleteIngredient = function(id)
	{
		if(confirm("Are you sure you want to delete this item?"))
		{
			let thisId = id;
			recipesService.deleteIngredient(thisId);
		}
	}

	$scope.editIngredient = function(id)
	{
		if($scope.ingredients[id].type === "Unit")
		{
			this.ingredientAmount = $scope.ingredients[id].units;
		}
		else
		{
			this.ingredientAmount = $scope.ingredients[id].amount;	
		}
		this.ingredientMeasurement = $scope.ingredients[id].measurement;
		this.ingredientTitle = $scope.ingredients[id].ingredient;
	}

	$scope.saveEditedIngredient = function(id, type, amount, units)
	{
		if(confirm("Are you sure you want to edit this ingredient?"))
		{
			let ingredientTitle = this.ingredientTitle;
			let ingredientType = type;
			let ingredientMeasurement = this.ingredientMeasurement;
			let ingredientUnits = units;
			let ingredientAmount = amount;
			if (type === "Unit")
			{
				ingredientUnits = this.ingredientAmount;
			}
			else
			{
				ingredientAmount = this.ingredientAmount;
			}
			recipesService.editIngredient(id, type, ingredientUnits, ingredientAmount, ingredientMeasurement, ingredientTitle);
			
		}
	}


});


