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

  	// JS for account begins
  	$(".add-new-address-wrapper").click(function(){
  		$(".new-address-wrapper").fadeIn(800);
  	});

  	$(".new-address-wrapper input").on('change keyup',function() {
  		if ($(this).val().length>0) $(this).css('border-bottom','1px solid transparent');
  		else $(this).css('border-bottom','1px solid rgba(0,0,0,0.1)');
  	});
  	// JS for account ends

  	// JS for admin-panel begins
  	$(".table-panel i.fa-check-circle, \
  		.table-panel i.fa-times-circle").click(function(){
  		$(this).toggleClass('fa-check-circle fa-times-circle');
  	});
  	// JS for admin-panel ends

  	// JS for cart begins
  	$(".add-new-address-wrapper").click(function(){
  		$(".new-address-wrapper").fadeIn(800);
  	});
  	$(".new-address-wrapper input").on('change keyup',function() {
  		if ($(this).val().length>0) $(this).css('border-bottom','1px solid transparent');
  		else $(this).css('border-bottom','1px solid rgba(0,0,0,0.1)');
  	});
  	// JS for cart ends

  	// JS for order-history begins
  	$(".table-order-history i.fa-check-circle, .order-description i.fa-check-circle").popover({ content:'Delivered', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".table-order-history i.fa-times-circle, .order-description i.fa-times-circle").popover({ content:'Cancelled', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".table-order-history i.fa-clock-o, .order-description i.fa-clock-o").popover({ content:'Processing', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".table-order-history i.fa-truck, .order-description i.fa-truck").popover({ content:'In transit', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".table-order-history i.fa-dropbox, .order-description i.fa-dropbox").popover({ content:'Being Packed', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	// JS for order-history ends

  	// JS for packaging-panel begins
  	$(".order-description i.fa-check-circle").popover({ content:'Delivered', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".order-description i.fa-times-circle").popover({ content:'Cancelled', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".order-description i.fa-clock-o").popover({ content:'Order Received', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".order-description i.fa-truck").popover({ content:'Picked Up', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".order-description i.fa-phone").popover({ content:'Order Placed', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".order-description i.fa-dropbox").popover({ content:'Being Packed', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	// JS for packaging-panel ends 

  	// JS for restaurant-panel begins
  	$(".table-restaurant-panel i.fa-check-circle, .order-description i.fa-check-circle").popover({ content:'Ready', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".table-restaurant-panel i.fa-times-circle, .order-description i.fa-times-circle").popover({ content:'Cancelled', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".table-restaurant-panel i.fa-clock-o, .order-description i.fa-clock-o").popover({ content:'Order Received', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".table-restaurant-panel i.fa-cutlery, .order-description i.fa-cutlery").popover({ content:'Being Cooked', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	$(".table-restaurant-panel i.fa-truck, .order-description i.fa-truck").popover({ content:'Picked up', animation: true, container:'body', placement:'bottom', trigger: 'hover' });
  	// JS for restaurant-panel ends

  	// JS for combo-description
  	$(".btn-select-combo-option").on("click", function() {
  		$(this).fadeOut(500);
  		$(this).siblings('.quantity-counter').fadeIn(1000);
  		$(this).parents('.combo-option').addClass('selected');
  	});
  	// JS for combo-description

});

$(window).load( function() {

    if(!$('#choose-delivery-location-continue').length) { $(".loader").fadeOut("slow"); }

});

$(window).resize( function(event) {

	$.fn.matchHeight._update();

});