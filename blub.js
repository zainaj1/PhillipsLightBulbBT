// this tries to find all devices
// TODO: Add a filter just for the bulbs


// Initalize variables:
var serv = '932c32bd-0000-47a2-835a-a8d455b859dd';
var charc = '932c32bd-0003-47a2-835a-a8d455b859dd';
var ledCharc;

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
        return server.getPrimaryService(serv);
    })
    .then(service => {
        console.log("Acceced: "+service.uuid);
        // Get characteristic to communicate with
        console.log("Getting characteristic " + charc.toString(16));
        return service.getCharacteristic(charc);
        
    })
    .then(characteristic => {
        ledCharc = characteristic;
        console.log("sent command");
        // var data = new Uint8Array([0x01, 0x01, 0x00, 0x05, 0x02, 0x02, 0x00])
        var data = new Uint8Array([0x12]);
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
    var data = new Uint8Array([0x01, 0x01, 0x01, 0x05, 0x02, 0x02, 0x00])
    console.log("Light turned on");
    return ledCharc.writeValue(data)
}
function turnOff(){
    var data = new Uint8Array([0x01, 0x01, 0x00, 0x05, 0x02, 0x02, 0x00])
    console.log("Light turned off");
    return ledCharc.writeValue(data)
}

var fireplace = false;
function firePlace(){
    fireplace = !fireplace;
    
    for (i=0; i<99; i++){
        var data = new Uint8Array([Math.floor(Math.random() *99) + 1]);
        _sendCommand(data);
        console.log(data);
    }
}

function _sendCommand(i){
    return ledCharc.writeValue(i);
}