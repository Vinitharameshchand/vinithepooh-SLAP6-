import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js';

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 13;

const scene = new THREE.Scene();

let vini2;
let mixer; // Declare mixer variable
const loader = new GLTFLoader();

loader.load(
    'vini2.glb',
    function (gltf) {
        vini2 = gltf.scene;
        scene.add(vini2);

        // Setup Animation Mixer
        mixer = new THREE.AnimationMixer(vini2);
        if (gltf.animations && gltf.animations.length > 0) {
            mixer.clipAction(gltf.animations[0]).play();
        }
    },
    function (xhr) { },
    function (error) { }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(500, 500, 500);
scene.add(directionalLight);

const clock = new THREE.Clock(); // Create a clock for delta time

const reRender3D = () => {
    requestAnimationFrame(reRender3D);

    // Update mixer if it exists
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
};
reRender3D();
