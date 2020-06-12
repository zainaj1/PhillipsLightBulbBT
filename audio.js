window.onload = function() {

    const file = document.getElementById("file-input");
    const audio = document.getElementById("audio");
  
    file.onchange = function() {
  
      const files = this.files; // FileList containing File objects selected by the user (DOM File API)
      console.log('FILES[0]: ', files[0])
      audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object
  
      const name = files[0];

      // for legacy browsers
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();

      let src = context.createMediaElementSource(audio); // Give the audio context an audio source,
      // to which can then be played and manipulated
      const analyser = context.createAnalyser(); // Create an analyser for the audio context
  
      src.connect(analyser); // Connects the audio context source to the analyser
      analyser.connect(context.destination); // End destination of an audio graph in a given context
      // Sends sound to the speakers or headphones
  
  
      /////////////// ANALYSER FFTSIZE ////////////////////////
      // analyser.fftSize = 32;
      // analyser.fftSize = 64;
      // analyser.fftSize = 128;
      // analyser.fftSize = 256;
      // analyser.fftSize = 512;
      // analyser.fftSize = 1024;
      // analyser.fftSize = 2048;
      // analyser.fftSize = 4096;
      // analyser.fftSize = 8192;
      analyser.fftSize = 16384;
      // analyser.fftSize = 32768;
  
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
            console.log(dataArray[dataArray.length/4]);
            console.log(dataArray[dataArray.length/6]);
            console.log(dataArray[dataArray.length/8]);
            console.log(dataArray[dataArray.length - 10]);
            console.log(dataArray[dataArray.length - 20]);
            console.log("New line");
        }

      audio.play();
      setInterval(renderFrame, 300);
    };
  };
  

// window.onload = function(){
//     const file = document.getElementById("file-input");
//     const audio = document.getElementById("audio");

//     file.onchange = function(){
//         // Initalize instance of audio context
//         const AudioContext = window.AudioContext || window.webkitAudioContext;
//         const audioContext = new AudioContext();

//         // Load sound
//         const audioElement = document.querySelector('audio'); // Getting audio element
//         const track = audioContext.createMediaElementSource(audioElement) // Passing audio element into context

//         // Add controles
//         const playButton = document.querySelector('button')
//         playButton.addEventListener('click', function(){
//             audioContext.resume().then(() => {
//                 console.log('Playback resumed');
//             })

//             // For auto play check if the audio is suspended 
//             if (audioContext.state === 'suspended'){
//                 audioContext.resume();
//             }

//             // Play or pause music
//             if(this.dataset.playing === 'false'){
//                 audioElement.play();
//                 this.dataset.playing = 'true';
//             }
//             else if (this.dataset.playing === 'true'){
//                 audioElement.pause();
//                 this.dataset.playing = 'false';
//             }
//         }, false);

//         // Account for when track ends
//         audioElement.addEventListener('ended', () => {
//             playButton.dataset.playing = 'false';
//         }, false);
//     } // file on change
// } // End window load