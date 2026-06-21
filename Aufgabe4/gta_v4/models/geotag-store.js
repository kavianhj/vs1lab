const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");

class InMemoryGeoTagStore {

    // Wir erstellen ein Array für die Objekte
    // Das Array geotags ist duch # privat  
    #geotags = [];
    #nextId = 1; // Unser Nummer-Automat. Eine Eigenschaft. 

    constructor() {
        this.#geotags = GeoTagExamples.tagList.map(
            ([name, latitude, longitude, hashtag]) => {
                const tag = new GeoTag(latitude, longitude, name, hashtag, this.#nextId);

                this.#nextId++;

                return tag;
            }
        );
    }

    addGeoTag(geoTag) {
        geoTag.id = this.#nextId
        this.#nextId++;
        this.#geotags.push(geoTag);
    }

    removeGeoTagById(id) {
        this.#geotags = this.#geotags.filter(geoTag => geoTag.id !== parseInt(id));
    }

    getGeoTagById(id) {
        return this.#geotags.find(geoTag => geoTag.id === parseInt(id));
    }

    getNearbyGeoTags(location, radius) {
        return this.#geotags.filter(geoTag => {
            let dx = geoTag.latitude - location.latitude;
            let dy = geoTag.longitude - location.longitude;

            let distance = Math.sqrt(dx * dx + dy * dy);

            return distance <= radius;
        });
    }

    searchNearbyGeoTags(location, radius, keyword) {
        return this.getNearbyGeoTags(location, radius).filter(geotag => geotag.name.includes(keyword) || (geotag.hashtag && geotag.hashtag.includes(keyword)));

    }

    updateGeoTagById(id, name, latitude, longitude, hashtag) {
        // 1. Wir nutzen unser vorhandenes Suchgerät, um den passenden Tag zu finden
        const tag = this.getGeoTagById(id);

        if (tag) {
            tag.name = name;
            tag.latitude = parseFloat(latitude);   
            tag.longitude = parseFloat(longitude); 
            tag.hashtag = hashtag;

            return tag; 
        }
        return null; 
    }
}

module.exports = InMemoryGeoTagStore