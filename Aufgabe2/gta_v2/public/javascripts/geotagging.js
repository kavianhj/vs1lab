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
            "timestamp": 1775140116396
        });
    }
};

// This is the real API.
// If there are problems with it, comment out the line.
GEOLOCATION_API = navigator.geolocation;

/**
  * A class to help using the HTML5 Geolocation API.
  */
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

   /**
    * Create LocationHelper instance if coordinates are known.
    * @param {string} latitude 
    * @param {string} longitude 
    */
   constructor(latitude, longitude) {
       this.#latitude = (parseFloat(latitude)).toFixed(5);
       this.#longitude = (parseFloat(longitude)).toFixed(5);
   }

    
    static findLocation(callback) {
        const geoLocationApi = GEOLOCATION_API;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        geoLocationApi.getCurrentPosition((location) => {
            
            let helper = new LocationHelper(location.coords.latitude, location.coords.longitude);
            
            callback(helper);
        }, (error) => {
           alert(error.message)
        });
    }
}

/**
 * A class to help using the Leaflet map service.
 */
class MapManager {

    #map
    #markers

    /**
    * Initialize a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {number} zoom The map zoom, defaults to 18
    */
    initMap(latitude, longitude, zoom = 18) {
        // set up dynamic Leaflet map
        this.#map = L.map('map').setView([latitude, longitude], zoom);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors'}).addTo(this.#map);
        this.#markers = L.layerGroup().addTo(this.#map);
    }

    /**
    * Update the Markers of a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
    */
    updateMarkers(latitude, longitude, tags = []) {
        // delete all markers
        this.#markers.clearLayers();
        L.marker([latitude, longitude])
            .bindPopup("Your Location")
            .addTo(this.#markers);
        for (const tag of tags) {
            L.marker([tag.latitude,tag.longitude])
                .bindPopup(tag.name)
                .addTo(this.#markers);  
        }
    }
}

const mapManager = new MapManager();
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation() {
    LocationHelper.findLocation((helper) => {
        
        // 1. Tagging-Formular ausfüllen
        const tagLatField = document.getElementById('lat');
        const tagLonField = document.getElementById('lon');

        if(tagLatField) tagLatField.value = helper.latitude;
        if(tagLonField) tagLonField.value = helper.longitude; 

        // 2. Discovery-Formular ausfüllen
        const discoveryForm = document.getElementById('discoveryFilterForm');
        if(discoveryForm) {
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

        // 4. Karte initialisieren
        mapManager.initMap(helper.latitude, helper.longitude);
        mapManager.updateMarkers(helper.latitude, helper.longitude);
    });
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});