$(document).ready(function(){

	$(".table-order-history i.fa-check-circle, .order-description i.fa-check-circle").popover({ content:'Delivered', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".table-order-history i.fa-times-circle, .order-description i.fa-times-circle").popover({ content:'Cancelled', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".table-order-history i.fa-clock-o, .order-description i.fa-clock-o").popover({ content:'Processing', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".table-order-history i.fa-truck, .order-description i.fa-truck").popover({ content:'In transit', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
	$(".table-order-history i.fa-dropbox, .order-description i.fa-dropbox").popover({ content:'Being Packed', animation: true, container:'body', placement:'bottom', trigger: 'hover' });

});