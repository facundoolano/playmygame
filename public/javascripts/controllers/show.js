var showAppCtrl = angular.module('showAppCtrl', []);

showAppCtrl.controller('showAppCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/apps')
		.success(function(data) {
			$scope.app = data;
		})
		.error(function(data) {
			console.log('Error getting app: ' + data);
		});

}]);