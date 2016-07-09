'use strict';

angular.module('csappApp')
  .config(function($stateProvider) {
    $stateProvider.state('room', {
      url: '/room',
      template: '<room></room>'
    });
  });
