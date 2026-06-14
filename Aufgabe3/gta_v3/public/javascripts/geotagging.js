// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

// Here the API used for geolocations is selected
// The following declaration is a 'mockup' that always works and returns a fixed position.
var GEOLOCATION_API = {
    getCurrentPosition: function(onsuccess) {
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
            "timestamp tmm": 1775140116396
        });
    }
};

// This is the real API.
// If there are problems with it, comment out the line.
GEOLOCATION_API = navigator.geolocation;

/**
  * A class to help using the HTML5 Geolocation API.
  */


const mapManager = new MapManager();
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation() {
    // 1. 👈 NEU laut 3.2.3: Den JSON-String aus der Map lesen und umwandeln
    const mapElement = document.getElementById('map');
    let tags = [];
    if (mapElement && mapElement.getAttribute('data-tags')) {
        tags = JSON.parse(mapElement.getAttribute('data-tags'));
    }

    const tagLatField = document.getElementById('lat');
    const tagLonField = document.getElementById('lon');

    // Checken, ob schon Koordinaten im Formular stehen
    if (tagLatField && tagLonField && tagLatField.value && tagLonField.value) {
        const lat = tagLatField.value;
        const lon = tagLonField.value;

        const placeholderImg = document.getElementById('mapView');
        if (placeholderImg) placeholderImg.remove();
        const placeholderText = document.querySelector('#map span'); 
        if (placeholderText) placeholderText.remove();

        mapManager.initMap(lat, lon);
        // 2. 👈 Übergibt das umgewandelte Array an die Marker-Funktion
        mapManager.updateMarkers(lat, lon, tags); 

    } else {
        // Falls die Felder leer sind, GPS abfragen
        LocationHelper.findLocation((helper) => {
            if(tagLatField) tagLatField.value = helper.latitude;
            if(tagLonField) tagLonField.value = helper.longitude; 

            const discoveryForm = document.getElementById('discoveryFilterForm');
            if(discoveryForm) {
                const disLatField = discoveryForm.querySelector('input[name="latitude"]');
                const disLonField = discoveryForm.querySelector('input[name="longitude"]'); 
                if (disLatField) disLatField.value = helper.latitude;
                if (disLonField) disLonField.value = helper.longitude;
            }

            const placeholderImg = document.getElementById('mapView');
            if (placeholderImg) placeholderImg.remove();
            const placeholderText = document.querySelector('#map span'); 
            if (placeholderText) placeholderText.remove();

            mapManager.initMap(helper.latitude, helper.longitude);
            // 3. 👈 Auch hier das Array mitgeben
            mapManager.updateMarkers(helper.latitude, helper.longitude, tags); 
        });
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});