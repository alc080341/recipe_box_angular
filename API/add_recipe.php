<?php

header('Access-Control-Allow-Origin: *');

$response = [];


if(isset($_POST) && isset($_POST['userID']))
{
	$userID = $_POST['userID'];
	$recipeName = $_POST['recipeName'];
	$recipeImage = $_POST['recipeImage'];

	$ingredients = $_POST['ingredientsArray'];
	$ingredientsArray = json_decode($ingredients, true);

	$method = $_POST['methodArray'];
	$methodArray = json_decode($method, true);

	include_once("connection.php");


	// Insert recipeID, userID, recipeName and recipeImage into DB recipes


	if($_POST['addOrEdit'] == 'addRecipe')
	{

		$sql_store = $dbconn->prepare("INSERT into recipes (userID, recipeName, recipeImage) VALUES (?,?,?)");
		$sql_store->bind_param("sss", $userID, $recipeName, $recipeImage);
		$sql_store->execute();


		$sql_fetch_recipes_ID = "SELECT * FROM recipes WHERE userID = '$userID' ORDER BY recipeID DESC LIMIT 1";

		$result = mysqli_query($dbconn, $sql_fetch_recipes_ID) or die(mysqli_error());


		if(mysqli_num_rows($result) > 0)
		{
			while($row = mysqli_fetch_array($result, MYSQL_ASSOC))
			{
				$recipeID = $row['recipeID'];
			}

		}


	// Insert ingredients into DB ingredients
		if(count($ingredientsArray) > 0)
		{
			for($i = 0; $i < count($ingredientsArray); ++$i)
			{
				$sql_store = $dbconn->prepare("INSERT into ingredients (ingredientID, type, units, amount, measurement, ingredient, ingredientRecipeID) VALUES (?,?,?,?,?,?,?)");
				$sql_store->bind_param("isiissi", 
					$ingredientsArray[$i]['ingredientID'], 
					$ingredientsArray[$i]['type'], 
					$ingredientsArray[$i]['units'], 
					$ingredientsArray[$i]['amount'],
					$ingredientsArray[$i]['measurement'],
					$ingredientsArray[$i]['ingredient'],
					$recipeID);
				$sql_store->execute();
			}

		}

	// Insert method into DB database
		if(count($methodArray) > 0)
		{
			for($j = 0; $j < count($methodArray); ++$j)
			{
				$sql_store = $dbconn->prepare("INSERT into method (stepID, step, methodRecipeID) VALUES (?,?,?)");
				$sql_store->bind_param("isi", 
					$methodArray[$j]['stepID'], 
					$methodArray[$j]['step'],
					$recipeID
					);

				$sql_store->execute();
			}
		}

		$response['status'] = 'success';
	}


	else if($_POST['addOrEdit'] == 'editRecipe')
	{
		$recipeID = $_POST['recipeID'];
		$sql_store = $dbconn->prepare("UPDATE recipes SET recipeName=?, recipeImage=? WHERE recipeID=? AND userID=?");
		$sql_store->bind_param("ssii", $recipeName, $recipeImage, $recipeID, $userID);
		$sql_store->execute();


		// Update recipe ingredients
		if(count($ingredientsArray) > 0)
		{
			for($i = 0; $i < count($ingredientsArray); ++$i)
			{
				$sql_store = $dbconn->prepare("UPDATE ingredients SET ingredientID=?, type=?, units=?, amount=?, measurement=?, ingredient=? WHERE ingredientRecipeID=?");
				$sql_store->bind_param("isiissi", 
					$ingredientsArray[$i]['ingredientID'], 
					$ingredientsArray[$i]['type'], 
					$ingredientsArray[$i]['units'], 
					$ingredientsArray[$i]['amount'],
					$ingredientsArray[$i]['measurement'],
					$ingredientsArray[$i]['ingredient'],
					$recipeID);
				$sql_store->execute();
			}

		}


	// Update method 
		if(count($methodArray) > 0)
		{
			for($j = 0; $j < count($methodArray); ++$j)
			{
				$sql_store = $dbconn->prepare("UPDATE method SET stepID=?, step=? WHERE methodRecipeID=?");
				$sql_store->bind_param("isi", 
					$methodArray[$j]['stepID'], 
					$methodArray[$j]['step'],
					$recipeID
					);

				$sql_store->execute();
			}
		}

		$response['status'] = 'success';
	}

	else
	{
		$response['status'] = 'error';
	}




	$sql_store->close();
	$dbconn->close();

	echo json_encode($response);

}


else

{
	$response['status'] = 'error';
	echo json_encode($response);
}



?>



