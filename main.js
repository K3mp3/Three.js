import * as THREE from 'three';
import './style.css';
import gsap from "gsap"; 
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import { PointsMaterial } from 'three';

//Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusKnotGeometry( 0.01, 0.8, 100, 16 );
const sphereMaterial = new THREE.PointsMaterial( {
  size: 0.01,
  color: '#00fff3',
})
const sphere = new THREE.Points(geometry, sphereMaterial);
scene.add(sphere)


const particlesMaterial = new THREE.PointsMaterial( {
  size: 0.005,
  //color: 'blue',
  //blending: THREE.AdditiveBlending,
})


const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 6000; // How many particles we want 

const posArray = new Float32Array(particlesCnt * 3);
// xyz, xyz, xyz, xyz

for (let i = 0; i < particlesCnt * 3; i++) {
      posArray[i] = (Math.random() -0.5) * (Math.random() *5);
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Light
const light = new THREE.PointLight(0xfff, 1, 100);
light.position.set(1, 10, 10);
light.intensity = 1.25;
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(
  25, 
  sizes.width / sizes.height, 
  0.1, 
  100
)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4
scene.add(camera);

//Render
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.setClearColor(new THREE.Color('#161b1c'), 1);
renderer.render(scene, camera)


// Mouse
document.addEventListener('mousemove', animateParticles);

let mouseY = 0;
let mouseX = 0;

function animateParticles(e) {
  mouseY = e.clientY;
  mouseX = e.clientX;
}


//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

//Resize
window.addEventListener('resize', () => {
  //Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  
  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
})

const loop = () => {
  controls.update();
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop);
}
loop();


// Mouse animation color
let mouseDown = false;
let rgb = [];
window.addEventListener("mouseclick" , () => (mouseDown = true));
window.addEventListener("mouseclick", () => (mouseDown = false));

window.addEventListener("mouseclick", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];

    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(particlesMesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })    
  }
})

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  particlesMesh.rotation.y = -.1 * elapsedTime;

  if (mouseX > 0) {
    particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00005);
    particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00005);
  }


  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick();
