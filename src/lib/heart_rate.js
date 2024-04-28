import { heart_rate, hr_device_name, hr_device_status,
    hrByteLength, hrHexData, hrFlags } from "./stores";

export function hrChanged(event) {
    let value = event.target.value ; // a dataviewer object is provided by the object event
    //heart_rate = value.getUint8(1) ; // we select the eight bytes that contain the heartrate informations
    
    hrByteLength.update(() => value.byteLength);

    let a = [];
    // Convert raw data bytes to hex values in order to console log each notification.
    for (let i = 0; i < value.byteLength; i++) 
    {
        a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    }
    hrHexData.update(() => a.join('-'));
    hrFlags.update(() => value.getUint8(0, /*littleEndian=*/true) );
    
    heart_rate.update(() => value.getUint8(1) );
}

export function pairHeartRateMonitor() {
    let options = {"filters":[{"services":["heart_rate"]}]};
    navigator.bluetooth.requestDevice(options)
    // requestDevice returns a promise to a device, becomes param to next promise in chain
    .then((device) => {
        hr_device_name.update(() => device.name);
        hr_device_status.update(() => device.status);
        return device.gatt.connect();
    }) 
    .then(server => server.getPrimaryService('heart_rate')) // we get the service
    .then(service => service.getCharacteristic('heart_rate_measurement')) // then the characteristics
    .then(characteristic => characteristic.startNotifications())
    .then(characteristic => {    

        characteristic.addEventListener('characteristicvaluechanged', hrChanged) ; // then we subscribe to the characteristic notifications
    })                                                                                                    // and set the callback function
    .catch(error => { hr_device_status.update(() => error); });
}