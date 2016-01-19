$(document).ready( function() {
	
	$.material.init();
	new WOW().init();
	$('[data-toggle="tooltip"]').tooltip();
	$('[data-toggle="popover"]').popover();

	$('.rupee').html("&#8377; ");
    $('.combo-card').matchHeight();
    $('.thumbnail img').matchHeight();

    $('body').swipe( {
	    //Generic swipe handler for all directions
	    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
	      $('.sidebar-wrapper').toggleClass("slide-and-hide"); 
	    }
  	});

  	$(".location-dropdown .dropdown-menu li a").click(function(){
  	  $(this).parents(".dropdown").find('> a').html($(this).text() + ' <span class="caret"></span>');
  	});


});

$(window).load( function() {

    if(!$('#choose-delivery-location-continue').length) { $(".loader").fadeOut("slow"); }

});

$(window).resize( function(event) {

	$.fn.matchHeight._update();

});