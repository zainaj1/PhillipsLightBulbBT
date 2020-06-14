// var context;
// window.onload = function() {

//     const file = document.getElementById("file-input");
//     // const audio = document.etElementById("audio");

//     const audio = document.querySelector('audio');

//     file.onchange = function() {
  
//         const files = this.files; // FileList containing File objects selected by the user (DOM File API)
//         console.log('FILES[0]: ', files[0])
//         audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object

//         const name = files[0];

//         // for legacy browsers

//         try
//         {
//             window.AudioContext = window.AudioContext || window.webkitAudioContext;
//             context = new AudioContext();
//         }
//         catch(e)
//         {
//             alert("Your browser doesn't support Web Audio API");
//         }

//         // You need to unlock the context 
//         window.addEventListener('touchstart', function() {

//             // create empty buffer
//             var buffer = context.createBuffer(1, 1, 22050);
//             var source = context.createBufferSource();
//             source.buffer = buffer;
        
//             // connect to output (your speakers)
//             source.connect(context.destination);
        
//             // play the file
//             source.start(0);
//             context.resume();
//         }, false);

//         let src = context.createMediaElementSource(audio); // Give the audio context an audio source,
//         // to which can then be played and manipulated
//         const analyser = context.createAnalyser(); // Create an analyser for the audio context

//         src.connect(analyser); // Connects the audio context source to the analyser
//         analyser.connect(context.destination); // End destination of an audio graph in a given context
//         // Sends sound to the speakers or headphones


//         /////////////// ANALYSER FFTSIZE ////////////////////////
//         analyser.fftSize = 32;
//         // analyser.fftSize = 64;
//         // analyser.fftSize = 128;
//         // analyser.fftSize = 256;
//         // analyser.fftSize = 512;
//     //   analyser.fftSize = 1024;
//         // analyser.fftSize = 2048;
//         // analyser.fftSize = 4096;
//         // analyser.fftSize = 8192;
//     //   analyser.fftSize = 16384;
//     //   analyser.fftSize = 32768;

//         // (FFT) is an algorithm that samples a signal over a period of time
//         // and divides it into its frequency components (single sinusoidal oscillations).
//         // It separates the mixed signals and shows what frequency is a violent vibration.

//         // (FFTSize) represents the window size in samples that is used when performing a FFT

//         // Lower the size, the less bars (but wider in size)
//         ///////////////////////////////////////////////////////////


//         const bufferLength = analyser.frequencyBinCount; // (read-only property)
//         // Unsigned integer, half of fftSize (so in this case, bufferLength = 8192)
//         // Equates to number of data values you have to play with for the visualization

//         // The FFT size defines the number of bins used for dividing the window into equal strips, or bins.
//         // Hence, a bin is a spectrum sample, and defines the frequency resolution of the window.

//         const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array
//         // At this point dataArray is an array with length of bufferLength but no values
//         console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!

//         function renderFrame(){
//             analyser.getByteFrequencyData(dataArray); // Gets the freqyency data into the data rray
//             console.log(dataArray[dataArray.length/2]);
//         }
       
//         // src.noteOn(0);
//         audio.play();
//         setInterval(renderFrame, 60);
//     };
//   };
  

(function() {
    const _af_buffers = new Map(),
        _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let _isUnlocked = false;
    _unlockAudio();
    /**
     * A shim to handle browsers which still expect the old callback-based decodeAudioData,
     * notably iOS Safari - as usual.
     * @param arraybuffer
     * @returns {Promise<any>}
     * @private
     */
    function _decodeShim(arraybuffer) {
        return new Promise((resolve, reject) => {
            _audioCtx.decodeAudioData(arraybuffer, (buffer) => {
                return resolve(buffer);
            }, (err) => {
                return reject(err);
            });
        });
    }

    /**
     * Some browsers/devices will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * Borrows in part from: https://github.com/goldfire/howler.js/blob/master/src/howler.core.js
     */
    function _unlockAudio() {
        if (_isUnlocked) return;

        // Scratch buffer to prevent memory leaks on iOS.
        // See: https://stackoverflow.com/questions/24119684/web-audio-api-memory-leaks-on-mobile-platforms
        const _scratchBuffer = _audioCtx.createBuffer(1, 1, 22050);

        // We call this when user interaction will allow us to unlock
        // the audio API.
        var unlock = function (e) {
            var source = _audioCtx.createBufferSource();
            source.buffer = _scratchBuffer;
            source.connect(_audioCtx.destination);

            // Play the empty buffer.
            source.start(0);

            // Calling resume() on a stack initiated by user gesture is
            // what actually unlocks the audio on Chrome >= 55.
            if (typeof _audioCtx.resume === 'function') {
                _audioCtx.resume();
            }
            console.log("Thins has be unlocked");

            // Once the source has fired the onended event, indicating it did indeed play,
            // we can know that the audio API is now unlocked.
            source.onended = function () {
                source.disconnect(0);

                // Don't bother trying to unlock the API more than once!
                _isUnlocked = true;

                // Remove the click/touch listeners.
                document.removeEventListener('touchstart', unlock, true);
                document.removeEventListener('touchend', unlock, true);
                document.removeEventListener('click', unlock, true);
            };
        };

        // Setup click/touch listeners to capture the first interaction
        // within this context.
        document.addEventListener('touchstart', unlock, true);
        document.addEventListener('touchend', unlock, true);
        document.addEventListener('click', unlock, true);
    }

    const file = document.getElementById("file-input");
        // const audio = document.etElementById("audio");
    const audio = document.querySelector('audio');

    /**
     * Play the specified file, loading it first - either retrieving it from the saved buffers, or fetching
     * it from the network.
     * @param sfxFile
     * @returns {Promise<AudioBufferSourceNode>}
     */
    file.onchange = function() {

        const files = this.files; // FileList containing File objects selected by the user (DOM File API)
        console.log('FILES[0]: ', files[0])
        audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object

        const name = files[0];

        let sourceNode = _audioCtx.createMediaElementSource(audio); // Give the audio context an audio source,
        // to which can then be played and manipulated
        const analyser = _audioCtx.createAnalyser(); // Create an analyser for the audio context

        sourceNode.connect(analyser); // Connects the audio context source to the analyser
        analyser.connect(_audioCtx.destination); // End destination of an audio graph in a given context
        audio.play();
    };

    _unlockAudio();
}());