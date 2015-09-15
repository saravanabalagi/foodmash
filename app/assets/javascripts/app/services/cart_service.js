'use strict';

angular.module('foodmashApp.services')

.service('CartService', ['$q', function($q){

	var service = this;
	service.cart = {};
	service.cart.orders = [];
	service.cart.total = 0;

	this.addToCart = function(combo, selected_dishes){
		console.log(selected_dishes);
		for(var i = 0;i<service.cart.orders.length;i++){
			if(service.cart.orders[i]["combo_id"] == combo.id){
				if(checkWithIncomingOrder(service.cart.orders[i], selected_dishes)){
					console.log("matched with prev order!");
					service.cart.orders[i]["quantity"] += 1;
					for(var o=0;o<service.cart.orders[i]["order_items"].length;o++){
						service.cart.orders[i]["order_items"][o]["quantity"] += 1;
					}
				}
				updateCartInfo();
				return ;
			}
		}

			var future_order = {"added_at": Date.now(), "order_items": [], "price": combo.price, "description": combo.description, "name": combo.name, "total": combo.price, "quantity": 1, "combo_id": combo.id};
			for(var i=0;i<selected_dishes.length;i++){
				if(selected_dishes[i]["combo_id"] == combo.id){
					future_order["order_items"].push(selected_dishes[i]);
				}
			}
			service.cart.orders.push(future_order);
			updateCartInfo();
			return ;
	};

	this.getCartInfo = function(){
		var d = $q.defer();
		if(service.cart.orders){
			d.resolve(service.cart);
		}else{
			d.reject(service.cart);
		}
		return d.promise;
	};

	function checkWithIncomingOrder(current_order, selected_dishes){
		 var current_order_items_length = current_order["order_items"].length;
		 var counting_length = 0;
		 for(var i=0;i<current_order["order_items"].length;i++){
		 		for(var j=0;j<selected_dishes.length;j++){
		 			if(current_order["order_items"][i]["dish_id"] == selected_dishes[j]["dish_id"] && (selected_dishes[j]["combo_option_id"] == current_order["order_items"][i]["combo_option_id"] || selected_dishes[j]["combo_dish_id"] == current_order["order_items"][i]["combo_dish_id"]) && selected_dishes[j]["combo_id"] == current_order["order_items"][i]["combo_id"]){
		 				counting_length += 1;
		 				break;
		 			}
		 		}
		 }
		 if(counting_length == current_order_items_length && current_order_items_length != 0){
		 	return true;
		 }else{
		 	return false;
		 }
	};

	function updateCartInfo(){
		var total = 0;
		service.cart.orders.filter(function(order){ 
			var currTotal = order.price * order.quantity;
			total += currTotal;
			order.total = currTotal;
		});
		service.cart.total = total;
	};

}]);