let index = 0;
const list_mp3 = ["assets/mp3/bai1.mp3", "assets/mp3/bai2.mp3", "assets/mp3/bai3.mp3","assets/mp3/bai4.mp3","assets/mp3/bai5.mp3"];
let stream_ = null; 
let intervalId = null;
let smooth_x = 0;
let smooth_y = 0;
let funtionAi = 0;
let time_delay = true
let intervalIdNextPre = null

document.addEventListener("DOMContentLoaded", function() {
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    const seekBar = document.querySelector('.main .main__box .main__box--timeline .timeline__seekBar');
    

    setSizeIcon();

    checkOrientation()
    window.addEventListener("orientationchange", function () {
        this.setTimeout(checkOrientation,300)
    });

    audio.addEventListener('play', () => requestAnimationFrame(updateSeekBar));
    seekBar.addEventListener('input', () => {
        const val = seekBar.value;
        audio.currentTime = (val / 100) * audio.duration;
    });


    
    
});


async function toggleAiFuction(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const video = document.getElementById('video');


    if (stream_) {
        stream_.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream_ = null;
        clearInterval(intervalId);
        intervalId = null;
        alert("Da dong camera!")
    }else{
        try{
            stream_ = await navigator.mediaDevices.getUserMedia({ video: true })
            video.srcObject = stream_;
            await new Promise(resolve => {
                video.onloadedmetadata = () => {
                    resolve();
                };
            });
            const width = video.videoWidth
            const height = video.videoHeight
            intervalId = setInterval(() => {
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(video, 0, 0, width, height);
    
                canvas.toBlob(blob => {
                    const formData = new FormData();
                    formData.append("image", blob, "frame.jpg");
                    // formData.append("smooth_x", smooth_x.toString());
                    // formData.append("smooth_y", smooth_y.toString());
        
                    fetch('/thread-ai-funtion', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then((data)=>{
                        if(data){
                            console.log(data.funtionAI)
                            // smooth_x = data.smooth_x;
                            // smooth_y = data.smooth_y;
                            funtionAi = data.funtionAI;
                            if(data.funtionAI===1){
                                play()
                            }else if(data.funtionAI===2){
                                pause()
                            }else if(data.funtionAI===3){
                                if(time_delay){
                                    next()
                                    time_delay = false
                                    intervalIdNextPre = setInterval(()=>{
                                        time_delay = true
                                    },1000)
                                }
                            }else if(data.funtionAI===4){
                                pre()
                            }


                        }
                    });
                }, 'image/jpeg');
            }, 300);
            alert("khoi dong camera xong!")
        }catch(err){
            if (err.name === "NotReadableError") {
            alert("Khoi dong lai camera");
            setTimeout(toggleAiFuction, 300);
        } else {
            console.error(err);
        }
        }
        
    }

}


function updateSeekBar() {
    const seekBar = document.querySelector('.main .main__box .main__box--timeline .timeline__seekBar');
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    seekBar.value = (audio.currentTime / audio.duration) * 100;
    if (!audio.paused && !audio.ended) {
        requestAnimationFrame(updateSeekBar);
    }
}


function play() {
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    if (audio.paused) {
        audio.play();
    }
}
function pause() {
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    audio.pause()
}


async function next(){
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    if(index == (list_mp3.length - 1)){
        index = 0
    }else{
        index += 1
    } 
    audio.src = list_mp3[index]
    audio.load();
    await waitForAudioToLoad(audio); 
    audio.play();
}


async function pre(){
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    if(index == (list_mp3.length - 1)){
        index = 0
    }else{
        index += 1
    } 
    audio.src = list_mp3[index]
    audio.load();
    await waitForAudioToLoad(audio); 
    audio.play();
}


function setSizeIcon(){
    if(window.innerWidth > window.innerHeight){
        const backgr = document.querySelector(".background .background__iconmid").classList.add('background__iconmid--size2')
    }else{
        const backgr = document.querySelector(".background .background__iconmid").classList.add('background__iconmid--size1')
    }
    window.addEventListener("resize", function() {
        if(window.innerWidth > window.innerHeight){
            const backgr = document.querySelector(".background .background__iconmid").classList.add('background__iconmid--size2')
        }else{
            const backgr = document.querySelector(".background .background__iconmid").classList.add('background__iconmid--size1')
        }
    });
}


function checkOrientation(){
    if (window.matchMedia("(orientation: portrait)").matches) {
        document.querySelector(".warrning").classList.add("warrning__display")
    }else{
        document.querySelector(".warrning").classList.remove("warrning__display")
    }
}


function waitForAudioToLoad(audioElement) {
    return new Promise((resolve) => {
        audioElement.onloadeddata = () => {
        resolve();
        };
    });
}

