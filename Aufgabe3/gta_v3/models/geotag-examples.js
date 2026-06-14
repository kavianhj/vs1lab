// File origin: VS1LAB A3

// Wir holen uns die Schablone für ein GeoTag-Objekt
const GeoTag = require('./geotag');

/**
 * A class representing example geoTags at HKA
 */
class GeoTagExamples {
    /**
     * Provides some geoTag data
     */
    static get tagList() {
        return [
            ['Castle', 49.013790, 8.404435, '#sight'],
            ['IWI', 49.013790, 8.390071, '#edu'],
            ['Building E', 49.014993, 8.390049, '#campus'],
            ['Building F', 49.015608, 8.390112, '#campus'],
            ['Building M', 49.016171, 8.390155, '#campus'],
            ['Building LI', 49.015636, 8.389318, '#campus'],
            ['Auditorium He', 49.014915, 8.389264, '#campus'],
            ['Building R', 49.014992, 8.392365, '#campus'],
            ['Building A', 49.015738, 8.391619, '#campus'],
            ['Building B', 49.016843, 8.391372, '#campus'],
            ['Building K', 49.013190, 8.392090, '#campus'],
        ];
    }

    /**
     * Befüllt einen übergebenen Store automatisch mit den Beispieldaten
     */
    static populate(store) {
        GeoTagExamples.tagList.forEach(tagData => {
            // tagData[0] = Name, tagData[1] = Lat, tagData[2] = Lon, tagData[3] = Hashtag
            const geoTag = new GeoTag(tagData[1], tagData[2], tagData[0], tagData[3]);
            store.addGeoTag(geoTag);
        });
    }
}

module.exports = GeoTagExamples;
