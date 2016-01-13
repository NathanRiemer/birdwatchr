// console.log("         _     ")
// console.log("        <')_,/ ")
// console.log("        (_==/  ")
// console.log("birder  ='-    ")
// console.log("we're hiring!  ")


var getSightings = function(event) {
  event.preventDefault();
  $.ajax({
    url: '/api/sightings',
    type: 'GET',
    dataType: 'json'
  }).done(function(sightings) {
    sightings.forEach(function(sighting) {
      var source = $('#sighting-template').html();
      var template = Handlebars.compile(source);
      var html = template(sighting);
      $('.sightings-list').append(html);
    });
  });
};

var getLatandLong = function(event) {
  var loc = $('input#location').val();
  $.ajax({
    url: '/api/location?loc='+ loc,
    type: 'GET',
    dataType: 'json'
  }).done(function(results) {
    $('#lat span').text(results.lat);
    $('#lng span').text(results.lng);
  });
};

$(document).ready(function() {
  $('#show-sightings').click(getSightings);
  $('#submit-location').click(getLatandLong);
});