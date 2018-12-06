<?php
header('Access-Control-Allow-Origin: *');

$response = [];
if(isset($_POST) && isset($_POST['username']))
{
	include_once("connection.php");
	$username = $_POST['username'];
	$password = $_POST['password'];

	if(empty($username) || empty($password))
	{
		$response['status'] = 'error';
		exit();			
	}	
	else
	{
		$sql = "SELECT * FROM users WHERE username ='$username' LIMIT 1";
		$result = mysqli_query($dbconn, $sql);
		$resultCheck = mysqli_num_rows($result);
		
		$row = mysqli_fetch_array($result);
		$id = $row['id'];
		if($resultCheck < 1)
		{
			$response['status'] = 'false_username';			
			exit();
		}
		else
		{
			$hashedPasswordCheck = PASSWORD_VERIFY($password,$row['password']);

			if($hashedPasswordCheck == false)
			{
				$response['status'] = 'Sorry...false_password';
			}
			elseif($hashedPasswordCheck == true)
			{
				$response['status'] = 'loggedin';
			}
			else
			{
				$response['status'] = 'Unknown_error';
			}
		}
		
	}

echo json_encode($response);
}