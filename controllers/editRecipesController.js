

recipeBox.controller('editRecipeController', function($scope, $routeParams, $location, authenticationService, recipesService)
{

	if(authenticationService.getUserStatus())
	{
		$scope.getUserStatus = authenticationService.getUserName();
	}
	else
	{
		$location.path('/login_page');	
	}
	$scope.recipe = {};
	$scope.show_hide_ingredients = "Add ingredients";
	$scope.show_hide_method = "Add method";
	$scope.ingredientsIsVisible = false;
	$scope.methodIsVisible = false;
	$scope.methodStepIsVisible = false;
	$scope.editMethodStepButton = "Edit";
	$scope.stepsArray = [{entry:true, message: 'title'},{entry:true, message: 'ingredients'},{entry:true, message: 'method'},{entry:true, message: 'image'}];
	$scope.currentIngredientID = undefined;


	init();

	function init() {
	//Grab recipeID from route
	var recipeID = ($routeParams.recipeID) ? parseInt($routeParams.recipeID) : 0;
	if (recipeID > -1) 
	{
		// Grab the recipe from the recipe service
		$scope.recipe = recipesService.getRecipe(recipeID);
	}


}



$scope.showHide = function(e)
{
	if(e === "ingredientsDisplay")
	{
		$scope.ingredientsIsVisible = !$scope.ingredientsIsVisible;
		$scope.ingredientsIsVisible === false ? $scope.show_hide_ingredients = "Add ingredients" : 	$scope.show_hide_ingredients = "Hide add ingredients display";
	}
	else if(e === "methodDisplay")
	{
		$scope.methodIsVisible = !$scope.methodIsVisible;
		$scope.methodIsVisible === false ? $scope.show_hide_method = "Add method" : 	$scope.show_hide_method = "Hide add method display";
	}
}





$scope.editTitle = function()
{
	if(confirm("Are you sure you want to edit the title?"))
	{	
		if(this.recipeTitle.trim() !== "" && this.recipeTitle !== undefined)
		{
			$scope.recipe.recipeName = this.recipeTitle.trim();
			$scope.recipeTitle = "";
			$scope.stepsArray[0].entry = true;
		}
		else
		{
			alert("No title was entered");
			$scope.stepsArray[0].entry = false;
		}
	}
}


$scope.editImage = function()
{
	if(confirm("Are you sure you want to change the image?"))
	{
		if(this.imageEdit.trim() !== "" && this.imageEdit !== undefined)
		{
			$scope.recipe.recipeImage = this.imageEdit.trim();
			$scope.stepsArray[3].entry = true; 
		}
		else
		{
			alert("No image has been entered");
			$scope.stepsArray[3].entry = false;
		}
	}
}






$scope.addIngredient = function(unitOrMeas, amount, measurement, title)
{
	let ingredientID = $scope.recipe.recipeIngredients.length + 1;
	if(this.ingredientTitle !== "" && this.ingredientTitle !== undefined)
	{
		if(!isNaN(amount) && (amount !== undefined) && (amount !== ""))
		{
			let unitAmount = 0;
			let measurementAmount = 0;
			if(unitOrMeas === "Unit")
			{
				unitAmount += amount;
			}
			else if(unitOrMeas === "Measurement")
			{
				measurementAmount += amount;
			}
			else
			{
				alert("Please select unit or measurement");
				return;
			}

			if($scope.currentIngredientID !== undefined)
			{
				if(confirm("Are you sure you want to edit this ingredient?"))
				{	
					$scope.recipe.recipeIngredients.forEach((recIng, index) => {
					if(recIng.ingredientID === $scope.currentIngredientID)
						{
							$scope.recipe.recipeIngredients[index].amount = measurementAmount;
							$scope.recipe.recipeIngredients[index].units = unitAmount;
							$scope.recipe.recipeIngredients[index].measurement = measurement;
							$scope.recipe.recipeIngredients[index].ingredient = title;
							$scope.recipe.recipeIngredients[index].type = unitOrMeas;
						}
					});

					$scope.currentIngredientID = undefined;
					this.ingredientUnits = 0;
					this.ingredientAmount = 0
					this.ingredientMeasurement = "none";
					this.ingredientTitle = "";
					alert("Success!");
				}
			}	

			else
			{
				measurement === "none" ? measurement = "" : "";
				$scope.recipe.recipeIngredients.push({ingredientID: ingredientID, type: unitOrMeas, units: unitAmount, amount: measurementAmount, measurement: measurement, ingredient: title});
				this.ingredientTitle = "";
				$scope.stepsArray[1].entry = true;
				alert("Ingredient added!");
			}
		}
		else
		{
			alert("Please ensure that both the unit and the amount are both numbers")
		}	
	}
	else
	{
		alert("No ingredient was entered. Please enter an ingredient.");
	}
}


$scope.editIngredient = function(id) 
{
		$scope.recipe.recipeIngredients.forEach((recIng, index) => {
		if(recIng.ingredientID === id)
		{
			$scope.currentIngredientID = id;
			$scope.unitOrMeasurement = recIng.type;
			if(recIng.type === "Unit")
			{
				$scope.ingredientAmount = recIng.units;
			}
			else
			{
				$scope.ingredientAmount = recIng.amount;	
			}
			$scope.ingredientMeasurement = recIng.measurement;
			$scope.ingredientTitle = recIng.ingredient;
			$scope.ingredientsIsVisible = true;
			$scope.show_hide_ingredients = "Hide add ingredients display";
		}
	});
}




$scope.removeIngredient = function(id)
{
	if(confirm("Are you sure you want to delete this item?"))
	{
		$scope.recipe.recipeIngredients.forEach((recIng, index) => {
			if(recIng.ingredientID === id)
			{
				$scope.recipe.recipeIngredients.splice(index, 1);
			}
		});
		if($scope.recipe.recipeIngredients.length === 0)
		{
			$scope.stepsArray[1].entry = false;
		}
	}
}


// Add complete method
$scope.addCompleteMethod = function(completeMethodString)
{
	let completeMethodSplit = completeMethodString.split("///");
	if(this.completeMethod !== "" && this.completeMethod !== undefined)
	{
		completeMethodSplit.forEach((thisStep, index) => {
			if(thisStep.trim().length !== 0)
			{
				$scope.recipe.recipeMethod.push({stepID: $scope.recipe.recipeMethod.length + 1, step: completeMethodSplit[index].trim()});
				$scope.stepsArray[2].entry = true;
			}
		});
		this.completeMethod = "";
	}
	else
	{
		alert("No method information was entered. Please enter some method information.");
	}
}





// Remove a method step
$scope.removeMethodStep = function(id)
{
	if(confirm("Are you sure you want to delete this item?"))
	{
		$scope.recipe.recipeMethod.forEach((thisStep, index) => {
			if(thisStep.stepID === id)
			{
				$scope.recipe.recipeMethod.splice(index, 1);
			}	
		});
		if($scope.recipe.recipeMethod.length === 0)
		{
			$scope.stepsArray[2].entry = false;
		}
	}
}



$scope.editMethodStep = function(id)
{
	if(confirm("Are you sure you want to save edit?"))
	{
		$scope.recipe.recipeMethod.forEach((thisStep, index) => {
			if(thisStep.stepID === id)
			{
				$scope.recipe.recipeMethod[index].step = this.stepEdit;
			}
		});
	}		
}




$scope.saveRecipe = function()
{
	if(confirm("Are you sure that you want to make edits to this recipe?"))
	{
		let message = "You have not entered ";
		let alertProblem = false;
		$scope.stepsArray.forEach((thisStep, index) => {
		if(thisStep.entry === false)
			{
				message += $scope.stepsArray[index].message + ", ";
				alertProblem = true;
			}
		});
		if(alertProblem && confirm(message + "are you sure you want to proceed?"))
		{
			recipesService.editRecipe($scope.getUserStatus, $scope.recipe.recipeID, $scope.recipe.recipeName, $scope.recipe.recipeImage, $scope.recipe.recipeIngredients, $scope.recipe.recipeMethod);
			$location.path('/main_page');	
		}

		else if(!alertProblem)
		{
			recipesService.editRecipe($scope.getUserStatus, $scope.recipe.recipeID, $scope.recipe.recipeName, $scope.recipe.recipeImage, $scope.recipe.recipeIngredients, $scope.recipe.recipeMethod);
			$location.path('/main_page');	
		}


	}
}



});

