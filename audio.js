
window.onload = function(){
    const file = document.getElementById("file-input");
    const audio = document.getElementById("audio");

    file.onchange = function(){

        const context = new AudioContext(); // Initalize context
        let src = context.createMediaElementSource(audio); // Provide source to context

        const analyser = context.createAnalyser(); // Create an analyser to analyse the audio context 


        src.connect(analyser); // Connect the source and the analyser
        analyser.connect(context.destination) // Where the audio should go...


        // Analyser settings
        analyser.fftSize = 16384;
        // analyser.minDecibels(0);
        // analyser.maxDecibels(100);

        const bufferLength = analyser.frequencyBinCount;

        const dataArray = new Uint8Array(bufferLength);

        audio.play();
        
        analyser.getByteFrequencyData(dataArray);
        console.log('Data-Array: ' + dataArray);

       
    }
}
