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
        // Access light turning on/off service
        console.log("Getting primary service " + serv.toString(16));
        return server.getPrimaryServices();
    })
    .then(services => {
        // console.log(services)
        // Get characteristic to communicate with
        
        for(s in services){
            console.log(s.uuid);
        }

        console.log("Getting characteristic " + charc.toString(16));
        return services.getCharacteristic(charc);
        
    })
    .then(characteristic => {
        console.log("sent command");
        var data = new Uint8Array([0x01, 0x01, 0x00, 0x05, 0x02, 0x02, 0x00])
        return characteristic.writeValue(data);
    })
    .catch(error => {console.log("Something when wrong: " + error); });
}


// User input for serivce
function setService(){
    serv = Number(document.getElementById("service").value);
    console.log("service set to: "+serv.toString(16));
}
// User input for characteristic
function setCharacteristic(){
    charc = Number(document.getElementById("Characteristic").value);
    console.log("characteristic set to: "+charc.toString(16));
}


// Light functions
function turnOn(){
    console.log("Not initalized");
}
function turnOff(){
    console.log("Not initalized")
}
