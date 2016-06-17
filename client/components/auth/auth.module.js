'use strict';

angular.module('csappApp.auth', ['csappApp.constants', 'csappApp.util', 'ngCookies', 'ui.router'])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
