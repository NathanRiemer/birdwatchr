angular.module('SampleApp').controller('DogsController', DogsController)

DogsController.$inject = ['$http'];

function DogsController($http){
    var dogs = this;

    dogs.all = [];

    dogs.add = function(){
      console.log('clicked', dogs.new);
      var dog = {name: dogs.new};
      $http
        .post('/dogs', dog)
        .then(function(response){
          console.log(response.data);
          dogs.all.push(dog);
        })
      dogs.new = "";
    }

    dogs.fetch = function(){
      $http
        .get('/dogs')
        .then(function(response){
          dogs.all = response.data;
      })
    }

    dogs.fetch();
}
