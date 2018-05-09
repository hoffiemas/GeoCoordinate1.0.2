"use strict";
/**
 * converts degrees to radians
 */
Number.prototype.toRad = function () {
    return this * (Math.PI / 180);
};
/**
 * converts radians to degrees
 */
Number.prototype.toDeg = function () {
    return this * (180 / Math.PI);
};
/**
 * makes courses to real courses e.g. -20° ==> 340°
 * 400° ==> 40°, 410° ==> 50°;
 */
Number.prototype.coursify = function () {
    let course = this * 1;
    if (course > 0) {
        while (course > 360) {
            course = course - 360;
        }
        (course == 360) && (course = 0);
    }
    else {
        while (course < -360) {
            course = course + 360;
        }
        (course != 0) && (course = course + 360);
    }
    return course;
};
/**
 * returns the TrackBackCourse
 */
Number.prototype.trackBack = function () {
    const course = this * 1;
    return (course - 180).coursify();
};
/**
 * converts meter to km
 */
Number.prototype.meterToKm = function () {
    return this / 1000;
};
/**
 * converts km to meter
 */
Number.prototype.kmToMeter = function () {
    return this * 1000;
};
/**
 * converts NM to km and kt to km/h
 */
Number.prototype.nmToKm = function () {
    return this * 1.852;
};
/**
 * converts km to NM and km/h to kt
 */
Number.prototype.kmToNm = function () {
    return this / 1.852;
};
/**
 * converts meter to feet
 */
Number.prototype.meterToFeet = function () {
    return this * 3.28084;
};
/**
 * converts feet to meter
 */
Number.prototype.feetToMeter = function () {
    return this / 3.28084;
};
/**
 * converts feet to FL
 */
Number.prototype.feetToFL = function () {
    return this / 100;
};
/**
 * converts FL to feet
 */
Number.prototype.flToFeet = function () {
    return this * 100;
};
