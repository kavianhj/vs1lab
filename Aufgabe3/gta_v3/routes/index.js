// File origin: VS1LAB A3

const express = require('express');
const router = express.Router();

const GeoTag = require('../models/geotag');
const GeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

const store = new GeoTagStore();
GeoTagExamples.populate(store);

/**
 * Route '/' for HTTP 'GET' requests.
 * Übergibt die Standard-Koordinaten beim ersten Laden der Seite.
 */
router.get('/', (req, res) => {
  res.render('index', { 
    taglist: store.getAllGeoTags(),
    latitude: '49.01379',
    longitude: '8.390071'
  });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * Speichert das Tag und schickt die genutzten Koordinaten wieder zurück.
 */
router.post('/tagging', (req, res) => {
  const { latitude, longitude, name, hashtag } = req.body;
  const newTag = new GeoTag(latitude, longitude, name, hashtag);
  store.addGeoTag(newTag);
  
  res.render('index', { 
    taglist: store.getAllGeoTags(),
    latitude: latitude,
    longitude: longitude
  });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * Sucht nach Tags und schickt die aktuellen Koordinaten wieder zurück.
 */
router.post('/discovery', (req, res) => {
  const { latitude, longitude, Search } = req.body;
  const searchResults = store.search(Search);
  
  res.render('index', { 
    taglist: searchResults,
    latitude: latitude,
    longitude: longitude
  });
});

module.exports = router;