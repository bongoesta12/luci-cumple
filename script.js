let camera = null;

let respuestasVistas = { si: false, no: false };

let progresoHistoria = {
    origenVisto: false,
    llamadasCompletas: false,
    fuerzaActiva: false
};

function startExperience(){
    // 1. Inicializar la cámara PRIMERO para asegurar que exista en memoria
    initCamera();

    // 2. Ocultar el intro
    document.getElementById("intro").style.display = "none";

    // 3. Iniciar música con fade
    const music = document.getElementById("bg-music");
    if(music){
        fadeInMusic(music);
    }

    // 4. Ahora sí, moverse a inicio de forma segura
    moveTo("inicio");
}

function fadeInMusic(audio){
    audio.volume = 0;
    audio.play().catch(() => {
        console.log("El navegador bloqueó el audio. Se activará al interactuar.");
    });

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
    if(music) {
        music.muted = !music.muted;
    }
}

function initCamera(){
    // Asignamos la variable global
    camera = document.getElementById("camera");
    
    // Posicionar todos los nodos en sus coordenadas correspondientes
    document.querySelectorAll('.node').forEach(node => {
        const x = node.dataset.x || 0;
        const y = node.dataset.y || 0;
        node.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function moveTo(id){
    const node = document.getElementById(id);
    
    // Si la cámara no se ha cargado, la buscamos de nuevo por seguridad
    if(!camera) camera = document.getElementById("camera");
    if(!node || !camera) return;

    // Lógica de progreso de la historia
    if(id === "inicio"){
        progresoHistoria.origenVisto = true;
    }

    if(id === "center" && progresoHistoria.origenVisto){
        document.getElementById("btn-recuerdos").style.display = "block";
    }

    if(id === "si") respuestasVistas.si = true;
    if(id === "no") respuestasVistas.no = true;

    // Si ya vio ambas respuestas de la llamada
    if(respuestasVistas.si && respuestasVistas.no && !progresoHistoria.llamadasCompletas){
        progresoHistoria.llamadasCompletas = true;
        // Espera 2 segundos para que el usuario lea la última respuesta antes de regresar al centro
        setTimeout(() => moveTo("center"), 2000);
    }

    if(id === "center" && progresoHistoria.llamadasCompletas){
        document.getElementById("btn-fuerza").style.display = "block";
    }

    if(id === "center" && progresoHistoria.fuerzaActiva){
        document.getElementById("btn-amistad").style.display = "block";
    }

    // Mover la cámara (fíjate en los signos negativos para simular movimiento de lente)
    const x = parseFloat(node.dataset.x) || 0;
    const y = parseFloat(node.dataset.y) || 0;

    camera.style.transform = `translate(${-x}px, ${-y}px)`;
}

function volverCentroDesdeFuerza(){
    progresoHistoria.fuerzaActiva = true;
    moveTo("center");
}
