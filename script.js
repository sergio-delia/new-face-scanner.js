const video = document.getElementById('video');

Promise.all([

    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    faceapi.nets.ageGenderNet.loadFromUri('./models')

]).then(startVideo);

function startVideo(){
    navigator.getUserMedia(
        { video: {} },
    stream => video.srcObject = stream, 
    err =>{
        console.error(err);
    })
}

video.addEventListener('play', ()=>{

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height}

    faceapi.matchDimensions(canvas, displaySize);


    const box = { x: 50, y: 50, width: 0, height: 0 }




    setInterval(async ()=>{

        const detections = await faceapi.detectAllFaces(video,
         new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
        console.log(detections[0].gender);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);


        // see DrawBoxOptions below
const drawOptions = {
    label: `Sesso: ${detections[1].gender}`,
    lineWidth: 2
  }
  const drawBox = new faceapi.draw.DrawBox(box, drawOptions)
  drawBox.draw(canvas);




    }, 100);
})

//startVideo();