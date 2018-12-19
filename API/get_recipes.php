<?php

header('Access-Control-Allow-Origin: *');

$recipes = [];
$ingredients = [];
$method = [];
$userID = $_POST['userID'];



include_once("connection.php");



$sql_fetch_user_recipes = "SELECT * FROM recipes WHERE userID = '$userID'";
$sql_fetch_recipe_ingredients = "SELECT * FROM recipes WHERE userID = '$userID' INNER JOIN ingredients ON recipes.recipeID = ingredients.ingredientRecipeID";
$sql_fetch_recipe_method = "SELECT * FROM recipes WHERE userID ='$userID' INNER JOIN method ON recipe.recipeID = method.methodRecipeID";


$i = 0;
$j = 0;
$k = 0;


$query_recipes = mysqli_query($dbconn, $sql_fetch_user_recipes);
$query_ingredients = mysqli_query($dbconn,$sql_fetch_recipe_ingredients);
$query_method = mysqli_query($dbconn, $sql_fetch_recipe_method);


if(mysqli_num_rows($query_recipes) > 0)
{
	while($row = mysqli_fetch_array($query_recipes, MYSQL_ASSOC))
	{
		$recipes[$i]->recipeID = intval($row['recipeID']);
		$recipes[$i]->recipeName = $row['recipeName'];
		$recipes[$i]->recipeImage = $row['recipeImage'];
		++$i;
	}
}

if(mysqli_num_rows($query_ingredients) > 0)
{
	$rowIng = mysqli_fetch_assoc($query_ingredients);
	foreach ($recipes as $rec => $value) 
	{

		foreach ($rowIng as $ing => $value) 
		{
			if(intval($rowIng['recipeID']) == $rec['recipeID'])
			{
				$ingredients[$j]->ingredientID = intval($ing['ingredientID']);
				$ingredients[$j]->type = $ing['type'];
				$ingredients[$j]->units = $ing['units'];
				$ingredients[$j]->amount = $ing['amount'];
				$ingredients[$j]->measurement = $ing['measurement'];
				$ingredients[$j]->ingredient = $ing['ingredient'];
				++$j;
			}
		}
		$recipes[$i]->recipeIngredients = $ingredients;
		$ingredients = [];
		$j=0;
	}
}


if(mysqli_num_rows($query_method) > 0)
{
	$rowMethod = mysqli_fetch_assoc($query_method);
	foreach ($recipes as $rec => $value) 
	{
		foreach ($rowMethod as $met => $value) 
		{
			if (intval($rowMethod['recipeID']) == $rec['recipeID']) 
			{
				$method[$k]->stepID = intval($met['stepID']);
				$method[$k]->step = $met['step'];
				++$k;
			}
		}
		$recipes[$i]->recipeMethod = $method;
		$method = [];
		$k=0;

	}
}



$response = [];
$response['recipes'] = json_encode($recipes);
$response['username'] = $userID;
$response['status'] = 'success';

echo json_encode($response);








?>



