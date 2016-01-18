var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/semantic/dist'));
app.set('view engine', 'ejs')

// db
var db;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/birdwatcher';
MongoClient.connect(mongoUrl, function(err, database) {
  if (err) { throw err; }
  db = database;
  process.on('exit', db.close);
});

//geocoder
var geocoder = require('geocoder');

// Routes

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/api/sightings', function(req, res){
  console.log(req.query);
  var limit = 0;
  if (req.query.q === 'recent') {
    limit = 3;
  }
  db.collection('sightings').find({}).sort({"date": -1}).limit(limit).toArray(function(err, results) {
    console.log(results);
    res.json(results);
  });
});

// app.get('/sightings/new', function(req, res) {
//   res.render('form');
// });

app.post('/sightings', function(req, res) {
  console.log(req.body);
  var newSighting = req.body;
  newSighting.date = new Date();

  geocoder.geocode(newSighting.location, function(err, data) {
    newSighting.lat = data.results[0].geometry.location.lat;
    newSighting.lng = data.results[0].geometry.location.lng;
    newSighting.mapLink = 'http://maps.google.com/maps?q='+newSighting.lat+','+newSighting.lng+'+(My+Point)&z=15&ll='+newSighting.lat+','+newSighting.lng;

    db.collection('sightings').insert(
      newSighting, function(err, result) {
        console.log(result);
        res.json(newSighting);
      }
    );
  });
});

// app.get('/api/sightings', function(req, res) {
//   db.collection('sightings').find({}).toArray(function(err, results) {
//     res.json(results);
//   });
// });

app.get('/api/sightings/:id', function(req, res) {
  db.collection('sightings').findOne({_id: ObjectId(req.params.id)}, function(err, result) {
    res.json(result);
  });
});

app.get('/api/location', function(req, res) {
  var loc = req.query.loc;
  var result = {};
  geocoder.geocode(loc, function(err, data) {
    // console.log(data.results[0].address_components);
    // console.log(data.results[0].geometry.location);
    result.lat = data.results[0].geometry.location.lat;
    result.lng = data.results[0].geometry.location.lng;
    res.json(result);
  });
});

app.get('/demo', function(req, res) {
  res.render('demo');
});

app.put('/sightings/:id', function(req, res) {
  var updatedSighting = req.body.sighting;

  geocoder.geocode(updatedSighting.location, function(err, data) {
    updatedSighting.lat = data.results[0].geometry.location.lat;
    updatedSighting.lng = data.results[0].geometry.location.lng;
    console.log(updatedSighting);
    db.collection('sightings').update(
      {_id: ObjectId(updatedSighting._id)}, {$set: {bird: updatedSighting.bird, location: updatedSighting.location, lat: updatedSighting.lat, lng: updatedSighting.lng}}, function(err, result) {

        db.collection('sightings').findOne({_id: ObjectId(updatedSighting._id)}, function(err, searchResult) {
          res.json(searchResult);
        });
      }
    );
  });
});

app.listen(process.env.PORT || 3000);
