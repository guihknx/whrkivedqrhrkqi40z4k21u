angular
    .module('DataHunter')
    .service('DataTransponder', DataTransponder);


function DataTransponder($http) {

    var queriedId = '';
    var qPlate = '';
    var promise = {};
    var service = {
        fetch:function(id){
	  		
	  		
            if( queriedId != id ){
                queriedId = id;
                promise = $http.get('data/cpf/' + id);
                return promise; 
            }else{
                return promise;
            }
	  	},
        fetchPlate:function(plate){
            
            
            if( qPlate != plate ){
                qPlate = plate;
                promise = $http.get('data/plate/' + plate);
                return promise; 
            }else{
                return promise;
            }
        }        
    };
    return service;

}
