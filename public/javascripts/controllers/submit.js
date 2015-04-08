var submitAppCtrl = angular.module('submitAppCtrl', []);

submitAppCtrl.controller('submitAppCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.app = {};
	$scope.submit = submit;

	function submit() {
		$http.post('/apps', $scope.app).success(function(data) {
			console.log("got back app:", data);
		})
		.error(function(data) {
			console.log('Error in submitting app: ' + data);
		});
	}


}]);