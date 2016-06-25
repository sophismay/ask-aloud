/**
 * Created by masaud on 1/22/14.
 */

jQuery(function(){
   // start by aligning absolute banner-content
   //alert('sdf');
   var windowWidth = $(window).width();
   var divWidth = $('.bann-content').width();
   $('.bann-content').css({'left': (windowWidth-divWidth)/2 });

   // function to align absolute banner-content
   $(window).resize(function(){

       $('.bann-content').css({
           'left': (windowWidth-divWidth)/2
       });
   });

   var app = angular.module('HelpingHandsApp', []);
   app.config('$routeProvider', function($routeProvider){
      $routeProvider
          .when('/index',{
              template: 'partials/index.html'
          })
          .otherwise({
              redirectTo: '/index'
          })
   });

    $('#events-container').masonry({
        columnWidth: 200,
        itemSelector: '.event',
        isFitWidth: true
    });

});