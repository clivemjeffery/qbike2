import { pw_device_name, pw_device_status,
    power, targetPower,
    cadence,
    speed } from "./stores";

import { indoorBikeData } from "./IndoorBikeData.js";

export function pwChanged(event) {
    let value = event.target.value ; // a dataviewer object is provided by the object event
    let data = indoorBikeData.decode(value);
    
    power.update(() => data.power );
    targetPower.update(() => data.flags ); // to see if static
    cadence.update(() => data.cadence );
    speed.update(() => data.speed );
}

export function pairCyclingPower() {
    let options = {"filters":[{"services":["fitness_machine"]}]};
    navigator.bluetooth.requestDevice(options)
    // requestDevice returns a promise to a device, becomes param to next promise in chain
    .then((device) => {
        pw_device_name.update(() => device.name);
        pw_device_status.update(() => device.status);
        return device.gatt.connect();
    }) 
    .then(server => server.getPrimaryService('fitness_machine')) // we get the service
    .then(service => service.getCharacteristic('indoor_bike_data')) // then the characteristics
    .then(characteristic => characteristic.startNotifications())
    .then(characteristic => {    

        characteristic.addEventListener('characteristicvaluechanged', pwChanged) ; // then we subscribe to the characteristic notifications
    })                                                                                                    // and set the callback function
    .catch(error => { pw_device_status.update(() => error); });
}