
recipeBox.service('authenticationService', function() {
	var loggedInStatus = false;
	var userName = "";
	
	this.getUserStatus = function()
	{
		return loggedInStatus;
	}

	this.changeUserStatus = function(newState, name)
	{
		loggedInStatus = newState;
		this.addUserName(name);
	}

	this.addUserName = function(name)
	{
		userName = name;	
	}

	this.getUserName = function()
	{
		return userName;
	}

});


recipeBox.factory('recipesService', function($http) {

	var service = {};
	var recipes = [];
	

//Recipes functions

service.getRecipes = function (userID)
{
	var userID = userID;
	return $http({
		url:'https://chamberscreative.co.uk/recipe_box_angular/recipe_box/API/get_recipes.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: 'userID=' + userID 
	})

}

service.getRecipesLength = function()
{
	return recipes.length;
}

service.updateRecipes = function(val)
{
	recipes = val;
}


service.insertRecipes = function (userID, recipeName, recipeImage, recipeIngredients, recipeMethod) 
{
	var methodArray = JSON.stringify(recipeMethod);
	var ingredientsArray = JSON.stringify(recipeIngredients);
	

	$http({
		url:'https://chamberscreative.co.uk/recipe_box_angular/recipe_box/API/add_recipe.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: 'userID=' + userID + '&recipeName=' + recipeName + '&recipeImage=' + recipeImage + '&methodArray=' + methodArray + '&ingredientsArray=' + ingredientsArray +'&addOrEdit=addRecipe'
	}).then(function(response) {
		if(response.data.status == 'success')
		{
			recipes.push({
				recipeName: recipeName,
				recipeImage: recipeImage,
				recipeIngredients: recipeIngredients,
				recipeMethod: recipeMethod
			});
			alert("Recipe added");
		}
		else
		{
			alert("Sorry, there has been a problem");
		}
	});



}

service.deleteRecipe = function(recipeID, userID) {

	$http({
		url:'https://chamberscreative.co.uk/recipe_box_angular/recipe_box/API/delete_recipe.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: 'userID=' + userID + '&recipeID=' + recipeID 
	}).then(function(response) {
		if(response.data.status == 'success')
		{
			recipes.forEach((rec, index) => {
				if(rec.recipeID === recipeID)
				{
					recipes.splice(index, 1);
				}
			});
			alert("Recipe deleted");
		}
		else
		{
			alert("Sorry, there has been a problem");
		}
	});

}



service.getRecipe = function(id) {
	for (let i = 0; i < recipes.length; i++)
	{
		if(recipes[i].recipeID === id)
		{
			return recipes[i];
		}
	}
}



service.editRecipe = function(userID,recipeID,name,img,ing,method)
{
	var methodArray = JSON.stringify(method);
	var ingredientsArray = JSON.stringify(ing);
	
	$http({
		url:'https://chamberscreative.co.uk/recipe_box_angular/recipe_box/API/add_recipe.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: 'userID=' + userID + '&recipeID=' + recipeID + '&recipeName=' + name + '&recipeImage=' + img + '&methodArray=' + methodArray + '&ingredientsArray=' + ingredientsArray +'&addOrEdit=editRecipe'
	}).then(function(response) {
		if(response.data.status == 'success')
		{
			recipes.forEach((rec, index) => {
				if(rec.recipeID === recipeID)
				{
					rec.recipeName = name;
					rec.recipeImage = img;
					rec.recipeIngredients = ing;
					rec.recipeMethod = method;
				}
			});
			alert("Recipe updated!");
		}
		else
		{
			alert("Sorry, there has been a problem");
		}
	});



}


// Get the array of images from server

service.getImages = function()
{
	return $http.get("https://chamberscreative.co.uk/recipe_box_angular/recipe_box/API/display_images.php");
}


// Shopping list functions


let shopping_list = [];

service.getShoppingList = function ()
{
	return shopping_list;
}



service.insertIngredients = function(type, units, amount, measurement, ingredient) 
{
	var ingID = shopping_list.length;
	shopping_list.forEach((item, index) => {
			//If the ingredient item exists
			if((item.ingredient.trim().toLowerCase() === ingredient.trim().toLowerCase()) && (item.measurement.trim().toLowerCase() === measurement.trim().toLowerCase()))
			{
				// If the type is measurement - add to amount
				if(item.type === "Measurement")
				{
					item.amount += parseInt(amount);
					item.units = 1;
				}
				// If the type is unit, add to units.  
				else if(item.type === "Unit")
				{
					item.units += parseInt(units);
					item.amount = "";
				}	
			}

		});


		// If it does not exist, add it to the list...
		shopping_list.push({
			ingredientID: ingID,
			type: type,
			units: units,
			amount: amount,
			measurement: measurement,
			ingredient: ingredient
		});

	}


	service.deleteIngredient = function(id)
	{
		shopping_list.forEach((item, index) => {
			if(item.ingredientID === id)
			{
				shopping_list.splice(index, 1);
			}	
		});
	}




	service.editIngredient = function(id, type, units, amount, measurement, title)
	{
		shopping_list[id].type = type;
		shopping_list[id].units = units;
		shopping_list[id].amount = amount;
		shopping_list[id].measurement = measurement;
		shopping_list[id].ingredient = title;
		alert("Success");
	}

	return service;

})

