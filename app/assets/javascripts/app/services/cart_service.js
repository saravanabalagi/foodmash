'use strict';

angular.module('foodmashApp.services')

.service('CartService', ['$q', function($q){

	var service = this;
	service.orders = null;

	this.addToCart = function(combo, selected_dishes){
		var d = $q.defer();
		if(service.orders){
			for(var i = 0;i<service.orders.length;i++){
				if(service.orders[i]["combo_id"] == combo.id){
					if(checkWithIncomingOrder(combo, service.orders[i], selected_dishes)){

					}else{

					}
				}else{
					var future_order = {"added_at": Date.now(), "order_items": [], "price": combo.price, "description": combo.description, "name": combo.name, "total": combo.price, "quantity": 1, "combo_id": combo.id};
					for(var i=0;i<selected_dishes.length;i++){
						if(selected_dishes[i]["combo_id"] == combo.id){
							future_order["order_items"].push(selected_dishes[i]);
						}
					}
					service.orders.push(future_order);
				}
			}
			d.resolve(null);
	  }else{
	  	service.orders = [];
	  	service.orders.push({"added_at": Date.now(), "order_items": new_dishes, "price": combo.price, "description": combo.description, "name": combo.name, "total": combo.price, "quantity": 1, "combo_id": combo.id});
	  	console.log(service.orders);
	  	d.resolve(null);
	 	}
	 	return d.promise;
	};

	function checkWithIncomingOrder(combo, current_order, selected_dishes){
		
	};

}]);