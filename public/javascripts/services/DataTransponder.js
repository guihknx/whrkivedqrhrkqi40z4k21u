angular
    .module('DataHunter')
    .service('DataTransponder', DataTransponder);


function DataTransponder($http) {

    var queriedId = '';
    var qPlate = '';
    var promise = {};
    var service = {
        fetch:function(id, captcha){
	  		
	  		
            if( queriedId != id ){
                queriedId = id;
                promise = $http.post('data/cpf/', {id: id, captcha: captcha});
                return promise; 
            }else{
                return promise;
            }
	  	},
        fetchPlate:function(plate){
            
            
            if( qPlate != plate ){
                qPlate = plate;
                promise = $http.post('data/plate/' + plate);
                return promise; 
            }else{
                return promise;
            }
        }        
    };
    return service;

}
