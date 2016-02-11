'use strict';

angular.module('foodmashApp.services')

.service('CartService', ['$q','Cart','$rootScope', function($q, Cart, $rootScope){

	var service = this;
	service.cart = {};
	service.cart.orders = [];
	service.cart.total = 0;
		
	refurbishCartFromServer();

	this.setCartGlobally = function(){
		$rootScope.cart = service.cart;
	};

	this.addToCart = function(combo, selected_dishes){
		for(var i = 0;i<service.cart.orders.length;i++){
			if(service.cart.orders[i]["product"]["id"] == combo.id && checkWithIncomingOrder(service.cart.orders[i], selected_dishes)){
				service.cart.orders[i]["quantity"] += 1;
				updateCartInfo();
				return ;
			}
		}

			var future_order = {"added_at": Date.now(), "order_items": [], "product": {"id": combo.id, "price": combo.price, "description": combo.description, "name": combo.name, "available": combo.available, "active": combo.active}, "total": combo.price, "quantity": 1};
			for(var i=0;i<selected_dishes.length;i++){
				if(selected_dishes[i]["product"]["id"] == combo.id){
					var order_item = angular.copy(selected_dishes[i]);
					delete order_item["product"];
					future_order["order_items"].push(order_item);
				}
			}
			service.cart.orders.push(future_order);
			updateCartInfo();
			return ;
	};

	this.removeFromCart = function(combo){
		for(var i = service.cart.orders.length - 1; i>=0; i--){
			if(service.cart.orders[i]["product"]["id"] == combo.id){
				service.cart.orders[i]["quantity"] -= 1;
				if(service.cart.orders[i]["quantity"] == 0){
					service.cart.orders.splice(i, 1);
				}
				updateCartInfo();
				return ;
			}
		}
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

	this.setCartInfo = function(cart){
		if(cart){
			service.cart = cart;
			$rootScope.cart = service.cart;
		}
	};

	this.refreshCart = function(){
		refurbishCartFromServer();
		$rootScope.cart = service.cart;
	};

	function refurbishCartFromServer(){
		Cart.show().then(function(cart){
			service.cart = cart;
			$rootScope.cart = service.cart;
		}, function(err){
		});
	};

	function checkWithIncomingOrder(current_order, selected_dishes){
		 var current_order_items_length = current_order["order_items"].length;
		 var selected_dishes_length = selected_dishes.length;
		 var counting_length = 0;

		 if(current_order_items_length == selected_dishes_length){
			 for(var i=0;i<current_order_items_length;i++){
			 		for(var j=0;j<selected_dishes_length;j++){
			 			if(current_order["order_items"][i]["item"]["id"] == selected_dishes[j]["item"]["id"] && selected_dishes[j].category_id == current_order["order_items"][i].category_id && selected_dishes[j].category_type == current_order["order_items"][i].category_type && selected_dishes[j]["product"]["id"] == current_order["product"]["id"] && current_order["order_items"][i].quantity == selected_dishes[j].quantity){
			 				counting_length += 1;
			 				break;
			 			}
			 		}
			 }
			 if(counting_length == selected_dishes_length){
			 	return true;
			 }else{
			 	return false;
			 }
		 }else{
		 	return false;
		 }
	};

	function updateCartInfo(){
		var total = 0;

		service.cart.orders.filter(function(order){ 
			order.total = 0;
			order.order_items.filter(function(oi){
				order.total += oi.item.price * oi.quantity;
			});
			total += order.total * order.quantity;
		});
		
		service.cart.total = total;
		$rootScope.cart = service.cart;
	};

}]);