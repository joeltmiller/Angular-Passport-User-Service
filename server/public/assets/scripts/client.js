/**
 * Created by joelmiller on 1/26/16.
 */
var app = angular.module('getApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'views/login.html',
				controller: 'MainController'
			})
			.when('/success', {
				templateUrl: 'views/success.html',
				controller: 'SuccessController'
			});

		$locationProvider.html5Mode(true);
});

app.controller('MainController', function($scope, $http, $location, UserService){
	$scope.userData = UserService.userData;

	$http.get('getUser').then(function(response){
		console.log(response);
		$scope.user = response;
	});

	$scope.sendDataAndStuff = function(){
		var loginSuccesful = UserService.makeLoginRequest($scope.data);
		$location.path('success');
	};
});


	app.controller('SuccessController', function($scope, $http, UserService){
	$scope.userData = UserService.userData;
});

app.factory('UserService', function($http){

	var userData = {};

	var makeLoginRequest = function(data){
		$http.post('/', data).then(function(response){
			 console.log(response);
			 userData.server = response.data;
			 userData.username = response.data.username;
			 userData.isLoggedIn = true;
			 userData.logInTime = new Date();
			 if(response.data.username){
				 return true;
			 } else {
				 return false;
			 }
		});
	};

	return {
		userData: userData,
		makeLoginRequest: makeLoginRequest
	};


});
