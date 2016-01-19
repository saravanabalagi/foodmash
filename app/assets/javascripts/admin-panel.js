$(document).ready(function(){

	$(".table-panel i.fa-check-circle, \
		.table-panel i.fa-times-circle").click(function(){
		$(this).toggleClass('fa-check-circle fa-times-circle');
	});

});