// File origin: VS1LAB A3
   
const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");
/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    #geotags = [];
    // TODO: ... your code here ...
constructor() {
    this.#geotags = GeoTagExamples.tagList.map(
        ([name, latitude, longitude, hashtag]) =>
            new GeoTag(latitude, longitude, name, hashtag)
        
    );
}
     
    addGeoTag(geoTag){
        this.#geotags.push(geoTag);
    }

    removeGeoTag(name){
        this.#geotags = this.#geotags.filter((geoTag)=> geoTag.name !== name );
    }

    getNearbyGeoTags(location, radius) {
    return this.#geotags.filter(geoTag => {
        let dx = geoTag.latitude - location.latitude;
        let dy = geoTag.longitude - location.longitude;

        let distance = Math.sqrt(dx * dx + dy * dy);

        return distance <= radius;
    });
    }

    searchNearbyGeoTags(location,radius,keyword){
        return this.getNearbyGeoTags(location,radius).filter(geotag => geotag.name.includes(keyword) || (geotag.hashtag && geotag.hashtag.includes(keyword)));

    }
    
}



module.exports = InMemoryGeoTagStore
