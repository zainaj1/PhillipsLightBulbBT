const file = document.getElementById("file-input");
const audio = document.querySelector('audio');

// for legacy browsers
try
{
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var mycontext = new AudioContext();
}
catch(e)
{
    alert("Your browser doesn't support Web Audio API");
}

file.onchange = function() {
    webAudioTouchUnlock(mycontext);
    const files = this.files; // FileList containing File objects selected by the user (DOM File API)
    console.log('FILES[0]: ', files[0])
    audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object
    
    const name = files[0];

    let src = mycontext.createMediaElementSource(audio); // Give the audio context an audio source,
    // to which can then be played and manipulated
    const analyser = mycontext.createAnalyser(); // Create an analyser for the audio context

    src.connect(analyser); // Connects the audio context source to the analyser
    analyser.connect(mycontext.destination); // End destination of an audio graph in a given context
    // Sends sound to the speakers or headphones


    /////////////// ANALYSER FFTSIZE ////////////////////////
    analyser.fftSize = 32;
    // analyser.fftSize = 64;
    // analyser.fftSize = 128;
    // analyser.fftSize = 256;
    // analyser.fftSize = 512;
//   analyser.fftSize = 1024;
    // analyser.fftSize = 2048;
    // analyser.fftSize = 4096;
    // analyser.fftSize = 8192;
//   analyser.fftSize = 16384;
//   analyser.fftSize = 32768;

    // (FFT) is an algorithm that samples a signal over a period of time
    // and divides it into its frequency components (single sinusoidal oscillations).
    // It separates the mixed signals and shows what frequency is a violent vibration.

    // (FFTSize) represents the window size in samples that is used when performing a FFT

    // Lower the size, the less bars (but wider in size)
    ///////////////////////////////////////////////////////////


    const bufferLength = analyser.frequencyBinCount; // (read-only property)
    // Unsigned integer, half of fftSize (so in this case, bufferLength = 8192)
    // Equates to number of data values you have to play with for the visualization

    // The FFT size defines the number of bins used for dividing the window into equal strips, or bins.
    // Hence, a bin is a spectrum sample, and defines the frequency resolution of the window.

    const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array
    // At this point dataArray is an array with length of bufferLength but no values
    console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!

    function renderFrame(){
        analyser.getByteFrequencyData(dataArray); // Gets the freqyency data into the data rray
        console.log(dataArray[dataArray.length/2]);
    }
    audio.play();
    setInterval(renderFrame, 60);
};

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