;(function () {
  angular
  .module('DataHunter', ['ngRoute', 'ui.mask']);
  
  angular
	.module('DataHunter')
	.controller('MainCtrl', MainCtrl);
	function MainCtrl ($scope, $http, $location) {

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
		var updateCaptcha = function(){
			$scope.captchaImage = 'captcha/'+( +new Date() );	
		};

		$scope.acessToken = "";
		$scope.captchaImage = 'captcha/0';
		// $scope.showSearch = false;
		$scope.showSearch = false;
		$scope.showCaptcha = true;
		$scope.onChangeQuery = function (value) {

			console.log($scope.acessToken);
			var pattern = /^\d{3}.\d{3}.\d{3}-\d{2}$/i;
			$scope.displayHelp = false;
			$scope.searchQuery = value;   

			$scope.searchQuery = formatId(value)
			$scope.dataInfo = [];


			if( !pattern.test( $scope.searchQuery ) ) {

				$scope.displayHelp = true;
				$scope.message = "Numbers left.";
				return false;

			}else{

				$scope.showLoading = true;
				$http.get('/fetch?id='+$scope.searchQuery+'&token='+$scope.acessToken).success(function(data) {
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
					$scope.dataInfo    = data;
					$scope.displayHelp = false;
					$scope.message = "";
				});
			}
		};  

		$scope.onCaptchaKeyUp = function(key){
			$scope.captchaValue = key;
			$scope.showLoading  = true;						

		};

		$scope.onRequestAcess = function() {
			if( $scope.captchaValue.length > 5 && $scope.captchaValue.length < 7 ){
				// console.log('ajax call with %s  <= id', $scope.captchaValue);
				$http({
					url   : "/auth-session",
					method: "POST",
					data  : { "digits":$scope.captchaValue }
				}).success(function(data, status, headers, config) {

					if( data.error ){	
		
						updateCaptcha()	
						$scope.displayHelp = true;
						$scope.message     = data.error;

						return false;		
					}else{
						$scope.acessToken = data._token;


						$scope.showCaptcha = false;
						$scope.showSearch  = true;
						$scope.showLoading = false;						
						$scope.displayHelp = false;
						$scope.message     = "";
					}
				}).error(function(data, status, headers, config) {				
				});
				
			}
		};
  	}  	
})();
