
const express = require('express');
const router = express.Router();

const GeoTag = require('../models/geotag');
const GeoTagStore = require('../models/geotag-store');

const store = new GeoTagStore();

router.get('/', (req, res) => {
  res.render('index', { taglist: [], latitude: '', longitude: '' });
});


router.get('/api/geotags', (req, res) => {

  const { latitude, longitude, keyword } = req.query;

  const coords = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  };

  let results;

  if (keyword && keyword.trim() !== '') {
    results = store.searchNearbyGeoTags(coords, 0.2, keyword);
  } else {
    results = store.getNearbyGeoTags(coords, 0.2);
  }

  res.json(results);
});


router.post('/api/geotags', (req, res) => {
  const { name, latitude, longitude, hashtag } = req.body;

  const newTag = new GeoTag(latitude, longitude, name, hashtag);
  store.addGeoTag(newTag);

  res.status(201)
    .header('Location', `/api/geotags/${newTag.id || ''}`)
    .json(newTag);
});


router.get('/api/geotags/:id', (req, res) => {
  const tagId = req.params.id; // Holt die ID aus der URL (z.B. "3")

  const foundTag = store.getGeoTagById(tagId); // Wir jagen die ID durch unser neues Suchgerät im Store:

  if (foundTag) {
    // Gefunden! Wir schicken das fertige Objekt als JSON zurück
    res.json(foundTag);
  } else {
    // Nicht gefunden? Wir senden den HTTP-Status 404 (Not Found) zurück
    res.status(404).json({ error: `GeoTag mit ID ${tagId} wurde nicht gefunden.` });
  }
});


router.put('/api/geotags/:id', (req, res) => {
  const tagId = req.params.id; // Holt die ID aus der URL
  const { name, latitude, longitude, hashtag } = req.body; // Holt die neuen Daten aus dem Formular

  // Wir schicken die ID und die neuen Werte in den Store zum Aktualisieren:
  const updatedTag = store.updateGeoTagById(tagId, name, latitude, longitude, hashtag);

  if (updatedTag) {
    // Erfolgreich aktualisiert! Wir schicken das geänderte Objekt als JSON zurück
    res.json(updatedTag);
  } else {
    // ID gab es nicht? Dann wieder der klassische 404 Fehler
    res.status(404).json({ error: `GeoTag mit ID ${tagId} existiert nicht.` });
  }
});

router.delete('/api/geotags/:id', (req, res) => {
  const tagId = req.params.id;

  const foundTag = store.getGeoTagById(tagId);

  if (foundTag) {
    store.removeGeoTagById(tagId);

    res.json({ message: `GeoTag mit ID ${tagId} erfolgreich gelöscht.`, deletedTag: foundTag });
  } else {
    res.status(404).json({ error: `GeoTag mit ID ${tagId} existiert nicht.` });
  }
});

module.exports = router;