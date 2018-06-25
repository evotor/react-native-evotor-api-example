import {AsyncStorage} from 'react-native';
import {DeviceConnectionEventType, DeviceServiceConnector, Scanner, ScannerEventType} from 'evotor-integration-library';

const listener = (device) => async (value) => {
    let abort = false;
    await AsyncStorage
        .setItem(device, value.toString())
        .catch(
            (e) => {
                abort = true;
                console.log("Error writing " + device + " event. " + e.message)
            });
    if (!abort) {
        console.log("Successfully wrote " + device + " event.");
    }
};

export const addDeviceListeners = () => {
    DeviceServiceConnector.addEventListener(DeviceConnectionEventType.PRINTER_CONNECTION_CHANGED, listener("printer"));
    DeviceServiceConnector.addEventListener(DeviceConnectionEventType.SCALES_CONNECTION_CHANGED, listener("scales"));
    Scanner.addEventListener(ScannerEventType.BARCODE_RECEIVED, listener("scanner"));
};