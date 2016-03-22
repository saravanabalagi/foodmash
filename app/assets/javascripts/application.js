// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require angular
//= require angular-route
//= require angular-cookies
//= require angularjs/rails/resource
//= require angularjs-toaster/toaster
//= require angular-sanitize/angular-sanitize
//= require lodash/lodash
//= require jquery/dist/jquery
//= require bootstrap
//= require ng-file-upload
//= require material
//= require ripples
//= require jquery.matchHeight
//= require jquery.touchSwipe
//= require wow
//= require_tree .

$(document).ready( function() {

    $.material.init();
    $('.rupee').html("&#8377; ");

    $(".location-dropdown .dropdown-menu li a").click(function(){
        $(this).parents(".dropdown").find('> a').html($(this).text() + ' <span class="caret"></span>');
    });

    $(".footer-push").height($("footer").height());;
    $("footer").css("margin-top","-"+$("footer").outerHeight()+"px");

    $(".back-to-top").hide();
    $(".back-to-top").click(function(){
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });

    // $("body").swipe({ swipeLeft: swipeBodyLeft, swipeRight: swipeBodyRight, allowPageScroll: "vertical" });
    // var scrollEnded = $.debounce(100, false, function () {
    //     if($(this).scrollTop() > 100)
    //         $(".back-to-top").animate({opacity:0}).fadeIn().animate({opacity:1},100);
    //     else $(".back-to-top").animate({opacity:0},200).delay(400).fadeOut();
    // });
    // $(window).scroll(scrollEnded);

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

    $(window).load( function() {

        if(!$('#choose-delivery-location-continue').length) { $(".loader").fadeOut("slow"); }

    });

});

function sidebarToggle() {
    var sidebar = $('.sidebar-wrapper');
    if(sidebar.hasClass('slider-open')) sidebar.addClass("slide-and-hide").removeClass("slider-open");
    else sidebar.addClass("slider-open").removeClass("slide-and-hide");
};

// function swipeBodyLeft() {
//     if(!$('body').hasClass('sidebar-body')
//         || ($(document).width()>435)) return;
//     else if(!$('.sidebar-wrapper').hasClass('slider-open')) return;
//     sidebarToggle();
// };

// function swipeBodyRight() {
//     if(!$('body').hasClass('sidebar-body')
//         || ($(document).width()>435)) return;
//     else if($('.sidebar-wrapper').hasClass('slider-open')) return;
//     sidebarToggle();
// };


