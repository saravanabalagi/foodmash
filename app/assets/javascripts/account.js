$(document).ready(function() {

	$(".add-new-address-wrapper").click(function(){
		$(".new-address-wrapper").fadeIn(800);
	});

	$(".new-address-wrapper input").on('change keyup',function() {
		if ($(this).val().length>0) $(this).css('border-bottom','1px solid transparent');
		else $(this).css('border-bottom','1px solid rgba(0,0,0,0.1)');
	});

});