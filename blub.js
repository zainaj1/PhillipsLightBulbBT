// this tries to find all devices
// TODO: Add a filter just for the bulbs
function connect(){
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true
    })
    .then(device => { 
        // Get name of device
        console.log(device.name);
    
        // Connect to remote GATT Server
        return device.gatt.connect();
    })
    .then(server => {
        /* ... */
    })
    .catch(error => {console.log(error); });
}
