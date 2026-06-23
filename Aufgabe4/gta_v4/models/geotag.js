
class GeoTag {
    // Einen neuen Ort erschaffen
    constructor(latitude, longitude, name, hashtag, id) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.hashtag = hashtag;

    }
}

module.exports = GeoTag;