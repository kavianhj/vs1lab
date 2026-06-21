
console.log("The geoTagging script is going to start...");

var GEOLOCATION_API = {
    getCurrentPosition: function (onsuccess) {
        onsuccess({
            "coords": {
                "latitude": 49.013790,
                "longitude": 8.390071,
                "altitude": null,
                "accuracy": 39,
                "altitudeAccuracy": null,
                "heading": null,
                "speed": null
            },
            "timestamp": 1775140116396
        });
    }
};

GEOLOCATION_API = navigator.geolocation;

const mapManager = new MapManager();

// Neue Funktion: Aktualisiert die UI (Liste und Karte)
function updateDiscoveryWidget(tags) {
    // 1. Die HTML-Liste neu bauen
    const resultList = document.getElementById('discoveryResults');
    if (resultList) {
        resultList.innerHTML = ''; // Alte Liste komplett ausradieren
        
        // Für jeden gefundenen Ort aus dem Array einen neuen Listen-Eintrag (<li>) basteln
        tags.forEach(tag => {
            const li = document.createElement('li');
            li.textContent = `${tag.name} ( ${tag.latitude},${tag.longitude}) ${tag.hashtag}`;
            resultList.appendChild(li);
        });
    }

    // 2. Die Karte neu zeichnen
    // Wir holen uns die aktuellen Koordinaten aus den unveränderbaren Feldern links
    const currentLat = parseFloat(document.getElementById('lat').value);
    const currentLon = parseFloat(document.getElementById('lon').value);
    
    // MapManager aufrufen (löscht alte rote Marker und setzt die neuen!)
    mapManager.updateMarkers(currentLat, currentLon, tags);
}

function updateLocation() {

    const tagLatField = document.getElementById('lat');
    const tagLonField = document.getElementById('lon');
    if (tagLatField.value && tagLonField.value) {

        const latitude = parseFloat(tagLatField.value);
        const longitude = parseFloat(tagLonField.value);

        mapManager.initMap(latitude, longitude);

        const mapDiv = document.getElementById('map');
        const tags = JSON.parse(mapDiv.dataset.tags);
        mapManager.updateMarkers(latitude, longitude, tags);

    } else {

        LocationHelper.findLocation((helper) => {

            if (tagLatField) tagLatField.value = helper.latitude;
            if (tagLonField) tagLonField.value = helper.longitude;


            const discoveryForm = document.getElementById('discoveryFilterForm');

            if (discoveryForm) {
                const disLatField = discoveryForm.querySelector('input[name="latitude"]');
                const disLonField = discoveryForm.querySelector('input[name="longitude"]');

                if (disLatField) disLatField.value = helper.latitude;
                if (disLonField) disLonField.value = helper.longitude;
            }

            // 3. Platzhalter löschen (Bild und Beschriftung)
            const placeholderImg = document.getElementById('mapView');
            if (placeholderImg) placeholderImg.remove();

            const placeholderText = document.querySelector('#map span');
            if (placeholderText) placeholderText.remove();


            mapManager.initMap(helper.latitude, helper.longitude);
            const mapDiv = document.getElementById('map');
            const tags = JSON.parse(mapDiv.dataset.tags);
            mapManager.updateMarkers(helper.latitude, helper.longitude, tags);


        });
    }
}

document.addEventListener("DOMContentLoaded", () => {

    updateLocation();

    const taggingForm = document.getElementById('tag-form');
    if (taggingForm) {
        taggingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Tagging-Formular abgefangen! Wir schicken die Daten jetzt heimlich ab...");

            const name = document.getElementById('name').value;
            const latitude = document.getElementById('lat').value;
            const longitude = document.getElementById('lon').value;
            const hashtag = document.getElementById('hash').value; 

            // B. Die Daten in ein JavaScript-Objekt packen:
            const newTagData = { name, latitude, longitude, hashtag };

            // C. Der asynchrone POST-Funkspruch an den Server:
            fetch('/api/geotags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Dem Server sagen: "Achtung, es kommt JSON!"
                },
                body: JSON.stringify(newTagData) // Das Objekt in Text verwandeln
            })
            // ... (dein POST-Fetch)
            .then(response => response.json()) 
            .then(data => {
                console.log('Erfolgreich gespeichert, dadash!', data);
                document.getElementById('name').value = '';
                document.getElementById('hash').value = '';

                // PROFI-TRICK: Nach dem Eintragen feuern wir automatisch eine 
                // neue Suche ab, damit die Karte und Liste sich live updaten!
                document.getElementById('discoveryFilterForm').dispatchEvent(new Event('submit'));
            })
            .catch(error => console.error('Fehler beim Speichern:', error));

        });
    }

    const discoveryForm = document.getElementById('discoveryFilterForm');
    if (discoveryForm) {
        discoveryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Discovery-Formular abgefangen! Der 404-Fehler ist Geschichte.");


            const latitude = discoveryForm.querySelector('input[name="latitude"]').value;
            const longitude = discoveryForm.querySelector('input[name="longitude"]').value;
            const keyword = document.getElementById('sea').value;

            // B. Die URL-Parameter zusammenbauen (das ?latitude=...&keyword=... Zeug)
            const queryParams = new URLSearchParams({
                latitude: latitude,
                longitude: longitude,
                keyword: keyword
            });

            // C. Der asynchrone GET-Funkspruch an den Server:
            fetch(`/api/geotags?${queryParams.toString()}`, {
                method: 'GET' 
                // Bei GET brauchen wir keinen 'body' und keine 'headers', 
                // weil die Suchbegriffe schon direkt oben im Link stehen!
            })
            .then(response => response.json()) 
            .then(data => {
                // Die gefundenen Orte in der Konsole anzeigen:
                console.log('Suchergebnisse erhalten, dadash!', data);
                
                updateDiscoveryWidget(data);
            })
            .catch(error => console.error('Fehler bei der Suche:', error));
        });
    }
});