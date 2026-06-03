let camera = null;

let respuestasVistas = { si: false, no: false };

let progresoHistoria = {
    origenVisto: false,
    llamadasCompletas: false,
    fuerzaActiva: false
};

function startExperience(){
    // Inicializar la cámara antes de cualquier movimiento
    initCamera();

    // Ocultar la pantalla de presentación
    document.getElementById("intro").style.display = "none";

    // Iniciar la música de fondo con desvanecimiento suave
    const music = document.getElementById("bg-music");
    if(music){
        fadeInMusic(music);
    }

    // Viajar de forma segura al primer nodo
    moveTo("inicio");
}

function fadeInMusic(audio){
    audio.volume = 0;
    audio.play().catch(() => {
        console.log("El navegador bloqueó el audio automático. Se activará al interactuar.");
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
    camera = document.getElementById("camera");
    
    // Posiciona cada tarjeta usando su tamaño real (-50%) para que sirva en móviles
    document.querySelectorAll('.node').forEach(node => {
        const x = node.dataset.x || 0;
        const y = node.dataset.y || 0;
        node.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    });
}

function moveTo(id){
    const node = document.getElementById(id);
    
    if(!camera) camera = document.getElementById("camera");
    if(!node || !camera) return;

    // Lógica para desbloquear el progreso de la historia de Luci
    if(id === "inicio"){
        progresoHistoria.origenVisto = true;
    }

    if(id === "center" && progresoHistoria.origenVisto){
        document.getElementById("btn-recuerdos").style.display = "block";
    }

    if(id === "si") respuestasVistas.si = true;
    if(id === "no") respuestasVistas.no = true;

    // Si ya presionó las dos opciones de la pregunta del millón
    if(respuestasVistas.si && respuestasVistas.no && !progresoHistoria.llamadasCompletas){
        progresoHistoria.llamadasCompletas = true;
        // Espera 2.5 segundos para que lea el texto antes de regresar al centro
        setTimeout(() => moveTo("center"), 2500);
    }

    if(id === "center" && progresoHistoria.llamadasCompletas){
        document.getElementById("btn-fuerza").style.display = "block";
    }

    if(id === "center" && progresoHistoria.fuerzaActiva){
        document.getElementById("btn-amistad").style.display = "block";
    }

    // Actualiza la barra superior dorada
    actualizarProgreso();

    // Mueve la cámara hacia el nodo seleccionado (coordenadas inversas)
    const x = parseFloat(node.dataset.x) || 0;
    const y = parseFloat(node.dataset.y) || 0;

    camera.style.transform = `translate(${-x}px, ${-y}px)`;
}

function volverCentroDesdeFuerza(){
    progresoHistoria.fuerzaActiva = true;
    moveTo("center");
}

function actualizarProgreso() {
    const progressBarr = document.getElementById("progress");
    if(!progressBarr) return;
    
    let puntos = 0;
    if(progresoHistoria.origenVisto) puntos += 25;
    if(respuestasVistas.si || respuestasVistas.no) puntos += 25;
    if(progresoHistoria.llamadasCompletas) puntos += 25;
    if(progresoHistoria.fuerzaActiva) puntos += 25;
    
    progressBarr.style.width = `${puntos}%`;
}
