var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

// DB setup
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoUrl = "mongodb://localhost:27017/birdwatchr";
var db;
MongoClient.connect(mongoUrl, function(err, database){
  if (err) {
    console.log(err);
  }
  console.log("connected!");
  db = database;
  process.on('exit', db.close);
});


//geocoder
var geocoder = require('geocoder');

// Routes
app.get('/', function(req, res){
  db.collection('sightings').find({}).sort({"date": -1}).toArray(function(err, results) {
    console.log(results);
    res.render('index', {sightings: results});
  });
});

app.get('/sightings/new', function(req, res) {
  res.render('form');
});

app.post('/sightings', function(req, res) {
  // console.log(req.body.sighting);
  var newSighting = req.body.sighting;
  newSighting.date = new Date();

  geocoder.geocode(newSighting.location, function(err, data) {
    // console.log(data.results[0].address_components);
    // console.log(data.results[0].geometry.location);
    newSighting.lat = data.results[0].geometry.location.lat;
    newSighting.lng = data.results[0].geometry.location.lng;
    db.collection('sightings').insert(
      newSighting, function(err, result) {
        console.log(result);
        res.redirect('/api/sightings');
      }
    );
  });
});

app.get('/api/sightings', function(req, res) {
  db.collection('sightings').find({}).toArray(function(err, results) {
    res.json(results);
  });
});

app.listen(process.env.PORT || 3000);
