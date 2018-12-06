var recipeBox = angular.module("recipeBox",['ngRoute']);
recipeBox.config(function($routeProvider){
	$routeProvider
	.when('/view_recipe/:recipeID', {
		controller: 'currentRecipeController',
		templateUrl: 'partials/view_recipe.html'
	})
	.when('/edit_recipe/:recipeID', {
		controller: 'editRecipeController',
		templateUrl: 'partials/edit_recipe.html'

	})
	.when('/add_recipe', {
		controller: 'addRecipeController',
		templateUrl: 'partials/add_recipe.html'
	})
	.when('/shopping_list', {
		controller: 'shoppingListController',
		templateUrl: 'partials/shopping_list.html'
	})
	.when('/main_page', {
		resolve: {
			check: function($location, authenticationService) {
				if(!authenticationService.getUserStatus()) {
					$location.path('/login_page');
				}
			},
		},
		controller: 'recipesController',
		templateUrl: 'partials/main_page.html'
	})
	.when('/welcome_page', {
		templateUrl: 'partials/welcome_page.html'
	})
	.when('/login_page', {
		controller: 'authenticationController',
		templateUrl: 'partials/login_page.html'
	})
	.when('/register_page', {
		controller: 'authenticationController',
		templateUrl: 'partials/register_page.html'
	})
	.when('/logout', {
		resolve: {

			check: function($location, authenticationService) {
				if(authenticationService.getUserStatus()) {
					authenticationService.changeUserStatus(false);
					$location.path('/login_page');	
				}
			}
			},
	})
	.otherwise({
		redirectTo: '/welcome_page'
	})
});
