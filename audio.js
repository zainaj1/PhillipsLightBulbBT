var context;
window.onload = function() {

    const file = document.getElementById("file-input");
    // const audio = document.etElementById("audio");

    const audio = document.querySelector('audio');

    file.onchange = function() {
  
        const files = this.files; // FileList containing File objects selected by the user (DOM File API)
        console.log('FILES[0]: ', files[0])
        audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object

        const name = files[0];

        // for legacy browsers

        try
        {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
        }
        catch(e)
        {
            alert("Your browser doesn't support Web Audio API");
        }

        // You need to unlock the context 
        window.addEventListener('touchstart', function() {

            // create empty buffer
            var buffer = context.createBuffer(1, 1, 22050);
            var source = context.createBufferSource();
            source.buffer = buffer;
        
            // connect to output (your speakers)
            source.connect(context.destination);
        
            // play the file
            source.start(0);
            context.resume();
        }, false);

        let src = context.createMediaElementSource(audio); // Give the audio context an audio source,
        // to which can then be played and manipulated
        const analyser = context.createAnalyser(); // Create an analyser for the audio context

        src.connect(analyser); // Connects the audio context source to the analyser
        analyser.connect(context.destination); // End destination of an audio graph in a given context
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
       
        // src.noteOn(0);
        audio.play();
        setInterval(renderFrame, 60);
    };
  };
  

// const _audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// const file = document.getElementById("file-input");
// const audio = document.etElementById("audio");

// const files = this.files; // FileList containing File objects selected by the user (DOM File API)
// console.log('FILES[0]: ', files[0])
// audio.src = URL.createObjectURL(files[0]);

//     /**
//      * Load and play the specified file.
//      * @param sfxFile
//      * @returns {Promise<AudioBufferSourceNode>}
//      */
//     function play (sfxFile) {
//         return load(sfxFile).then((arrayBuffer) => {
//             const buffer = context.createBuffer(1, 1, 22050);
//             const source = context.createBufferSource();

//             source.buffer = buffer;
//             source.connect(_audioCtx.destination);
//             source.start();

//             return source;
//         });
//     };