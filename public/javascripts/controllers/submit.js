var submitAppCtrl = angular.module('submitAppCtrl', []);

submitAppCtrl.controller('submitAppCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {

	$scope.app = {};
	$scope.error = "";
	$scope.submit = submit;

	function submit() {
		$scope.error = "";

		$http.post('/apps', $scope.app).success(function(data) {
			$location.path("/show/" + data.appId);
		})
		.error(function(error) {
			$scope.error = error;
		});
	}


}]);