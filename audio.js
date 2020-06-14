// const file = document.getElementById("file-input");
// const audio = document.querySelector('audio');

// // for legacy browsers
// try
// {
//     window.AudioContext = window.AudioContext || window.webkitAudioContext;
//     var mycontext = new AudioContext();
// }
// catch(e)
// {
//     alert("Your browser doesn't support Web Audio API");
// }

// const files = this.files; // FileList containing File objects selected by the user (DOM File API)
// console.log('FILES[0]: ', files[0])
// audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object

// const name = files[0];

// let src = mycontext.createMediaElementSource(audio); // Give the audio context an audio source,
// // to which can then be played and manipulated
// const analyser = mycontext.createAnalyser(); // Create an analyser for the audio context

// src.connect(analyser); // Connects the audio context source to the analyser
// analyser.connect(mycontext.destination); // End destination of an audio graph in a given context
// // Sends sound to the speakers or headphones


// /////////////// ANALYSER FFTSIZE ////////////////////////
// analyser.fftSize = 32;


// const bufferLength = analyser.frequencyBinCount;
// const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array

// // At this point dataArray is an array with length of bufferLength but no values
// console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!

// function renderFrame(){
//     analyser.getByteFrequencyData(dataArray); // Gets the freqyency data into the data rray
//     console.log(dataArray[dataArray.length/2]);
// }

// if(!mycontext.state === 'suspended'){
//     audio.play();
//     setInterval(renderFrame, 60);
// }else
// {
//     console.log("State is suspended");
// }


let context;
let source;
let analyser;
var soundBuffer;
const audio = document.querySelector('audio');


window.addEventListener('touchstart', function() {
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    getData();

    // play the file: This is what unlocks the context
    context.resume;
    console.log(context.state);

    if( context.state === "running"){
        play();

        // Initalize nodes
        var sourceJs = context.createScriptProcessor(2048, 1, 1);

        // Initalize analysier
        analyser = context.createAnalyser(); 
        analyser.smoothingTimeConstant = 0.6;
        analyser.fftSize = 512;

        // Connect nodes
        source.connect(analyser);
        analyser.connect(sourceJs);

        // Connect nodes to destinations
        source.connect(context.destination);
        sourceJs.connect(context.destination);
        // End destination of an audio graph in a given context

        sourceJs.onaudioprocess = function(e){

            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            console.log('DATA-ARRAY: ', array) // Check out this array of frequency values!
            renderFrames(array);
        };
    }
    
    // At this point dataArray is an array with length of bufferLength but no values
    // console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!
}, false);


function renderFrames(dataArray){
    console.log(dataArray);
} 

function play(){
    source = context.createBufferSource();
    source.buffer = soundBuffer;
    source.connect(context.destination);

    source.start(0);
}
/**
 * getData
 * Does an XML http request to fetch the required audio file
 * Populates context with the required audio file
 * Populates source with data stream from audio file
 */
function getData(){
    // Initalize buffer for source
    // source = context.createBufferSource();

    // Initalize request
    var request = new XMLHttpRequest();
    request.open('GET', 'elijah who - skateboard p.mp3', true);
    request.responseType = 'arraybuffer';

    // Fetch request
    request.onload = function(){
        var data = request.response;

        context.decodeAudioData(data, function(buffer){
            soubdBuffer = buffer;
        }, 
        function(e){
            console.log("There has been an error: "+ e);
        });
    };
}

function getDataFromAudio(){
    // Initalize context 
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    source = context.createMediaElementSource(this.audio.base); // Give the audio context an audio source,
    // to which can then be played and manipulated
    const analyser = context.createAnalyser(); // Create an analyser for the audio context
    
    source.connect(analyser); // Connects the audio context source to the analyser
}

function renderFrame(dataArray){
        analyser.getByteFrequencyData(dataArray); // Gets the freqyency data into the data rray
        console.log(dataArray[dataArray.length/2]);
    }

function webAudioTouchUnlock (context)
{
    return new Promise(function (resolve, reject)
    {
        if (context.state === 'suspended' && 'ontouchstart' in window)
        {
            var unlock = function()
            {
                context.resume().then(function()
                {
                    document.body.removeEventListener('touchstart', unlock);
                    document.body.removeEventListener('touchend', unlock);

                    resolve(true);
                }, 
                function (reason)
                {
                    reject(reason);
                });
            };

            document.body.addEventListener('touchstart', unlock, false);
            document.body.addEventListener('touchend', unlock, false);
        }
        else
        {
            resolve(false);
        }
    });
}