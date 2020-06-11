// this tries to find all devices
// TODO: Add a filter just for the bulbs
function connect(){
    navigator.bluetooth.requestDevice({
        filters:[{
            services: [0xFE0F]
        }]
    })
    .then(device => { 
        // Get name of device
        console.log(device.name);
    
        // Connect to remote GATT Server
        return device.gatt.connect();
    })
    .then(server => {
        var serviceCode = window.prompt("Enter the serivce you would like to connet too: ");
        console.log("Getting primary service " + serviceCode);
        return server.getPrimaryService(serviceCode);
    })
    .then(service => {
        var characteristicCode = window.prompt("Enter the characteristic you would like to connect too: ");
        console.log("Getting characteristic " + characteristicCode);
        return service.getCharacteristic(characteristicCode);
    })
    .catch(error => {console.log(error); });
}
