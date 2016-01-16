angular.module('BirdWatchrApp').controller('SightingsController', SightingsController)

SightingsController.$inject = ['$http'];

function SightingsController($http){
  var sightings = this;

  sightings.all = [];

  sightings.newSighting = {};

  sightings.add = function(){
    console.log(sightings.newSighting)
    $http
      .post('/sightings', sightings.newSighting)
      .then(function(response){
        console.log(response.data);
        sightings.all.push(response.data);
      });
    sightings.newSighting = {};
  };

  sightings.fetch = function(){
    $http
      .get('/api/sightings?q=recent')
      .then(function(response){
        sightings.all = response.data;
    });
  };

  sightings.since = function(date) {
    return moment(date).fromNow();
  };

  sightings.fetch();
}
