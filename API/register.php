<?php

header('Access-Control-Allow-Origin: *');

$response = [];

if(isset($_POST) && isset($_POST['username']))
{

	include_once("connection.php");
	$username = $_POST['username'];
	$password = $_POST['password'];
	$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
	

	$sql_store = $dbconn->prepare("INSERT into users (username, password) VALUES (?,?)");
	$sql_store->bind_param("ss", $username, $hashedPassword);

	$sql_fetch_username = "SELECT username FROM users WHERE username = '$username'";
	




	$query_username = mysqli_query($dbconn, $sql_fetch_username);

	if(mysqli_num_rows($query_username))
	{
		$response['status'] = 'username_exists';
		return;
	}
	if($username == "")
	{
		$response['status'] = 'empty_username';
		return;
	}
	if($password == "")
	{
		$response['status'] = 'empty_password';
		return;
	}

	$response['status'] = 'success';

	echo json_encode($response);

	$sql_store->execute();
	$sql_store->close();
	$dbconn->close();
}

?>



