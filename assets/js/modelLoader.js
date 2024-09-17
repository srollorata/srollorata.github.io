import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Create the scene
const scene = new THREE.Scene();

// Create a New camera with positions and angles
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

document.addEventListener("DOMContentLoaded", function () {
  const pageID = document.body.id;

  loadModel(pageID);
});

function loadModel(objToRender) {
  // Initiate a loader for the .gtlf files
  const loader = new GLTFLoader();

  // Load the 3D model
  loader.load(
    `assets/models/${objToRender}/scene.gltf`,
    function (gltf) {
      // Add the loaded model to the scene
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      // While it is loading, log the progress
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      // Log if theres ERROR
      console.error("An error occurred while loading the model:", error);
    }
  );

  // Instantiate a new render and set its size
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    stencil: true,
  }); // true: allows for the transparent background
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add the renderer to the DOM
  document.getElementById("model-container").appendChild(renderer.domElement);

  // Set how far the camera will be from the 3D model
  if (objToRender == "house") {
    camera.position.z = 4.5;
  } else if (
    objToRender == "fishinghook" ||
    objToRender == "tv" ||
    objToRender == "sword"
  ) {
    camera.position.x = 1;
  } else if (objToRender == "puddle") {
    camera.position.z = 5.5;
  } else if (objToRender == "mousepad") {
    camera.position.z = 0.75;
    camera.position.y = 0.5;
  } else if (objToRender == "cup") {
    camera.position.x = 0.25;
  } else if (objToRender == "candycane") {
    camera.position.x = 0.45;
  } else if (objToRender == "bottleofhoney") {
    camera.position.x = 0.15;
    camera.position.y = 0.15;
  } else if (objToRender == "shawl") {
    camera.position.z = 3;
  } else {
    camera.position.y = 0.3;
    camera.position.x = 0.3;
  }

  // Add lights to the scene, so we can actually see the 3D Model
  const topLight = new THREE.DirectionalLight(0xffffff, 2); // (color, intensity)
  topLight.position.set(500, 500, 500);
  topLight.castShadow = true;
  scene.add(topLight);

  const ambientLight = new THREE.AmbientLight(
    0x333333,
    objToRender == "dino" ? 50 : 10
  ); // (color, intensity)
  scene.add(ambientLight);

  // Adds controls to the camera

  controls = new OrbitControls(camera, renderer.domElement);

  // Render the scene
  function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }

  // Add a listener to the window, so we can resize the window and the camera
  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  console.log("window innerwidth: ", window.innerWidth);

  // Start the 3D rendering
  animate();
}
