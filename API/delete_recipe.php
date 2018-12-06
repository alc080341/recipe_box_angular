<?php

header('Access-Control-Allow-Origin: *');

$response = [];


if(isset($_POST) && isset($_POST['userID']))
{
	$recipeID = $_POST['recipeID'];
	$userID = $_POST['userID'];
	include_once("connection.php");


// Delete recipe
	$delete_recipe = "DELETE FROM recipes WHERE userID='$userID' AND recipeID='$recipeID'";
	$delete_recipe_ingredients = "DELETE FROM ingredients WHERE  	ingredientRecipeID='$recipeID'";
	$delete_recipe_method = "DELETE FROM method WHERE methodRecipeID='$recipeID'";

	if(mysqli_query($dbconn, $delete_recipe_ingredients))
	{
		mysqli_query($dbconn, $delete_recipe_method);
		mysqli_query($dbconn, $delete_recipe);
	}
	$response['status'] = 'success';

	$dbconn->close();
	echo json_encode($response);
}


else
{
	$response['status'] = 'error';
	echo json_encode($response);
}



?>



