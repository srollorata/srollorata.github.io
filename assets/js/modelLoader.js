import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function showModelError(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
      <h4 class="mt-3">Failed to Load 3D Model</h4>
      <p class="text-muted">The model could not be loaded. Please try refreshing the page.</p>
      <button onclick="location.reload()" class="btn btn-primary">Refresh Page</button>
    </div>
  `;
}

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

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const projectSlug = urlParams.get("project");

    if (!projectSlug) {
      console.error("No project slug specified in URL");
      return;
    }

    const response = await fetch("/data/projects.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format: Expected JSON");
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.projects)) {
      throw new Error("Invalid data structure: Expected 'projects' array");
    }

    const project = data.projects.find((p) => p.slug === projectSlug);

    if (!project) {
      console.error("Project not found in data");
      return;
    }
    console.log("Project data loaded:", project);
    console.log("Project type:", project.containerType);
    console.log("Project slug:", project.slug);
    const pageID = project.slug;
    if (project.containerType === "3d-model") {
      loadModel(pageID);
    }
  } catch (error) {
    console.error("Error loading project data:", error);
  }
});

function loadModel(objToRender) {
  const container = document.getElementById("model-container");
  if (!container) {
    console.error("Model container not found");
    return;
  }

  container.innerHTML = "";
  const loader = new GLTFLoader();

  loader.load(
    `assets/models/${objToRender}/scene.gltf`,
    function (gltf) {
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error("An error occurred while loading the model:", error);
      showModelError(container);
    }
  );

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    stencil: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("model-container").appendChild(renderer.domElement);

  if (objToRender === "house") {
    camera.position.z = 4.5;
  } else if (
    objToRender === "fishinghook" ||
    objToRender === "tv" ||
    objToRender === "sword"
  ) {
    camera.position.x = 1;
  } else if (objToRender === "puddle") {
    camera.position.z = 5.5;
  } else if (objToRender === "mousepad") {
    camera.position.z = 0.75;
    camera.position.y = 0.5;
  } else if (objToRender === "cup") {
    camera.position.x = 0.25;
  } else if (objToRender === "candycane") {
    camera.position.x = 0.45;
  } else if (objToRender === "bottleofhoney") {
    camera.position.x = 0.15;
    camera.position.y = 0.15;
  } else if (objToRender === "shawl") {
    camera.position.z = 3;
  } else {
    camera.position.y = 0.3;
    camera.position.x = 0.3;
  }

  const topLight = new THREE.DirectionalLight(0xffffff, 2);
  topLight.position.set(500, 500, 500);
  topLight.castShadow = true;
  scene.add(topLight);

  const ambientLight = new THREE.AmbientLight(
    0x333333,
    objToRender === "dino" ? 50 : 10
  );
  scene.add(ambientLight);

  controls = new OrbitControls(camera, renderer.domElement);

  function disposeObject(obj) {
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((material) => material.dispose());
      } else {
        obj.material.dispose();
      }
    }
  }

  let cleanupRan = false;

  function handleVisibilityChange() {
    if (document.hidden) {
      cleanup();
    }
  }

  function cleanup() {
    if (cleanupRan) return;
    cleanupRan = true;

    if (object) {
      object.traverse((child) => disposeObject(child));
      scene.remove(object);
      object = null;
    }
    renderer.dispose();
    if (controls) {
      controls.dispose();
    }
    window.removeEventListener("resize", onResize);
    window.removeEventListener("beforeunload", cleanup);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onResize);
  window.addEventListener("beforeunload", cleanup);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  console.log("window innerwidth: ", window.innerWidth);

  animate();
}
