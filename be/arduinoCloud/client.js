import { ArduinoIoTCloud } from 'arduino-iot-js';
import { clientId, clientSecret } from '../constants/secret.js';
import { thingId, variableName } from '../constants/things.js';
import { sendLocationToClients } from '../sockets/index.js';
import { createLocation, getCurrentLocation } from '../models/locationModel.js';
import { getCircleSafezone } from '../models/circleSafezoneModel.js';
import { getRectangleSafezone } from '../models/rectangleSafezoneModel.js';

const options = {
    clientId,
    clientSecret,
    onDisconnect: message => {
        console.error(message);
    }
};

export async function startArduino() {
    ArduinoIoTCloud.connect(options)
        .then(() => {
            console.log('Connected to Arduino IoT Cloud broker');
            return ArduinoIoTCloud.onPropertyValue(thingId, variableName, onLocationUpdate);
        })
        .then(() => console.log('callback registered'))
        .catch(error => console.error(error));
}

async function onLocationUpdate(location) {
    console.log('Location updated:', location);
    const insideSafezone = await _checkSafezone(location);
    await createLocation(location.lat, location.lon, insideSafezone);
    sendLocationToClients(location);
}

export const _checkSafezone = async (location) => {
    const rectangleSafezone = await getRectangleSafezone();
    const circleSafezone = await getCircleSafezone();

    const isInsideRectangle = checkInsideRectangleSafezone(location, rectangleSafezone);
    const isInsideCircle = checkInsideCircleSafezone(location, circleSafezone);

    return isInsideRectangle || isInsideCircle;
}

export const __checkSafezone = async (location, rectangleSafezone, circleSafezone) => {
    if (!circleSafezone) {
        circleSafezone = await getCircleSafezone();
    }
    if (!rectangleSafezone) {
        rectangleSafezone = await getRectangleSafezone();
    }

    const isInsideRectangle = checkInsideRectangleSafezone(location, rectangleSafezone);
    const isInsideCircle = checkInsideCircleSafezone(location, circleSafezone);

    return isInsideRectangle || isInsideCircle;
}

export const checkSafezone = async () => {
    const rectangleSafezone = await getRectangleSafezone();
    const circleSafezone = await getCircleSafezone();
    const location = await getCurrentLocation();

    console.log('[checkSafezone] location:', { lat: location?.lat, lon: location?.lon });
    console.log('[checkSafezone] rectangle:', rectangleSafezone);
    console.log('[checkSafezone] circle:', circleSafezone);

    const isInsideRectangle = checkInsideRectangleSafezone(location, rectangleSafezone);
    const isInsideCircle = checkInsideCircleSafezone(location, circleSafezone);

    console.log('[checkSafezone] isInsideRectangle:', isInsideRectangle, '| isInsideCircle:', isInsideCircle);

    return isInsideRectangle || isInsideCircle;
}

const checkInsideRectangleSafezone = (location, rectangleSafezone) => {
    if (!rectangleSafezone) return false;

    let { north, south, east, west, rotation } = rectangleSafezone;

    north = Number(north);
    south = Number(south);
    east = Number(east);
    west = Number(west);
    rotation = Number(rotation);

    const centerLat = (north + south) / 2;
    const centerLon = (east + west) / 2;

    const rad = -rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const dLat = location.lat - centerLat;
    const dLon = location.lon - centerLon;

    // Rotate in (x=lon, y=lat) space to match the Map UI convention:
    //   rotateVector(localX=east, localY=north, angleDeg)
    // We invert the rotation to "un-rotate" the point back to axis-aligned space.
    const rotatedLon = dLon * cos - dLat * sin + centerLon;
    const rotatedLat = dLon * sin + dLat * cos + centerLat;

    return (
        rotatedLat <= north &&
        rotatedLat >= south &&
        rotatedLon <= east &&
        rotatedLon >= west
    );
};

const checkInsideCircleSafezone = (location, circleSafezone) => {
    if (!circleSafezone) return false;

    const { lat, lon, radius } = circleSafezone;

    const toRad = (deg) => deg * Math.PI / 180;

    const R = 6371000; // Earth radius in meters

    const dLat = toRad(location.lat - lat);
    const dLon = toRad(location.lon - lon);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat)) *
        Math.cos(toRad(location.lat)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // meters

    return distance <= radius;
};