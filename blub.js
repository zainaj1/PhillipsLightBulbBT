// this tries to find all devices
// TODO: Add a filter just for the bulbs


// Initalize variables:
<<<<<<< HEAD
var serv = '932c32bd-0002-47a2-835a-a8d455b859dd';
var charc = '932c32bd-0007-47a2-835a-a8d455b859dd';
=======
var serv = '0x932C32BD-0000-47A2-835A-A8D455B59DD';
var charc = '0x932C32BD-0007-47A2-835A-A8D455B859DD';
>>>>>>> 43eb301987eaaec327f809bed2ec335655df4f60
// var charc = UUID.fromString("932C32BD-0007-47A2-835A-A8D455B859DD");


function connect(){
    navigator.bluetooth.requestDevice({
        filters:[{services: [0xFE0F]}]
        // acceptAllDevices: true,
        // optionalServices: [0xFE0f]
    })
    .then(device => { 
        // Get name of device
        console.log(device.name);

        // Connect to remote GATT Server
        return device.gatt.connect();
    })
    .then(server => {
        // Access light turning on/off service
        console.log("Getting primary service " + serv.toString(16));
        return server.getPrimaryService('932C32BD-0000-47A2-835A-A8D455B59DD');
    })
    .then(service => {
        console.log("Acceced: "+service.uuid);
        // Get characteristic to communicate with
        console.log("Getting characteristic " + charc.toString(16));
        return service.getCharacteristic('932C32BD-0007-47A2-835A-A8D455B859DD');
        
    })
    .then(characteristic => {
        console.log("sent command");
        var data = new Uint8Array([0x01, 0x01, 0x00, 0x05, 0x02, 0x02, 0x00])
        return characteristic.writeValue(data);
    })
    .catch(error => {console.log("Something whent wrong: " + error); });
}


// User input for serivce
function setService(){
    serv = document.getElementById("service").value;
    console.log("service set to: "+serv);
}
// User input for characteristic
function setCharacteristic(){
    charc = document.getElementById("Characteristic").value;
    console.log("characteristic set to: "+charc.toString(16));
}


// Light functions
function turnOn(){
    console.log("Not initalized");
}
function turnOff(){
    console.log("Not initalized")
}
