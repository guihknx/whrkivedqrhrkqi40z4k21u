angular
.module('DataHunter')
.controller('MainCtrl', MainCtrl);

function MainCtrl ($scope, $http, $location, DataTransponder) {

	var formatId = function(stdIn){
		var stdIn = "";
		stdIn = stdIn || $scope.searchQuery;
		if( stdIn ){
			stdIn = stdIn.replace( /\D/g , ""); 
			stdIn = stdIn.replace( /(\d{3})(\d)/ , "$1.$2");
			stdIn = stdIn.replace( /(\d{3})(\d)/ , "$1.$2"); 
			stdIn = stdIn.replace( /(\d{3})(\d{1,2})$/ , "$1-$2");
		}
		return stdIn;
	};

	$scope.$watch('searchField', function(value){

		if( value == undefined ) return;
		
			var pattern = /^\d{3}.\d{3}.\d{3}-\d{2}$/i;
		$scope.searchQuery = value;   
		$scope.displayHelp = false;

		$scope.searchQuery = formatId(value)
		$scope.dataInfo = [];


		if( !pattern.test( $scope.searchQuery ) ) {

			$scope.displayHelp = true;
			$scope.message = "Invalid input. Try again.";
			return false;

		}else{
			$scope.showLoading = true;
			DataTransponder.fetch($scope.searchQuery).then(function(data) { 
				$scope.showLoading = false;
				if( data.error ){
					$scope.displayHelp = true;
					$scope.message     = data.error;
					if( data.error.level === 100){
						$scope.message = data.error + '';
					}
					return false;
				}   
				$scope.displayHelp = false;
				$scope.dataInfo    = data.data;
				$scope.displayHelp = false;
				$scope.message = "";   
			},
			function(errorPayload) {
				$log.error('failure loading movie', errorPayload);
			});

		}
	})
	
}