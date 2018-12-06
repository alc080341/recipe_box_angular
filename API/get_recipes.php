<?php

header('Access-Control-Allow-Origin: *');

$recipes = [];
$ingredients = [];
$method = [];
$userID = $_POST['userID'];



include_once("connection.php");


$sql_fetch_user_recipes = "SELECT * FROM recipes WHERE userID = '$userID'";



$i = 0;
$j = 0;
$k = 0;


$query_recipes = mysqli_query($dbconn, $sql_fetch_user_recipes);



if(mysqli_num_rows($query_recipes) > 0)
{
	while($row = mysqli_fetch_array($query_recipes, MYSQL_ASSOC))
	{
		$recipes[$i]->recipeID = intval($row['recipeID']);
		$recipes[$i]->recipeName = $row['recipeName'];
		$recipes[$i]->recipeImage = $row['recipeImage'];
		$recipeID = $row['recipeID'];

		// Get the ingredients
		$sql_fetch_recipe_ingredients = "SELECT * FROM ingredients WHERE ingredientRecipeID = '$recipeID'";
		$query_ingredients = mysqli_query($dbconn, $sql_fetch_recipe_ingredients);
		if(mysqli_num_rows($query_ingredients) > 0)
		{
			while($rowIng = mysqli_fetch_assoc($query_ingredients))
			{
				$ingredients[$j]->ingredientID = intval($rowIng['ingredientID']);
				$ingredients[$j]->type = $rowIng['type'];
				$ingredients[$j]->units = $rowIng['units'];
				$ingredients[$j]->amount = $rowIng['amount'];
				$ingredients[$j]->measurement = $rowIng['measurement'];
				$ingredients[$j]->ingredient = $rowIng['ingredient'];
				++$j;
			}
			$recipes[$i]->recipeIngredients = $ingredients;
			$ingredients = [];
			$j=0;
		}

		// Get the method
		$sql_fetch_recipe_method = "SELECT * FROM method WHERE methodRecipeID = '$recipeID'";
		$query_method = mysqli_query($dbconn, $sql_fetch_recipe_method);
		if(mysqli_num_rows($query_method) > 0)
		{
			while($rowMethod = mysqli_fetch_assoc($query_method))
			{
				$method[$k]->stepID = intval($rowMethod['stepID']);
				$method[$k]->step = $rowMethod['step'];
				++$k;
			}
			$recipes[$i]->recipeMethod = $method;
			$method = [];
			$k=0;
		}

		++$i;
	}
}

$response = [];
$response['recipes'] = json_encode($recipes);
$response['username'] = $userID;
$response['status'] = 'success';

echo json_encode($response);








?>



