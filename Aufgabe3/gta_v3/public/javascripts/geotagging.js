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


/**
 * A class to help using the Leaflet map service.
 */


const mapManager = new MapManager();
/**
 * TODO: 'updateLocation'
 * 
 * 
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// 
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
          console.log(tags);
        }else {

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

                // 3. Platzhalter löschen (Bild und Beschriftung)
                const placeholderImg = document.getElementById('mapView');
                if (placeholderImg) placeholderImg.remove();

                const placeholderText = document.querySelector('#map span'); 
                if (placeholderText) placeholderText.remove();

            
                mapManager.initMap(helper.latitude, helper.longitude);
                const mapDiv = document.getElementById('map');
                const tags = JSON.parse(mapDiv.dataset.tags);
                mapManager.updateMarkers(helper.latitude,helper.longitude, tags);
       
      
            });
        }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});