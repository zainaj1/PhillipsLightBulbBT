// this tries to find all devices
// TODO: Add a filter just for the bulbs


// Initalize variables:
var serv = '932c32bd-0000-47a2-835a-a8d455b859dd';
var charc = '932c32bd-0003-47a2-835a-a8d455b859dd';
var ledCharc;
var onOff = false;
var connected = true; // Change to false when using in website
var freq = document.getElementById("myNumber").value;

function connect(){
    navigator.bluetooth.requestDevice({
        filters:[{services: [0xFE0F]}]
    })
    .then(device => { 
        // Get name of device
        console.log(device.name);

        // Connect to remote GATT Server
        return device.gatt.connect();
    })
    .then(server => {
        // Access light turning on/off service
        console.log("Getting primary service " + serv);
        return server.getPrimaryService(serv);
    })
    .then(service => {
        console.log("Acceced: "+service.uuid);
        // Get characteristic to communicate with
        console.log("Getting characteristic " + charc);
        return service.getCharacteristic(charc);
    })
    .then(characteristic => {
        ledCharc = characteristic;
        console.log("sent command");

        var data = new Uint8Array([0x12]);
        if(onOff){
            data = new Uint8Array([0x01, 0x01, 0x00, 0x05, 0x02, 0x02, 0x00]);
        }
        
        connected = true;
        return characteristic.writeValue(data);
    })
    .catch(error => {console.log("Something whent wrong: " + error); });
}


// User input for serivce
function OnOff(){
    charc = '932c32bd-0007-47a2-835a-a8d455b859dd';
    console.log("characteristic set to: "+charc);
    document.getElementById("connect").disabled = false;
    document.getElementById("on").disabled = false;
    document.getElementById("off").disabled = false;

    document.getElementById("fireplace").disabled = true;

    firePlace = false;
    onOff = true;
}
// User input for characteristic
function Dim(){
    charc = '932c32bd-0003-47a2-835a-a8d455b859dd';
    console.log("characteristic set to: "+charc);
    document.getElementById("connect").disabled = false;
    document.getElementById("fireplace").disabled = false;

    document.getElementById("on").disabled = true;
    document.getElementById("off").disabled = true;
    
    onOff = false;
}


// Light functions
function turnOn(){
    var data = new Uint8Array([0x01, 0x01, 0x01, 0x05, 0x02, 0x02, 0x00])
    console.log("Light turned on");
    return ledCharc.writeValue(data)
}
function turnOff(){
    var data = new Uint8Array([0x01, 0x01, 0x00, 0x05, 0x02, 0x02, 0x00]);
    console.log("Light turned off");
    return ledCharc.writeValue(data)
}

var fireplace = false;
function firePlace(){
    fireplace = !fireplace;
    
    while(firePlace){
        var data = new Uint8Array([Math.floor(Math.random() *254) + 1]);
        _sendCommand(data);
        // console.log(data);
    }
}

function changeFreq(){
    freq = document.getElementById("myNumber").value;
    console.log("frequency changed to: "+freq);
}

function _sendCommand(i){
    return ledCharc.writeValue(i);
}