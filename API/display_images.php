<?php

header('Access-Control-Allow-Origin: *');

$response = [];
$images = array();

include_once("connection.php");

	$sql_fetch_images = "SELECT * FROM images";
	$images_query = mysqli_query($dbconn, $sql_fetch_images);

	while($row = mysqli_fetch_assoc($images_query))
	{
		$images[] = $row;
	}
	$response['images'] = json_encode($images);
	$response['status'] = 'success';

	echo json_encode($response);

?>



