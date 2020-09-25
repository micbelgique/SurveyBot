
(function ($) {
  'use strict';


jQuery(document).ready(function($) {

  //scroll and active class adding
  var stellarnav = $('.stellarnav');
  
  stellarnav.stellarNav({
    theme: 'light',
    breakpoint: 960,
    position: 'right',

  });

    //animimate active
    new WOW().init();

    //CURRENT CLASS SELECTOR
    var navbarAddCalss = $('.navclass');
    navbarAddCalss.onePageNav();

    //active header sticky
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
      var header__ = document.getElementById("header");
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        header__.classList.remove("sticky");
      } else {
        header__.classList.add("sticky");
      }
      prevScrollpos = currentScrollPos;
    }


    var scrollers   = $('#scroll a[href*="#"], a.arrow');
    var bodyAnimate = $('html, body');

    scrollers.on('click', function(e) {
      e.preventDefault()

      bodyAnimate.animate(
        {
          scrollTop: $($(this).attr('href')).offset().top,
        },
        1000,
        'linear'
      )
    })


     //fixed nav bar active
    function fixed_nav() {
        window.onscroll = function () {
          myFunction()
        }

        var header = document.getElementById("header");
        var sticky = header.offsetTop;

        function myFunction() {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        }
    };
    fixed_nav();


    var counter = $('.counter');

    counter.counterUp({
      delay: 10,
      time: 1000
    });



 });




   //jquery load function start
  jQuery(window).on("load", function() {
      //Hide Loading Box (Preloader)
      
      function handlePreloader() {
          var preloader = $('.preloader');
          if(preloader.length){
          preloader.delay(200).fadeOut(500);
          }
      }
      handlePreloader();
      
  });


}(jQuery));


