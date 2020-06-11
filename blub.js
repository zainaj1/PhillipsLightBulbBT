// this tries to find all devices
// TODO: Add a filter just for the bulbs
function connect(){
    navigator.bluetooth.requestDevice({
        filters:[{
            services: [0x02ffff1002]
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
        return server.getPrimaryService(0x02ffff1002);
    })
    .then(service => {
        console.log("Getting Service 0x932c32BD...");
        return service.getCharacteristic(0x932C32BD000747A2835AA8D455B859DD);
    })
    .catch(error => {console.log(error); });
}
