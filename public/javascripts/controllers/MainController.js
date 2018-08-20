angular
.module('DataHunter')
.controller('MainCtrl', MainCtrl);

function MainCtrl ($scope, $http, $location, DataTransponder) {

	function formatId(stdIn){
;
		if( stdIn ){
			stdIn = stdIn.replace( /\D/g , ""); 
			stdIn = stdIn.replace( /(\d{3})(\d)/ , "$1.$2");
			stdIn = stdIn.replace( /(\d{3})(\d)/ , "$1.$2"); 
			stdIn = stdIn.replace( /(\d{3})(\d{1,2})$/ , "$1-$2");
		}
		return stdIn;
	};

	function k(value){
grecaptcha.execute();
		var onSubmitF = function(e){
			console.log(e);
		   $scope.cap = e;
		   k(value)
		};

		window.onSubmitF = onSubmitF;


		console.log('USER', $scope.cap)
		if( value == undefined ) return;
		if( !$scope.cap ) return;

		console.log('shoudl continue...', $scope.cap,  $scope.searchQuery)

		
			var pattern = /^\d{3}.\d{3}.\d{3}-\d{2}$/i;
		$scope.searchQuery = value;   
		$scope.displayHelp = false;

		$scope.searchQuery = formatId($scope.searchField)
		$scope.dataInfo = [];
		$scope.timex = new Date();

		if( !pattern.test( $scope.searchQuery ) ) {

			$scope.displayHelp = true;
			$scope.message = "Invalid input. Try again.";
			return false;

		}else{
			
			$scope.showLoading = true;
			DataTransponder.fetch($scope.searchQuery, $scope.cap).then(function(data) { 
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
				
				$scope.elapsed =  new Date() - $scope.timex;
			},
			function(errorPayload) {
				$log.error('failure loading', errorPayload);
			});

		}		
	}
	$scope.$watchGroup(['searchField', 'cap'],k)
	
	$scope.$watch('plateField', function(value){
		$scope.timex = new Date();

		if( value == undefined ) return;
			grecaptcha.execute();
			$scope.showLoading = true;
			DataTransponder.fetchPlate($scope.plateField).then(function(data) { 
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
				
				$scope.elapsed =  new Date() - $scope.timex;
			},
			function(errorPayload) {
				$log.error('failure loading', errorPayload);
			});
	})	
}