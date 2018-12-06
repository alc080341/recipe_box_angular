recipeBox.controller('recipesController', function($scope, authenticationService, recipesService) {
	if(authenticationService.getUserStatus())
	{
		$scope.getUserStatus = authenticationService.getUserName();
		init();
	}
	else
	{
		$location.path('/login_page');	
	}

	$scope.showAlertNoRecipes = false;
	$scope.alertNoRecipes = "No recipes to display at present. Try adding a recipe.";

// Get recipes from service recipesService
function init() {
		recipesService.getRecipes($scope.getUserStatus).then(function(response) {
			if(response.data.status == 'success')
			{
				let result = JSON.parse(response.data.recipes);
				$scope.recipes = result;
				recipesService.updateRecipes($scope.recipes);
				if($scope.recipes.length < 1)
				{
					$scope.showAlertNoRecipes = true;
				}
			}
			else
			{
				alert("Sorry, there has been a problem loading recipes");
			}
		});;
		
}







});





