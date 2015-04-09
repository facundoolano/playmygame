var submitAppCtrl = angular.module('submitAppCtrl', []);

submitAppCtrl.controller('submitAppCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.app = {};
	$scope.success = false;
	$scope.error = "";
	$scope.submit = submit;

	function submit() {
		$http.post('/apps', $scope.app).success(function(data) {
			$scope.success = true;
		})
		.error(function(error) {
			$scope.error = error;
		});
	}


}]);