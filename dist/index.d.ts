import { ICoordinateShape } from './interfaces/i-coordinate-shape';
import './interfaces/i-number';
export declare class GeoCoordinate {
    private _latitude;
    private _longitude;
    private _altitude;
    private _horizontalAccuracy;
    private _verticalAccuracy;
    private _speed;
    private _course;
    private _earthRadius;
    /**
     * @description latitude in decimal Deg
     */
    /**
     * @description latitude in decimal Deg
     */
    latitude: number | null;
    /**
     * @description longitude in decimal Deg
     */
    /**
      * @description longitude in decimal Deg
      */
    longitude: number | null;
    /**
     * @description Altitude in meters
     */
    /**
     * @description Altitude in meters
     */
    altitude: number | null;
    /**
     * @description Horizontal Accuracy in meters
     */
    horizontalAccuracy: number | null;
    /**
     * @description Vertical Accuracy in meters
     */
    verticalAccuracy: number | null;
    /**
     * @description Speed in meters per second
     */
    speed: number | null;
    /**
     * @description course in decimal Degrees relative to true north
     */
    course: number | null;
    /**
     * @description earthradius in meters, which is used for calculations
     */
    earthRadius: number;
    /**
     * returns true if neither longitude nor latitude is set.
     */
    readonly isUnknown: boolean;
    /**
     * @description returns true if longitude and latitude is set.
     */
    readonly isKnown: boolean;
    constructor(obj?: ICoordinateShape);
    Equals(geoCoordinate: GeoCoordinate): boolean;
    toString: () => string;
    getDistanceTo(other: GeoCoordinate, loxodrome?: boolean): number | null;
    getInitBearingTo(other: GeoCoordinate, loxodrome?: boolean): number | null;
    getMidBearingTo(other: GeoCoordinate, loxodrome?: boolean): number | null;
    getFinalBearingTo(other: GeoCoordinate, loxodrome?: boolean): number | null;
    getMidPointTo(other: GeoCoordinate, loxodrome?: boolean): GeoCoordinate | null;
    getPointBetween(other: GeoCoordinate, partial: number): GeoCoordinate | null;
    getDestinationPointWithInitBearing(distance: number, bearing: number, loxodrome?: boolean): GeoCoordinate | null;
}
