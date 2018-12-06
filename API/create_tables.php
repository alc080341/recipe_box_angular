<?php


include_once("connection.php");


$sql = 'CREATE TABLE IF NOT EXISTS users (id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(256) NOT NULL, password VARCHAR(256) NOT NULL, admin int(11)
)';

mysqli_query($dbconn, $sql) or die('Create table users failed');
echo "<p>Table users created</p>";




$sql = 'CREATE TABLE IF NOT EXISTS recipes (globalID INT(11) PRIMARY KEY, recipeID VARCHAR(256), userID VARCHAR(256) NOT NULL, recipeName VARCHAR(256), recipeImage VARCHAR(256))';

mysqli_query($dbconn, $sql) or die('Create table recipes failed');
echo "<p>Table recipes created</p>";




$sql = 'CREATE TABLE IF NOT EXISTS ingredients (globalID INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, ingredientRecipeID INT(11), ingredientID INT(11), ingredient VARCHAR(256), type VARCHAR(256), units INT(11), amount INT(11), measurement VARCHAR(256))';

mysqli_query($dbconn, $sql) or die('Create table ingredients failed');
echo "<p>Table ingredients created</p>";





$sql = 'CREATE TABLE IF NOT EXISTS method (globalID INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY, methodRecipeID INT(11), stepID INT(11), step VARCHAR(256))';

mysqli_query($dbconn, $sql) or die('Create table method failed');
echo "<p>Table method created</p>";
