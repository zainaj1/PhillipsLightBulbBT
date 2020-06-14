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

window.addEventListener('touchstart', function() {
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
	// create empty buffer
	var buffer = context.createBuffer(1, 1, 22050);
	var source = context.createBufferSource();
	source.buffer = buffer;

	// connect to output (your speakers)
	source.connect(context.destination);

    // play the file
    context.resume;
    source.start(0);
    console.log(context.state);

}, false);

/**
 * getData
 * Does an XML http request to fetch the required audio file
 * Populates context with the required audio file
 * Populates source with data stream from audio file
 */
function getData(){
    // Initalize context 
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    // Initalize buffer for source
    source = context.createBufferSource();

    // Initalize request
    var request = new XMLHttpRequest();
    request.open('GET', 'elijah who - skateboard p.mp3', true);
    request.responseType = 'arraybuffer';

    // Fetch request
    request.onload = function(){
        var data = request.response;

        context.decodeAudioData(data, function(buffer){
            source.buffer = buffer;

            source.connect(context.destination);
        }, 
        function(e){
            console.log("There has been an error: "+ e);
        });
    }   
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