import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- 1. CONFIGURACIÓN DE LA ESCENA, CÁMARA Y RENDERIZADOR ---
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 60, 110); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true }); 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- [NUEVO] CONTROLES DE LA CÁMARA (ORBIT CONTROLS) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.minDistance = 15;     
controls.maxDistance = 400;    

// --- 2. FONDO DE ESTRELLAS ---
const starsGeometry = new THREE.BufferGeometry();
const starscount = 7000; 
const position = [];

for (let i = 0; i < starscount; i++) {
    position.push(
        (Math.random() - 0.5) * 600, 
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600
    );
}

starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(position, 3)
);

const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.6,
    sizeAttenuation: true
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// --- 3. EL SOL Y LOS PLANETAS ---
const sunGeometry = new THREE.SphereGeometry(6, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const sol = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sol);

const mercurio = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa })
);

const venus = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffcc66 })
);

const tierra = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x4488ff })
);

const marte = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff5533 })
);

const jupiter = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xd4a373 })
);

const saturnoGrupo = new THREE.Group(); 
const saturnoCuerpo = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xe9c46a })
);
saturnoGrupo.add(saturnoCuerpo);

const anilloGeometry = new THREE.RingGeometry(3.5, 6, 32);
const anilloMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xddb892, 
    side: THREE.DoubleSide 
});
const anilloSaturno = new THREE.Mesh(anilloGeometry, anilloMaterial);
anilloSaturno.rotation.x = Math.PI / 2; 
saturnoGrupo.add(anilloSaturno);

const urano = new THREE.Mesh(
    new THREE.SphereGeometry(2.0, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xa8dadc })
);

const neptuno = new THREE.Mesh(
    new THREE.SphereGeometry(1.9, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x457b9d })
);

const pluton = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xcdb4db })
);

// --- 4. LA NAVE ESPACIAL ---
const naveGrupo = new THREE.Group();

const cuerpoGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
const cuerpoMat = new THREE.MeshBasicMaterial({ color: 0xdddddd });
const cuerpoNave = new THREE.Mesh(cuerpoGeo, cuerpoMat);
cuerpoNave.rotation.x = Math.PI / 2; 

const puntaGeo = new THREE.ConeGeometry(0.4, 1, 16);
const puntaMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
const puntaNave = new THREE.Mesh(puntaGeo, puntaMat);
puntaNave.rotation.x = Math.PI / 2;
puntaNave.position.z = 1.5; 

const alasGeo = new THREE.BoxGeometry(2.5, 0.1, 0.8);
const alasMat = new THREE.MeshBasicMaterial({ color: 0x3366ff });
const alasNave = new THREE.Mesh(alasGeo, alasMat);
alasNave.position.z = -0.3; 

const propulsorGeo = new THREE.ConeGeometry(0.3, 0.5, 16);
const propulsorMat = new THREE.MeshBasicMaterial({ color: 0xff8800 });
const propulsorNave = new THREE.Mesh(propulsorGeo, propulsorMat);
propulsorNave.rotation.x = -Math.PI / 2;
propulsorNave.position.z = -1.2;

naveGrupo.add(cuerpoNave);
naveGrupo.add(puntaNave);
naveGrupo.add(alasNave);
naveGrupo.add(propulsorNave);

scene.add(mercurio, venus, tierra, marte, jupiter, saturnoGrupo, urano, neptuno, pluton, naveGrupo);

// --- 5. REDIMENSIONADO DE VENTANA ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 6. BUCLE DE ANIMACIÓN ---
const reloj = new THREE.Clock();

function renderizar() {
    requestAnimationFrame(renderizar);
    
    const tiempo = reloj.getElapsedTime();

    stars.rotation.y += 0.0001;
    sol.rotation.y += 0.005;

    mercurio.position.x = Math.cos(tiempo * 2.0) * 12;
    mercurio.position.z = Math.sin(tiempo * 2.0) * 12;
    mercurio.rotation.y += 0.02;

    venus.position.x = Math.cos(tiempo * 1.5) * 18;
    venus.position.z = Math.sin(tiempo * 1.5) * 18;
    venus.rotation.y += 0.01;

    tierra.position.x = Math.cos(tiempo * 1.0) * 24;
    tierra.position.z = Math.sin(tiempo * 1.0) * 24;
    tierra.rotation.y += 0.03;

    marte.position.x = Math.cos(tiempo * 0.8) * 30;
    marte.position.z = Math.sin(tiempo * 0.8) * 30;
    marte.rotation.y += 0.02;

    const velocidadNave = 1.2;
    const radioNave = 36;
    
    const xNave = Math.cos(tiempo * velocidadNave) * radioNave;
    const zNave = Math.sin(tiempo * velocidadNave) * radioNave;
    const yNave = Math.sin(tiempo * 3.0) * 2; 

    naveGrupo.position.set(xNave, yNave, zNave);

    const xSiguiente = Math.cos((tiempo + 0.1) * velocidadNave) * radioNave;
    const zSiguiente = Math.sin((tiempo + 0.1) * velocidadNave) * radioNave;
    const ySiguiente = Math.sin((tiempo + 0.1) * 3.0) * 2;
    
    naveGrupo.lookAt(xSiguiente, ySiguiente, zSiguiente);

    jupiter.position.x = Math.cos(tiempo * 0.5) * 42;
    jupiter.position.z = Math.sin(tiempo * 0.5) * 42;
    jupiter.rotation.y += 0.04;

    saturnoGrupo.position.x = Math.cos(tiempo * 0.4) * 56;
    saturnoGrupo.position.z = Math.sin(tiempo * 0.4) * 56;
    saturnoCuerpo.rotation.y += 0.035;

    urano.position.x = Math.cos(tiempo * 0.25) * 70;
    urano.position.z = Math.sin(tiempo * 0.25) * 70;
    urano.rotation.y += 0.02;

    neptuno.position.x = Math.cos(tiempo * 0.15) * 82;
    neptuno.position.z = Math.sin(tiempo * 0.15) * 82;
    neptuno.rotation.y += 0.02;

    pluton.position.x = Math.cos(tiempo * 0.1) * 92;
    pluton.position.z = Math.sin(tiempo * 0.1) * 92;
    pluton.rotation.y += 0.01;

    // Actualizamos los controles para la inercia visual
    controls.update(); 

    renderer.render(scene, camera);
}   

renderizar();