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
        console.log("Getting primary service 0xFE0F");
        return server.getPrimaryService(0xFE0F);
    })
    .then(service => {
        console.log("Getting Service 0x932c32BD-0007-47A2-835A-A8D455B859DD");
        
        return service.getCharacteristic(0x932c32BD000747A2835AA8D455B859DD);
    })
    .catch(error => {console.log(error); });
}
