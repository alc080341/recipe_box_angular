

recipeBox.controller('authenticationController', function($scope, $location, $http, authenticationService) {



$scope.formFeedback = "";
$scope.feedbackStatus = "form_feedback";

$scope.register = function()
{
	var userName = $scope.username;
	var passWord = $scope.password;
	var repeatPassword = $scope.repeat_password;
	if(repeatPassword != passWord)
	{
		$scope.feedbackStatus = "form_feedback";
		$scope.formFeedback = "The passwords do not match";
		return;
	}
	$http({
			url:'https://chamberscreative.co.uk/recipe_box_angular/recipe_box/API/register.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username=' + userName + '&password=' + passWord
	}).then(function(response) {
		if(response.data.status == 'success')
		{
			$scope.feedbackStatus = "form_feedback_success";
			$scope.formFeedback = "You are now registered with recipeBox " + userName;
		}
		else
		{
			$scope.feedbackStatus = "form_feedback";
			$scope.formFeedback = "Sorry there has been a problem.";
		}
	})
}

$scope.login = function() 
{
	var userName = $scope.username;
	var passWord = $scope.password;
	$http({
			url:'https://chamberscreative.co.uk/recipe_box_angular/recipe_box/API/login.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username=' + userName + '&password=' + passWord
		}).then(function(response) {
			if(response.data.status == 'loggedin')
			{
				authenticationService.changeUserStatus(true, userName);
				$location.path('/main_page');
			}
			else
			{
				$scope.formFeedback = "Username or password is incorrect";
				authenticationService.changeUserStatus(false);
				$location.path('/login_page');
			}
		});

};
});


