//JavaScript. Hier steckt der ausführbarer Programmcode und die Logik

// Eine feste Variable erstellen (const), die nicht überschrieben werden kann
// Ich lade komplette, fertige Express-Webserver-Werkzeug aus meinem node_modules-Ordner
// und speichere es sicher in einer unveränderbaren Variablen ab, damit ich direkt danach
// meinen eigenen Server damit bauen kann.
const express = require('express');
// Ich erzeuge mit einen Router aus meienn frisch geladenen Expresswerkzeug-Kiste.
// Seine Aufgabe wird sein, die eingehenden Links meiner Webseite wie api/geotags oder 
// /discovery sortieren und korrekt weiterleiten 
const router = express.Router();

// Ich lade meine meine selbstgeschriebenen Dateien und speichere die in die feste Variablen ein.
const GeoTag = require('../models/geotag');
const GeoTagStore = require('../models/geotag-store');

// Ein Lager erzeugen füt die Orte und in store abspeichern
const store = new GeoTagStore();

// Nutzer fragt nach der Startseite ('/') und router.get('/') fängt ab. req: Was die Anfrage des Nutzer & res: Was ist deine Antwort
// Der Code in den geschleiften Klammern wird ausgeführt.
router.get('/', (req, res) => {
  // Durch render nimmt der Servern den dynamischen Bauplan (index.ejs),
  // wir geben ejs eine ein Gepäck mit leere Liste für die Orte und leere Texte füt die Koordinaten 
  res.render('index', { taglist: [], latitude: '', longitude: '' });
});

// Hat der Nutzer diesen URL eingegeben dann führen wa mal aus
router.get('/api/geotags', (req, res) => {
  // Das was in URL war aus reg.query holen und in const speichern
  const { latitude, longitude, keyword } = req.query;

  // URL Strings in echte Kommazahlen umwandeln
  const coords = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  };

  // Änderbare Variable
  let results;
  // Existiert ein Suchwort und kein Leerzeichen?
  if (keyword && keyword.trim() !== '') {
    // Wenn ja dann suchen wir im Store (Unserer Lager) nach Orten im Umkreis 0.2 die den gleichen Suchwort haben.
    results = store.searchNearbyGeoTags(coords, 0.2, keyword);
  } else {
    // Wenn nein hol alle Orte im Umkreis 0.2 von meineem Stadtort
    results = store.getNearbyGeoTags(coords, 0.2);
  }
  // Antwort in Json übersetzen
  res.json(results);
});


router.post('/api/geotags', (req, res) => {
  // Holen die eingetippte Daten aus der req=body;
  const { name, latitude, longitude, hashtag } = req.body;

  // new GeoTag aufrufen und einen neuen Ort erschaffen
  const newTag = new GeoTag(latitude, longitude, name, hashtag);
  store.addGeoTag(newTag);

  // Wir haben erfolgreich etwas NEUES erschaffen!
  res.status(201)
    .header('Location', `/api/geotags/${newTag.id || ''}`) // Neue URL mit dem ID Verraten
    .json(newTag); // Den neuen Ort an JSON schicken
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