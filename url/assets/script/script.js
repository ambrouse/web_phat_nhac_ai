let index = 0;
const list_mp3 = ["assets/mp3/bai1.mp3", "assets/mp3/bai2.mp3", "assets/mp3/bai3.mp3","assets/mp3/bai4.mp3","assets/mp3/bai5.mp3"];
const list_namemp3 = ["Bai Hat So Mot", "Bai Hat So Hai", "Bai Hat So Ba","Bai Hat So Bon","Bai Hat So Nam"];
let stream_ = null; 
let intervalId = null;
let funtionAi = 0;
let time_delay = true
let intervalIdNextPre = null

document.addEventListener("DOMContentLoaded", function() {
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    const seekBar = document.querySelector('.main .main__box .main__box--timeline .timeline__seekBar');
    
    setSizeIcon();
    
    loadanimation(false)
    checkOrientation()
    window.addEventListener("orientationchange", function () {
        this.setTimeout(checkOrientation,300)
    });
    
    audio.addEventListener('play', () => requestAnimationFrame(updateSeekBar));
    seekBar.addEventListener('input', () => {
        const val = seekBar.value;
        audio.currentTime = (val / 100) * audio.duration;
    });
    
    
    audio.addEventListener('ended', () => {
        next(true);
    });
    
});


function createNotification(check,text){
    const template = document.querySelector(".notification .notification__item");
    const clone = template.cloneNode(true); // copy toàn bộ nội dung con
    clone.style.display = "block"; // hiện lên
    
    const img = clone.querySelector(".notification__item--title .img img");
    const title = clone.querySelector(".notification__item--title .text p:nth-child(1)"); 
    const text_ = clone.querySelector(".notification__item--title .text p:nth-child(2)");
    if(check){
        img.src = 'assets/img/check.png'
        title.innerText = "Success"
    }else{
        title.innerText = "Warning"
        img.src = 'assets/img/exclamation.png'
    }
    text_.innerText = text
    clone.querySelector(".notification__item--title .btn img").addEventListener("click", () => {
        clone.remove();
    });
    document.querySelector(".notification").appendChild(clone);
    setTimeout(() => {
        clone.remove();
    }, 3000);
}


async function toggleAiFuction(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const video = document.getElementById('video');


    if (stream_) {
        loadanimation(true)
        stream_.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream_ = null;
        clearInterval(intervalId);
        intervalId = null;
        createNotification(true,"Đã tắt canmera!")
        loadanimation(false)
    }else{
        try{
            loadanimation(true)
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
        
                    fetch('/thread-ai-funtion', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then((data)=>{
                        if(data){
                            // check xem AI dang nhan dien chuc nang gi: 1 bat nhac, 2 tat nhac, 3 next, 4 pre
                            console.log(data.funtionAI) 
                            funtionAi = data.funtionAI;
                            if(data.funtionAI===1){
                                play()
                            }else if(data.funtionAI===2){
                                pause()
                            }else if(data.funtionAI===3){
                                if(time_delay){
                                    console.log("next")
                                    next(false)
                                    time_delay = false
                                    intervalIdNextPre = setInterval(()=>{
                                        time_delay = true
                                        loadanimation(false)
                                    },5000)
                                }
                            }else if(data.funtionAI===4){
                                if(time_delay){
                                    console.log("pre")
                                    pre(false)
                                    time_delay = false
                                    intervalIdNextPre = setInterval(()=>{
                                        time_delay = true
                                        loadanimation(false)
                                    },5000)
                                }
                            }


                        }
                    });
                }, 'image/jpeg');
            }, 300);
            createNotification(true,"Đã bật canmera!")
            loadanimation(false)
        }catch(err){
            if (err.name === "NotReadableError") {
            createNotification(false,"Camera gặp vấn đề, đang khởi động lại!")
            setTimeout(toggleAiFuction, 300);
        } else {
            createNotification(false,err)
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


async function next(check){
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    const name = document.querySelector('.main .main__box .main__box--title .title__name p');
    loadanimation(true)
    if(index == (list_mp3.length - 1)){
        index = 0
    }else{
        index += 1
    } 
    audio.src = list_mp3[index]
    name.innerText = list_namemp3[index];
    audio.load();
    await waitForAudioToLoad(audio); 
    audio.play();
    if(check){
        loadanimation(false)
    }
}


async function pre(check){
    loadanimation(true)
    const audio = document.querySelector('.main .main__box .main__box--title .title__name audio');
    const name = document.querySelector('.main .main__box .main__box--title .title__name p');
    if(index == (list_mp3.length - 1)){
        index = list_mp3.length - 1
    }else{
        index -= 1
    } 
    audio.src = list_mp3[index]
    name.innerText = list_namemp3[index];
    audio.load();
    await waitForAudioToLoad(audio); 
    audio.play();
    if(check){
        loadanimation(false)
    }
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

function loadanimation(check){
    if (check) {
        document.querySelector(".load").classList.add("load__display")
    }else{
        document.querySelector(".load").classList.remove("load__display")
    }
}


function waitForAudioToLoad(audioElement) {
    return new Promise((resolve) => {
        audioElement.onloadeddata = () => {
        resolve();
        };
    });
}

