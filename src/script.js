const vinyl = document.getElementById("vinyl");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const tonearm = document.getElementById("tonearm");
const tonearmshadow = document.getElementById("tonearm_shadow");
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

const images = [
    'static/vinylgreen.png',
    'static/vinylred.png',
    'static/vinyl.png'
];


async function fetchStatus() {
    const res = await fetch('/api/status');
    const data = await res.json();
    title.innerText = data.title + " - " + data.artist;
    cover.src = 'static/cover.png?t=' + new Date().getTime();
}
fetchStatus();
setInterval(fetchStatus, 5000);

play.addEventListener('click', () => {
    tonearm.classList.remove("stopped");
    tonearmshadow.classList.remove("shadowstopped");

    tonearm.classList.add("onvinyl");
    tonearmshadow.classList.add("shadow");
    vinyl.style.animationPlayState = 'running';
    cover.style.animationPlayState = 'running';
    animateElement("/play");
});

function animateElement(string) {
    return new Promise(resolve => {
        tonearm.addEventListener('animationend', () => {fetchSendButton(string);});
        resolve();
        }, { once: true }); // only trigger once
}

pause.addEventListener('click', () => {
    vinyl.style.animationPlayState = 'paused';
    cover.style.animationPlayState = 'paused';
    tonearm.classList.remove("onvinyl");
    tonearmshadow.classList.remove("shadow");
    tonearm.classList.add("stopped");
    tonearmshadow.classList.add("shadowstopped");
    fetch("/pause", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ clicked: true })
    });
});

prev.addEventListener('click', () => {
    tonearm.classList.remove("onvinyl");
    void tonearm.offsetWidth;
    tonearm.classList.add("onvinyl");
    animateElement("/prev");
});

next.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    vinyl.src = randomImage;

    tonearm.classList.remove("onvinyl");
    void tonearm.offsetWidth;
    tonearm.classList.add("onvinyl");
    animateElement("/next");   
});

function fetchSendButton(string){
    fetch(string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ clicked: true })
    });
}
