let context;
let source;
let analyser;
var soundBuffer;
const audio = document.querySelector('audio');
var loaded = false;
var loading = false;
var freq = document.getElementById("myNumber").value;

window.addEventListener('touchstart', function() {
    if(connected){
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
            // analyser.smoothingTimeConstant = 0.6;
            analyser.fftSize = 32; 

            var sourceJs = context.createScriptProcessor(0, 1, 1);

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
    }
    else{
        console.log("not connected");
    }
}, false);


function renderFrames(dataArray){
    if(ledCharc){
        // var sum = 0;
        // for(i=0; i<dataArray.length; i++){
        //     sum += dataArray[i];
        // }
        // var data = new Uint8Array([Math.floor(sum/dataArray.length)]);

        var value = dataArray[freq];

        if(value <= 0){
            value = 1;
        }
        else if (value >= 255){
            value = 254;
        }

        var data = new Uint8Array([value]);

        _sendCommand(data);
        // console.log(1);
    }else{
        // console.log(dataArray.length);
        var data = new Uint8Array([dataArray[freq]]);
        console.log(dataArray[freq]);
    }
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

    function changeFreq(){
        freq = document.getElementById("myNumber").value;
        console.log("frequency changed to: "+freq);
    }
}