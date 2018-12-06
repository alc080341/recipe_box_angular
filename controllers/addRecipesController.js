
// Controller for the add recipe constructor

recipeBox.controller('addRecipeController', function($scope, $http, $location, recipesService, authenticationService)
{
	if(authenticationService.getUserStatus())
	{
		$scope.getUserStatus = authenticationService.getUserName();
	}
	else
	{
		$location.path('/login_page');	
	}
	$scope.name = {};
	$scope.show_hide_ingredients = "Add ingredients";
	$scope.show_hide_method = "Add method";
	$scope.ingredients = [];
	$scope.method = [];
	$scope.image = "";
	$scope.recipeName = ""; 
	$scope.ingredientsIsVisible = false;
	$scope.methodIsVisible = false;
	$scope.methodStepIsVisible = false;
	$scope.methodStepID = 0;
	$scope.editMethodStepButton = "Edit";
	$scope.stepsArray = [{entry:false, message: 'title'},{entry:false, message: 'ingredients'},{entry:false, message: 'method'},{entry:false, message: 'image'}];
	$scope.imageArray = [];
	$scope.show_image_gallery = false;

	recipesService.getImages().then(function(response) {
		if(response.data.status == 'success')
		{
			let result = JSON.parse(response.data.images);
			$scope.imageArray = result;
		}
		else
		{
			alert("Sorry, there has been a problem loading images");
		}
	});




// Show or hide the add ingredients or add method displays
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


// Show or hide the image selection gallery
$scope.showImageGallery = function()
{
	$scope.show_image_gallery = !$scope.show_image_gallery;
}


// Add method 
$scope.addCompleteMethod = function(completeMethodString)
{
	//Split up the method string into an array
	let completeMethodSplit = completeMethodString.split("///");
	
	//Checks that data was entered
	if(this.completeMethod !== "" && this.completeMethod !== undefined)
	{
		//Iterate through array
		completeMethodSplit.forEach(methodStep => {
			//Add the array as a method step if it has a length that is not equal to 0 after the blank space has been trimmed
			if(methodStep.trim().length !== 0)
			{
				$scope.method.push({stepID: $scope.method.length + 1, step: methodStep.trim()});
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
		$scope.method.forEach((methodStep, index) => {
			if(methodStep.stepID === id)
			{
				$scope.method.splice(index, 1);
			}
		});
		if($scope.method.length === 0)
		{
			$scope.stepsArray[2].entry = false;
		}
	}

}



$scope.editMethodStep = function(id)
{
	if(confirm("Are you sure you want to save edit?"))
	{
		$scope.method.forEach((editStep, index) => {
			if(editStep.stepID === id)
			{
				$scope.method[index].step = this.stepEdit;
			}
		});
	}		
}


$scope.addIngredient = function(unitOrMeas, amount, measurement, title)
{
	let ingredientID = $scope.ingredients.length + 1;

	// Check that a title exists
	if(this.ingredientTitle !== "" && this.ingredientTitle !== undefined)
	{
		// Check that the amount is a number, is not empty or undefined.
		if(!isNaN(amount) && (amount !== undefined) && (amount !== ""))
		{
			let unitAmount = "1";
			let measurementAmount = "";

			// If selected input 'select unit or measurement' is unit, add amount to unit. If it is measurement, add to measurement.
			if(unitOrMeas === "Unit")
			{
				unitAmount = amount.toString();
			}
			else if(unitOrMeas === "Measurement")
			{
				measurementAmount = amount.toString();
			}
			else
			{
				alert("Please select unit or measurement");
				return;
			}
			//If input measurement is none, return a blank string.
			measurement === "none" ? measurement = "" : "";

			$scope.ingredients.push({ingredientID: ingredientID, type: unitOrMeas, units: unitAmount, amount: measurementAmount, measurement: measurement, ingredient: title});
			this.ingredientTitle = "";

			//This is for when the user submits. As it is true, it means that this step has been completed!
			$scope.stepsArray[1].entry = true;
		}
		else
		{
			alert("Please enter number of units or measurement in input field labelled 'Enter number of units or measurement per unit'.")
		}	
	}
	else
	{
		alert("No ingredient was entered. Please enter an ingredient.");
	}
}



$scope.removeIngredient = function(id)
{
	if(confirm("Are you sure you want to delete this item?"))
	{
		$scope.ingredients.forEach((ing, index) => {
			if(ing.ingredientID === id)
			{
				$scope.ingredients.splice(index, 1);
			}
		});

		//If there are no ingredients, this step needs to be completed before the user submits
		if($scope.ingredients.length === 0)
		{
			$scope.stepsArray[1].entry = false;
		}
	}

}


$scope.addTitle = function()
{
	if(this.recipeTitle.trim() !== "" && this.recipeTitle !== undefined)
	{
		$scope.recipeName = this.recipeTitle.trim();
		$scope.recipeTitle = "";
		$scope.stepsArray[0].entry = true;
	}
	else
	{
		alert("No title was entered");
		$scope.stepsArray[0].entry = false;
	}

}

$scope.addImage = function(recipeImgSrc)
{
	if(recipeImgSrc.trim() !== "" && recipeImgSrc !== undefined)
	{
		$scope.image = recipeImgSrc.trim();
		$scope.stepsArray[3].entry = true; 
		$scope.show_image_gallery = !$scope.show_image_gallery;
	}
	else
	{
		alert("Error adding image!");
		$scope.stepsArray[3].entry = false;
	}

}





$scope.processNewRecipe = function()
{
	let message = "You have not entered ";
	let alertProblem = false;

	//Checks that each step of the process of adding a recipe has been completed.
	$scope.stepsArray.forEach((thisStep, index) => {
		if(thisStep.entry === false)
		{
			message += $scope.stepsArray[index].message + ", ";
			alertProblem = true;
		}
	});

	if(alertProblem && confirm(message + "are you sure you want to proceed?"))
	{
		$scope.saveRecipe();
	}
	else if(!alertProblem)
	{
		$scope.saveRecipe();
	}
}



$scope.saveRecipe = function()
{
	var userID = authenticationService.getUserName();
	recipesService.insertRecipes(userID, $scope.recipeName, $scope.image, $scope.ingredients, $scope.method);
	$location.path('/main_page');	

}




});




