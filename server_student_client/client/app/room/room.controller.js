'use strict';

(function() {

  class RoomController {

    constructor($http, $scope, socket) {
      this.$http = $http;
      this.socket = socket;
      this.rooms = [];
      alert('ADD THING');
      //$scope.$on('$destroy', function() {
      //  socket.unsyncUpdates('thing');
      //});
    }

    joinRoom() {

    }

    addThing() {
      e.preventDefault()
      console.log('CLICKED')
      alert('ADD THING')
    }

    /*$onInit() {
      this.$http.get('/api/things')
        .then(response => {
          this.awesomeThings = response.data;
          this.socket.syncUpdates('thing', this.awesomeThings);
        });
    }*/

    /*addRoom() {
      if (this.newRoom) {
        this.$http.post('/api/rooms', {
          name: this.newRoom
        });
        this.newRoom = '';
      }
    }*/

  }

  angular.module('csappApp')
    .component('room', {
      templateUrl: 'app/room/room.html',
      controller: RoomController
    });
})();
