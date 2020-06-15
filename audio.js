// window.addEventListener('touchstart', function() {

//     window.AudioContext = window.AudioContext || window.webkitAudioContext;

//     if(mycontext.state === "suspended"){
//         // Initialize audio context
//     var mycontext = new AudioContext();
//     // mycontext.resume
    
//     // Get the element from the DOM
//     var audioElement = document.getElementById('audio');
    
//     // Create a node based on the element
//     var src = mycontext.createMediaElementSource(audioElement);
//     // source.connect(context.destination);
//     }
    
//     audio.play();
//     mycontext.resume;
    
//     console.log(mycontext.state);

//     // to which can then be played and manipulated
//     const analyser = mycontext.createAnalyser(); // Create an analyser for the audio context

//     src.connect(analyser); // Connects the audio context source to the analyser
//     analyser.connect(mycontext.destination); // End destination of an audio graph in a given context
//     // Sends sound to the speakers or headphones


//     /////////////// ANALYSER FFTSIZE ////////////////////////
//     analyser.fftSize = 32;

//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array

//     // At this point dataArray is an array with length of bufferLength but no values
//     console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!

//     function renderFrame(){
//         analyser.getByteFrequencyData(dataArray); // Gets the freqyency data into the data rray
//         console.log(dataArray[dataArray.length/2]);
//     }

//     if(mycontext.state === 'running'){
//         audio.play();
//         setInterval(renderFrame, 60);
//     }else
//     {
//         console.log("State is suspended");
//     }

// }, false);


let context;
let source;
let analyser;
var soundBuffer;
const audio = document.querySelector('audio');
var loaded = false;
var loading = false;



window.addEventListener('touchstart', function() {
    if (source == null && !loading){
        console.log("Made new context");
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    }
    console.log(context.state);
    
    if(context.state === "suspended" && !loaded){
        console.log("Populate context");
        getData();
        // play the file: This is what unlocks the context 
    }
    else if(loaded && context.state === "suspended"){
        console.log("Set running");
        console.log("Set running");
        context.resume;
        source.start(0);
        // audio.play();
    }
    
    if( context.state === "running" && source != null){
        console.log("HEre");
        console.log(source.buffer);
        // Initalize nodes
         // Initalize analysier
        analyser = context.createAnalyser(); 
        analyser.smoothingTimeConstant = 0.6;
        analyser.fftSize = 32; 

        var sourceJs = context.createScriptProcessor(2048, 1, 1);

        // Connect nodes
        source.connect(analyser);
        analyser.connect(sourceJs);

        // Connect nodes to destinations
        source.connect(context.destination);
        sourceJs.connect(context.destination);
        // End destination of an audio graph in a given context
        
        sourceJs.onaudioprocess = function(audioProcessingEvent){
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            // console.log('DATA-ARRAY: ', array) // Check out this array of frequency values!
            renderFrames(array);
        };
    }
    
    // At this point dataArray is an array with length of bufferLength but no values
    // console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!
}, false);


function renderFrames(dataArray){
    var sum = 0;
    for(i=0; i<dataArray.length; i++){
        sum += dataArray[i];
    }
    var data = new Uint8Array([Math.Floor(sum/dataArray.length)]);
    // _sendCommand(data);
        console.log(data);

    // if(ledCharc){
    //     var sum = 0;
    //     for(i=0; i<dataArray.length; i++){
    //         sum += dataArray[i];
    //     }
    //     var data = new Uint8Array([Math.Floor(sum/dataArray.length)]);
    //     _sendCommand(data);
    //     // console.log(1);
    // }
} 

function init(){
    // Initalize source
    source = context.createBufferSource();
    source.buffer = soundBuffer;
    source.connect(context.destination);
    loaded = true;
}

/**
 * getData
 * Does an XML http request to fetch the required audio file
 * Populates context with the required audio file
 * Populates source with data stream from audio file
 */
function getData(){
    // Initalize buffer for source
    loading = true;
    // Initalize request
    var request = new XMLHttpRequest();
    request.open('GET', 'elijah who - skateboard p.mp3', true);
    request.responseType = 'arraybuffer';

    // Fetch request
    request.onload = function(){
        var data = request.response;

        context.decodeAudioData(data, function(buffer){
            soundBuffer = buffer;
            init();
            console.log(soundBuffer);
        }, 
        function(e){
            console.log("There has been an error: "+ e);
        });
    }
    request.send();
    console.log("Request Data: " + request.response);
}