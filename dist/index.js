"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./interfaces/i-number");
class GeoCoordinate {
    constructor(obj) {
        this._latitude = null;
        this._longitude = null;
        this._altitude = null;
        this._horizontalAccuracy = null;
        this._verticalAccuracy = null;
        this._speed = null;
        this._course = null;
        this._earthRadius = 6371e3;
        this.toString = () => {
            let result = 'unknown';
            if (this.isKnown) {
                const alt = this._altitude ? this._altitude.toString() : 'unknown';
                const course = this._course ? this._course.toString() : 'unknown';
                const speed = this._speed ? this._speed.toString() : 'unknown';
                const vAcc = this._verticalAccuracy ?
                    this._verticalAccuracy.toString() : 'unknown';
                const hAcc = this._horizontalAccuracy ?
                    this._horizontalAccuracy.toString() : 'unknown';
                result = `long: ${this._longitude}, lat: ${this._latitude},` +
                    ` alt: ${alt}, course: ${course}, speed: ${speed},` +
                    ` vertAcc: ${vAcc}, horzAcc: ${hAcc}`;
            }
            return result;
        };
        if (obj) {
            this.latitude = obj.Latitude == undefined ? null : obj.Latitude;
            this.longitude = obj.Longitude == undefined ? null : obj.Longitude;
            this.altitude = obj.Altitude == undefined ? null : obj.Altitude;
            this.horizontalAccuracy = obj.HorizontalAccuracy == undefined ?
                null : obj.HorizontalAccuracy;
            this.verticalAccuracy = obj.VerticalAccuracy == undefined ?
                null : obj.VerticalAccuracy;
            this.speed = obj.Speed == undefined ? null : obj.Speed;
            this.course = obj.Course == undefined ? null : obj.Course;
        }
    }
    /**
     * @description latitude in decimal Deg
     */
    get latitude() {
        return this._latitude;
    }
    /**
     * @description longitude in decimal Deg
     */
    get longitude() {
        return this._longitude;
    }
    /**
     * @description Altitude in meters
     */
    get altitude() {
        return this._altitude;
    }
    /**
     * @description Horizontal Accuracy in meters
     */
    get horizontalAccuracy() {
        return this._horizontalAccuracy;
    }
    /**
     * @description Vertical Accuracy in meters
     */
    get verticalAccuracy() {
        return this._verticalAccuracy;
    }
    /**
     * @description Speed in meters per second
     */
    get speed() {
        return this._speed;
    }
    /**
     * @description course in decimal Degrees relative to true north
     */
    get course() {
        return this._course;
    }
    /**
     * @description earthradius in meters, which is used for calculations
     */
    get earthRadius() {
        return this._earthRadius;
    }
    /**
     * returns true if neither longitude nor latitude is set.
     */
    get isUnknown() {
        if (this._longitude && this._latitude) {
            return false;
        }
        return true;
    }
    /**
     * @description returns true if longitude and latitude is set.
     */
    get isKnown() {
        return !this.isUnknown;
    }
    /**
     * @description latitude in decimal Deg
     */
    set latitude(value) {
        value = (value == null || value > 90 || value < -90) ? null : value;
        this._latitude = value;
    }
    /**
      * @description longitude in decimal Deg
      */
    set longitude(value) {
        value = (value == null || value > 180 || value < -180) ? null : value;
        this._longitude = value;
    }
    /**
     * @description Altitude in meters
     */
    set altitude(value) {
        this._altitude = value;
    }
    set horizontalAccuracy(value) {
        this._horizontalAccuracy = value;
    }
    set verticalAccuracy(value) {
        this._verticalAccuracy = value;
    }
    set speed(value) {
        value = (value == null || value < 0) ? null : value;
        this._speed = value;
    }
    set course(value) {
        value = (value == null || value > 360 || value < 0) ? null : value;
        this._course = value;
    }
    set earthRadius(value) {
        if (isNaN(value))
            value = 6371e3;
        this._earthRadius = value;
    }
    Equals(geoCoordinate) {
        if (this._longitude === geoCoordinate.longitude
            && this._latitude === geoCoordinate.latitude) {
            return true;
        }
        return false;
    }
    getDistanceTo(other, loxodrome = false) {
        if (!(other instanceof GeoCoordinate))
            return null;
        if (this.isUnknown || other.isUnknown)
            return null;
        const lat_2_rad = other.latitude.toRad();
        const lat_1_rad = this._latitude.toRad();
        const deltaLatRad = lat_2_rad - lat_1_rad;
        const radius = this._earthRadius;
        if (!loxodrome) {
            const lon_1_rad = this._longitude.toRad();
            const lon_2_rad = other.longitude.toRad();
            const deltaLonRad = lon_2_rad - lon_1_rad;
            const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2)
                + Math.cos(lat_1_rad) * Math.cos(lat_2_rad)
                    * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = radius * c;
            return d;
        }
        else {
            let deltaAbsLonRad = Math.abs(other.longitude - this._longitude).toRad();
            if (deltaAbsLonRad > Math.PI)
                deltaAbsLonRad -= 2 * Math.PI;
            // on Mercator projection, longitude distances shrink by latitude; q is the 'stretch factor'
            // q becomes ill-conditioned along E-W line (0/0); use empirical tolerance to avoid it
            const deltaX = Math.log(Math.tan(lat_2_rad / 2 + Math.PI / 4)
                / Math.tan(lat_1_rad / 2 + Math.PI / 4));
            const q = Math.abs(deltaX) > 10e-12 ? deltaLatRad / deltaX
                : Math.cos(lat_1_rad);
            // distance is pythagoras on 'stretched' Mercator projection
            const kreisbogen = Math.sqrt(deltaLatRad * deltaLatRad + q * q
                * deltaAbsLonRad * deltaAbsLonRad); // angular distance in radians
            const d = kreisbogen * radius;
            return d;
        }
    }
    getInitBearingTo(other, loxodrome = false) {
        if (!(other instanceof GeoCoordinate))
            return null;
        if (this.isUnknown || other.isUnknown)
            return null;
        const lat_1_rad = this._latitude.toRad();
        const lat_2_rad = other.latitude.toRad();
        let deltaLonRad = (other.longitude - this._longitude).toRad();
        if (!loxodrome) {
            const y = Math.sin(deltaLonRad) * Math.cos(lat_2_rad);
            const x = Math.cos(lat_1_rad) * Math.sin(lat_2_rad) -
                Math.sin(lat_1_rad) * Math.cos(lat_2_rad) * Math.cos(deltaLonRad);
            const z = Math.atan2(y, x);
            return (z.toDeg() + 360) % 360;
        }
        else {
            // if dLon over 180° take shorter rhumb line across the anti-meridian:
            if (deltaLonRad > Math.PI)
                deltaLonRad -= 2 * Math.PI;
            if (deltaLonRad < -Math.PI)
                deltaLonRad += 2 * Math.PI;
            const z = Math.log(Math.tan(lat_2_rad / 2 + Math.PI / 4)
                / Math.tan(lat_1_rad / 2 + Math.PI / 4));
            const y = Math.atan2(deltaLonRad, z);
            return (y.toDeg() + 360) % 360;
        }
    }
    getMidBearingTo(other, loxodrome = false) {
        if (!(other instanceof GeoCoordinate))
            return null;
        if (this.isUnknown || other.isUnknown)
            return null;
        if (!loxodrome) {
            let midPoint = this.getMidPointTo(other);
            return this.getFinalBearingTo(midPoint); //midpoint can be null, but this will be checked in getFinalBearingTo()
        }
        else {
            return this.getFinalBearingTo(other, loxodrome);
        }
    }
    getFinalBearingTo(other, loxodrome = false) {
        if (!(other instanceof GeoCoordinate))
            return null;
        if (this.isUnknown || other.isUnknown)
            return null;
        if (!loxodrome)
            return (other.getInitBearingTo(this) + 180) % 360;
        return this.getInitBearingTo(other, true);
    }
    getMidPointTo(other, loxodrome = false) {
        if (!(other instanceof GeoCoordinate))
            return null;
        if (this.isUnknown || other.isUnknown)
            return null;
        const lat_1_rad = this._latitude.toRad();
        let lon_1_rad = this._longitude.toRad();
        const lat_2_rad = other.latitude.toRad();
        let midpoint = new GeoCoordinate();
        if (!loxodrome) {
            const deltaLonRad = (other.longitude - this._longitude).toRad();
            const Bx = Math.cos(lat_2_rad) * Math.cos(deltaLonRad);
            const By = Math.cos(lat_2_rad) * Math.sin(deltaLonRad);
            const x = Math.sqrt((Math.cos(lat_1_rad) + Bx) * (Math.cos(lat_1_rad) + Bx)
                + By * By);
            const y = Math.sin(lat_1_rad) + Math.sin(lat_2_rad);
            const lat_MidPoint_rad = Math.atan2(y, x);
            const lon_MidPoint_rad = lon_1_rad + Math.atan2(By, Math.cos(lat_1_rad) + Bx);
            midpoint.latitude = lat_MidPoint_rad.toDeg();
            midpoint.longitude = (lon_MidPoint_rad.toDeg() + 540) % 360 - 180; // normalise to −180..+180° 
            return midpoint;
        }
        else {
            let lon_2_rad = other.longitude.toRad();
            if (Math.abs(lon_2_rad - lon_1_rad) > Math.PI)
                lon_1_rad += 2 * Math.PI; // crossing anti-meridian
            const lat_MidPoint_rad = (lat_1_rad + lat_2_rad) / 2;
            const f1 = Math.tan(Math.PI / 4 + lat_1_rad / 2);
            const f2 = Math.tan(Math.PI / 4 + lat_2_rad / 2);
            const f3 = Math.tan(Math.PI / 4 + lat_MidPoint_rad / 2);
            let lon_MidPoint_rad = ((lon_2_rad - lon_1_rad) * Math.log(f3)
                + lon_1_rad * Math.log(f2) - lon_2_rad * Math.log(f1))
                / Math.log(f2 / f1);
            if (!isFinite(lon_MidPoint_rad))
                lon_MidPoint_rad = (lon_1_rad + lon_2_rad) / 2; // parallel of latitude
            midpoint.latitude = lat_MidPoint_rad.toDeg();
            midpoint.longitude = (lon_MidPoint_rad.toDeg() + 540) % 360 - 180; // normalise to −180..+180° 
            return midpoint;
        }
    }
    getPointBetween(other, partial) {
        if (!(other instanceof GeoCoordinate))
            return null;
        if (this.isUnknown || other.isUnknown)
            return null;
        if (isNaN(partial))
            partial = 1;
        const lat_1_rad = this._latitude.toRad();
        const lon_1_rad = this._longitude.toRad();
        const lat_2_rad = other.latitude.toRad();
        const lon_2_rad = other.longitude.toRad();
        const sinLat_1_rad = Math.sin(lat_1_rad);
        const cosLat_1_rad = Math.cos(lat_1_rad);
        const sinLon_1_rad = Math.sin(lon_1_rad);
        const cosLon_1_rad = Math.cos(lon_1_rad);
        const sinLat_2_rad = Math.sin(lat_2_rad);
        const cosLat_2_rad = Math.cos(lat_2_rad);
        const sinLon_2_rad = Math.sin(lon_2_rad);
        const cosLon_2_rad = Math.cos(lon_2_rad);
        // distance between points
        const deltaLatRad = lat_2_rad - lat_1_rad;
        const deltaLonRad = lon_2_rad - lon_1_rad;
        const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2)
            + Math.cos(lat_1_rad) * Math.cos(lat_2_rad) * Math.sin(deltaLonRad / 2)
                * Math.sin(deltaLonRad / 2);
        const kreisbogen = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const A = Math.sin((1 - partial) * kreisbogen) / Math.sin(kreisbogen);
        const B = Math.sin(partial * kreisbogen) / Math.sin(kreisbogen);
        const x = A * cosLat_1_rad * cosLon_1_rad + B * cosLat_2_rad * cosLon_2_rad;
        const y = A * cosLat_1_rad * sinLon_1_rad + B * cosLat_2_rad * sinLon_2_rad;
        const z = A * sinLat_1_rad + B * sinLat_2_rad;
        var latNewRad = Math.atan2(z, Math.sqrt(x * x + y * y));
        var lonNewRad = Math.atan2(y, x);
        let newPoint = new GeoCoordinate();
        newPoint.latitude = latNewRad.toDeg();
        newPoint.longitude = (lonNewRad.toDeg() + 540) % 360 - 180;
        return newPoint;
    }
    getDestinationPointWithInitBearing(distance, bearing, loxodrome = false) {
        if (this.isUnknown)
            return null;
        if (isNaN(distance) || isNaN(bearing))
            return null;
        const radius = this._earthRadius;
        const kreisbogen = distance / radius;
        const bearingRad = bearing.toRad();
        const latRad = this._latitude.toRad();
        const lonRad = this._longitude.toRad();
        if (!loxodrome) {
            const sinLatRad = Math.sin(latRad);
            const cosLatRad = Math.cos(latRad);
            const sinKreisbogen = Math.sin(kreisbogen);
            const cosKreisbogen = Math.cos(kreisbogen);
            const sinBearingRad = Math.sin(bearingRad);
            const cosBearingRad = Math.cos(bearingRad);
            const sinNewLat = sinLatRad * cosKreisbogen + cosLatRad
                * sinKreisbogen * cosBearingRad;
            const newLatRad = Math.asin(sinNewLat);
            const y = sinBearingRad * sinKreisbogen * cosLatRad;
            const x = cosKreisbogen - sinLatRad * sinNewLat;
            const newLonRad = lonRad + Math.atan2(y, x);
            let newPoint = new GeoCoordinate();
            newPoint.longitude = ((newLonRad.toDeg() + 540) % 360 - 180);
            newPoint.latitude = newLatRad.toDeg();
            return newPoint;
        }
        else {
            const deltaLatRad = kreisbogen * Math.cos(bearingRad);
            let newLatRad = latRad + deltaLatRad;
            // check for some daft bugger going past the pole, normalise latitude if so
            if (Math.abs(newLatRad) > Math.PI / 2) {
                newLatRad = newLatRad > 0 ? Math.PI - newLatRad : -Math.PI - newLatRad;
            }
            const deltaZ = Math.log(Math.tan(newLatRad / 2 + Math.PI / 4)
                / Math.tan(latRad / 2 + Math.PI / 4));
            const q = Math.abs(deltaZ) > 10e-12 ? deltaLatRad / deltaZ
                : Math.cos(latRad); // E-W course becomes ill-conditioned with 0/0
            const deltaLonRad = kreisbogen * Math.sin(bearingRad) / q;
            const newLonRad = lonRad + deltaLonRad;
            let newPoint = new GeoCoordinate();
            newPoint.longitude = ((newLonRad.toDeg() + 540) % 360 - 180);
            newPoint.latitude = newLatRad.toDeg();
            return newPoint;
        }
    }
}
exports.GeoCoordinate = GeoCoordinate;
