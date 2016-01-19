$(document).ready(function(){

	$(".table-restaurant-panel i.fa-check-circle, .order-description i.fa-check-circle").popover({ content:'Ready', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".table-restaurant-panel i.fa-times-circle, .order-description i.fa-times-circle").popover({ content:'Cancelled', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".table-restaurant-panel i.fa-clock-o, .order-description i.fa-clock-o").popover({ content:'Order Received', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".table-restaurant-panel i.fa-cutlery, .order-description i.fa-cutlery").popover({ content:'Being Cooked', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".table-restaurant-panel i.fa-truck, .order-description i.fa-truck").popover({ content:'Picked up', animation: true, container:'body', placement:'bottom', trigger: 'hover' });

});