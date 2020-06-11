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
        console.log("Getting Service 0x932c32BD-0007-47A2-835A-A8D455B859DD");
        return ServiceUIFrameContext.getCharacteristic(0x932c32BD);
    })
    .then(characteristic => {
        console.log("All ready");
    })
    .catch(error => {console.log(error); });
}
