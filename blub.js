// this tries to find all devices
// TODO: Add a filter just for the bulbs
function connect(){


    navigator.bluetooth.requestDevice({
        acceptAllDevices: document.getElementById("acceptAll"),
        filters:[{services: [0xFE0F]}]
    })
    .then(device => { 
        // Get name of device
        console.log(device.name);
    
        // Connect to remote GATT Server
        return device.gatt.connect();
    })
    .then(server => {
        var serviceCode = parseInt(prompt("Enter the serivce you would like to connet too: "), 16);
        
        if(serviceCode == null){
            serviceCode = 0xFE0F;
        }
        
        console.log("Getting primary service " + serviceCode);
        return server.getPrimaryService(serviceCode);
    })
    .then(service => {
        var characteristicCode = parseInt(prompt("Enter the characteristic you would like to connect too: "), 16);
        
        if(characteristicCode == null){
            characteristicCode = 0x932C32BD000747A2835AA8D455B859DD;
        }
        
        console.log("Getting characteristic " + characteristicCode);
        return service.getCharacteristic(characteristicCode);
    })
    .catch(error => {console.log(error); });
}
