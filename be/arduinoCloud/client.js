import { ArduinoIoTCloud } from 'arduino-iot-js';
import { clientId, clientSecret } from '../constants/secret.js';
import { thingId, variableName } from '../constants/things.js';
import { sendLocationToClients } from '../sockets/index.js';

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

function onLocationUpdate(location) {
    console.log('Location updated:', location);
    sendLocationToClients(location);
}

