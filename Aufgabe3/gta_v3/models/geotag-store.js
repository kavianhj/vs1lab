// File origin: VS1LAB A3

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

    constructor() {
        // Die zentrale Liste, in der alle GeoTags landen
        this.geotags = [];
    }

    /**
     * Fügt einen neuen GeoTag der Liste hinzu
     */
    addGeoTag(geotag) {
        this.geotags.push(geotag);
    }

    /**
     * Gibt alle gespeicherten GeoTags zurück
     */
    getAllGeoTags() {
        return this.geotags;
    }

    /**
     * Sucht nach GeoTags, die ein bestimmtes Suchwort im Namen oder Hashtag haben
     */
    search(keyword) {
        if (!keyword) {
            return this.geotags;
        }
        const lowerKeyword = keyword.toLowerCase();
        return this.geotags.filter(tag => 
            tag.name.toLowerCase().includes(lowerKeyword) || 
            tag.hashtag.toLowerCase().includes(lowerKeyword)
        );
    }

}

module.exports = InMemoryGeoTagStore
