/**
 * converts degrees to radians
 */
Number.prototype.toRad = function (): number {
  return this as number * (Math.PI / 180);
};

/**
 * converts radians to degrees
 */
Number.prototype.toDeg = function (): number {
  return this as number * (180 / Math.PI);
};

/**
 * makes courses to real courses e.g. -20° ==> 340°
 * 400° ==> 40°, 410° ==> 50°;
 */
Number.prototype.coursify = function (): number {
  let course = (this as number) * 1;
  if (course > 0) {
    while (course > 360) {
      course = course - 360;
    }
    (course == 360) && (course = 0);
  } else {
    while (course < -360) {
      course = course + 360;
    }
    (course != 0) && (course = course + 360);
  }
  return course;
}

/**
 * returns the TrackBackCourse
 */
Number.prototype.trackBack = function (): number {
  const course = (this as number) * 1;
  return (course - 180).coursify();
};


/**
 * converts meter to km
 */
Number.prototype.meterToKm = function (): number {
  return (this as number) / 1000;
}


/**
 * converts km to meter
 */
Number.prototype.kmToMeter = function (): number {
  return (this as number) * 1000;
}

/**
 * converts NM to km and kt to km/h
 */
Number.prototype.nmToKm = function (): number {
  return (this as number) * 1.852;
}

/**
 * converts km to NM and km/h to kt
 */
Number.prototype.kmToNm = function (): number {
  return (this as number) / 1.852;
}

/**
 * converts meter to feet
 */
Number.prototype.meterToFeet = function (): number {
  return (this as number) * 3.28084;
}

/**
 * converts feet to meter
 */
Number.prototype.feetToMeter = function (): number {
  return (this as number) / 3.28084;
}

/**
 * converts feet to FL
 */
Number.prototype.feetToFL = function (): number {
  return (this as number) / 100;
}

/**
 * converts FL to feet
 */
Number.prototype.flToFeet = function (): number {
  return (this as number) * 100;
}