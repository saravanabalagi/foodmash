$(document).ready(function(){

	$(".order-description i.fa-check-circle").popover({ content:'Delivered', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".order-description i.fa-times-circle").popover({ content:'Cancelled', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".order-description i.fa-clock-o").popover({ content:'Order Received', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".order-description i.fa-truck").popover({ content:'Picked Up', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".order-description i.fa-phone").popover({ content:'Order Placed', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".order-description i.fa-dropbox").popover({ content:'Being Packed', animation: true, container:'body', placement:'bottom', trigger: 'hover' });

});