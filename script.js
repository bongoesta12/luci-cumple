let camera = null;

let respuestasVistas = { si: false, no: false };

let progresoHistoria = {
    origenVisto: false,
    llamadasCompletas: false,
    fuerzaActiva: false
};

function startExperience(){
    initCamera();

    document.getElementById("intro").style.display = "none";

    const music = document.getElementById("bg-music");
    if(music){
        fadeInMusic(music);
    }

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
    camera = document.getElementById("camera");
    
    // Posiciona cada nodo en su coordenada del mapa de recuerdos
    document.querySelectorAll('.node').forEach(node => {
        const x = node.dataset.x || 0;
        const y = node.dataset.y || 0;
        node.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function moveTo(id){
    const node = document.getElementById(id);
    
    if(!camera) camera = document.getElementById("camera");
    if(!node || !camera) return;

    // Control de flujo de la historia
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
        setTimeout(() => moveTo("center"), 2500); // 2.5 segundos para que pueda leer la última respuesta
    }

    if(id === "center" && progresoHistoria.llamadasCompletas){
        document.getElementById("btn-fuerza").style.display = "block";
    }

    if(id === "center" && progresoHistoria.fuerzaActiva){
        document.getElementById("btn-amistad").style.display = "block";
    }

    // Actualizar barra de progreso dorada
    actualizarProgreso();

    // 🎯 FÓRMULA DE CENTRADO PERFECTO:
    // Invertimos las coordenadas exactas del nodo seleccionado.
    // Al usar translate con la mitad exacta del ancho y alto del nodo en negativo,
    // obligamos al navegador a alinear el centro de la tarjeta con el centro de la cámara.
    const x = parseFloat(node.dataset.x) || 0;
    const y = parseFloat(node.dataset.y) || 0;

    camera.style.transform = `translate(${-x}px, ${-y}px)`;
}

function volverCentroDesdeFuerza(){
    progresoHistoria.fuerzaActiva = true;
    moveTo("center");
}

// Lógica para llenar la barra superior dorada según avance Luci
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
