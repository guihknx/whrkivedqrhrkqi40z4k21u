angular
    .module('DataHunter')
    .service('DataTransponder', DataTransponder);


function DataTransponder($http) {

    var queriedId = '';
    var promise = {};
    var service = {
        fetch:function(id){
	  		
	  		
            if( queriedId != id ){
                queriedId = id;
                promise = $http.get('cpf/' + id);
                return promise; 
            }else{
                return promise;
            }
	  	}
    };
    return service;

}
