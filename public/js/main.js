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
    $('button.show-edit-form').click(displayEditForm);
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

var displayEditForm = function(event) {
  event.preventDefault();
  var birdID = $(event.target).parent().data('birdid');
  console.log($(event.target).parent().data('birdid'));
  $.ajax({
    url: '/api/sightings/'+ birdID,
    type: 'GET',
    dataType: 'json'
  }).done(function(result) {
    var source = $('#edit-sighting-template').html();
    var template = Handlebars.compile(source);
    var html = template(result);
    $(event.target).parent().replaceWith(html);
    // console.log($(html).find('.update'));
    $(".update[data-birdid='"+birdID+"']").click(submitUpdate);
  });
};

var submitUpdate = function(event) {
  event.preventDefault();
  var sighting = {
    bird: $(event.target).parent().find("input[name='bird']").val(),
    location: $(event.target).parent().find("input[name='location']").val(),
    _id: $(event.target).data('birdid')
  };
  $.ajax({
    url: '/sightings/'+sighting.bird_id,
    type: 'PUT',
    dataType: 'json',
    data: {sighting: sighting}
  }).done(function(sighting) {
    var source = $('#sighting-template').html();
    var template = Handlebars.compile(source);
    var html = template(sighting);
    $(event.target).parent().replaceWith(html);
  });
};

$(document).ready(function() {
  $('#show-sightings').click(getSightings);
  $('#submit-location').click(getLatandLong);
});