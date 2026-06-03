let camera = null;

let respuestasVistas = { si: false, no: false };

let progresoHistoria = {
    origenVisto: false,
    llamadasCompletas: false,
    fuerzaActiva: false
};

function startExperience(){
    document.getElementById("intro").style.display = "none";

    // 🎵 iniciar música con fade
    const music = document.getElementById("bg-music");
    if(music){
        fadeInMusic(music);
    }

    initCamera();
    moveTo("inicio");
}

function fadeInMusic(audio){
    audio.volume = 0;
    audio.play().catch(() => {});

    let vol = 0;
    let intervalo = setInterval(() => {
        if(vol < 0.4){
            vol += 0.02;
            audio.volume = vol;
        } else {
            clearInterval(intervalo);
        }
    }, 200);
}

function toggleMusic(){
    const music = document.getElementById("bg-music");
    music.muted = !music.muted;
}

function initCamera(){
    camera = document.getElementById("camera");
    document.querySelectorAll('.node').forEach(node => {
        const x = node.dataset.x || 0;
        const y = node.dataset.y || 0;
        node.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function moveTo(id){
    const node = document.getElementById(id);
    if(!node || !camera) return;

    if(id === "inicio"){
        progresoHistoria.origenVisto = true;
    }

    if(id === "center" && progresoHistoria.origenVisto){
        document.getElementById("btn-recuerdos").style.display = "block";
    }

    if(id === "si") respuestasVistas.si = true;
    if(id === "no") respuestasVistas.no = true;

    if(respuestasVistas.si && respuestasVistas.no && !progresoHistoria.llamadasCompletas){
        progresoHistoria.llamadasCompletas = true;
        setTimeout(() => moveTo("center"), 1200);
    }

    if(id === "center" && progresoHistoria.llamadasCompletas){
        document.getElementById("btn-fuerza").style.display = "block";
    }

    if(id === "center" && progresoHistoria.fuerzaActiva){
        document.getElementById("btn-amistad").style.display = "block";
    }

    const x = parseFloat(node.dataset.x) || 0;
    const y = parseFloat(node.dataset.y) || 0;

    camera.style.transform = `translate(${-x}px, ${-y}px)`;
}

function volverCentroDesdeFuerza(){
    progresoHistoria.fuerzaActiva = true;
    moveTo("center");
}