
// window.onload = function(){
//     const file = document.getElementById("file-input");
//     const audio = document.getElementById("audio");

//     file.onchange = function(){

//         const context = new AudioContext(); // Initalize context
//         let src = context.createMediaElementSource(audio); // Provide source to context

//         const analyser = context.createAnalyser(); // Create an analyser to analyse the audio context 


//         src.connect(analyser); // Connect the source and the analyser
//         analyser.connect(context.destination) // Where the audio should go...


//         // Analyser settings
//         analyser.fftSize = 16384;
//         // analyser.minDecibels(0);
//         // analyser.maxDecibels(100);

//         const bufferLength = analyser.frequencyBinCount;

//         const dataArray = new Uint8Array(bufferLength);

//         audio.play();
        
//         analyser.getByteFrequencyData(dataArray);
//         console.log('Data-Array: ' + dataArray);

       
//     }
// }

window.onload = function(){
    // Initalize instance of audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    // Load sound
    const audioElement = document.querySelector('audio'); // Getting audio element
    const track = audioContext.createMediaElementSource(audioElement) // Passing audio element into context

    // Add controles
    const playButton = document.querySelector('button')
    playButton.addEventListener('click', function(){

        // For auto play check if the audio is suspended 
        if (audioContext.state === 'suspended'){
            audioContext.resume();
        }

        // Play or pause music
        if(this.dataset.playing === 'false'){
            audioElement.play();
            this.dataset.playing = 'true';
        }
        else if (this.dataset.playing === 'true'){
            audioElement.pause();
            this.dataset.playing = 'false';
        }
    }, false);

    // Account for when track ends
    audioElement.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
    }, false);
}