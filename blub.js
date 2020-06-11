// this tries to find all devices
// TODO: Add a filter just for the bulbs


// Initalize variables:
var serv = 0xFE0F;
var charc = 0x932C32BD000747A2835AA8D455B859DD;


function connect(){
    navigator.bluetooth.requestDevice({
        // filters:[{services: [0xFE0F]}]
        acceptAllDevices: true,
        optionalServices: [0xFE0f]
    })
    .then(device => { 
        // Get name of device
        console.log(device.name);

        // Connect to remote GATT Server
        return device.gatt.connect();
    })
    .then(server => {
        // Note that we could also get all services that match a specific UUID by
        // passing it to getPrimaryServices().
        log('Getting Services...');
        return server.getPrimaryServices();
        })
        .then(services => {
        log('Getting Characteristics...');
        let queue = Promise.resolve();
        services.forEach(service => {
            queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
            log('> Service: ' + service.uuid);
            characteristics.forEach(characteristic => {
                log('>> Characteristic: ' + characteristic.uuid + ' ' +
                    getSupportedProperties(characteristic));
            });
            }));
        });
        return queue;
        })
        .catch(error => {
        log('Argh! ' + error);
        });
    }
    
/* Utils */
    
function getSupportedProperties(characteristic) {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
        supportedProperties.push(p.toUpperCase());
    }
    }
    return '[' + supportedProperties.join(', ') + ']';
}

//     .then(server => {
//         // Access light turning on/off service
//         console.log("Getting primary service " + serv);
//         return server.getPrimaryService(serv);
//     })
//     .then(service => {
//         // Get characteristic to communicate with
//         console.log("Getting characteristic " + charc);
//         return service.getCharacteristic(charc);
//     })
//     .catch(error => {console.log(error); });
// }

// // User input for serivce
// function setService(){
//     serv = Number(document.getElementById("service").value);
//     console.log("service set to: "+serv.toString(16));
// }

// // User input for characteristic
// function setCharacteristic(){
//     charc = Number(document.getElementById("Characteristic").value);
//     console.log("characteristic set to: "+charc.toString(16));
// }


// Light functions
function turnOn(){
    console.log("Not initalized");
}
function turnOff(){
    console.log("Not initalized")
}
