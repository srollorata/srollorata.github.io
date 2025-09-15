document.addEventListener("DOMContentLoaded", async () => {
  // Get project slug from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const projectSlug = urlParams.get("project");
  if (!projectSlug) {
    console.error("No project specified");
    displayError("No Project Specified", "Please provide a project parameter in the URL.", "error");
    return;
  }

  try {
    // Fetch projects data with proper error handling
    const response = await fetch("/data/projects.json");
    
    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format: Expected JSON");
    }
    
    const data = await response.json();
    
    // Validate JSON structure
    if (!data || !Array.isArray(data.projects)) {
      throw new Error("Invalid data structure: Expected 'projects' array");
    }
    
    // Find the specific project
    const project = data.projects.find((p) => p.slug === projectSlug);
    if (!project) {
      console.error("Project not found");
      displayError("Project Not Found", "Sorry, the requested project could not be found.", "warning");
      return;
    }

    // Dispatch custom event with project data
    const projectDataEvent = new CustomEvent("projectData", {
      detail: project,
    });
    document.dispatchEvent(projectDataEvent);

    // Update page title
    document.title = project.name || `Portfolio Details - ${project.client}`;
    
    // Update project information
    updateProjectInfo(project);
    
    // Handle different container types
    if (project.hasCustomContainer && project.containerType === "3d-model") {
      handle3DModelProject(project);
    } else {
      handleImageProject(project);
    }
    
  } catch (error) {
    console.error("Error loading project data:", error);
    
    // Handle specific error types
    let errorTitle = "Error Loading Project";
    let errorMessage = "An unexpected error occurred while loading the project.";
    let errorType = "error";
    
    if (error.message.includes("HTTP 404")) {
      errorTitle = "Data Not Found";
      errorMessage = "The project data file could not be found. Please check if the file exists.";
      errorType = "error";
    } else if (error.message.includes("HTTP 500")) {
      errorTitle = "Server Error";
      errorMessage = "A server error occurred. Please try again later.";
      errorType = "error";
    } else if (error.message.includes("HTTP 403")) {
      errorTitle = "Access Denied";
      errorMessage = "Access to the project data is forbidden.";
      errorType = "error";
    } else if (error.message.includes("HTTP 401")) {
      errorTitle = "Unauthorized";
      errorMessage = "You are not authorized to access this resource.";
      errorType = "error";
    } else if (error.message.includes("Failed to fetch")) {
      errorTitle = "Network Error";
      errorMessage = "Unable to connect to the server. Please check your internet connection.";
      errorType = "error";
    } else if (error.message.includes("Invalid response format")) {
      errorTitle = "Data Format Error";
      errorMessage = "The server returned an invalid response format.";
      errorType = "error";
    } else if (error.message.includes("Invalid data structure")) {
      errorTitle = "Data Structure Error";
      errorMessage = "The project data has an invalid structure.";
      errorType = "error";
    }
    
    displayError(errorTitle, errorMessage, errorType);
  }
});

/**
 * Display error message to the user
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @param {string} type - Error type (error, warning, info)
 */
function displayError(title, message, type = "error") {
  const container = document.querySelector(".portfolio-details");
  if (!container) {
    console.error("Portfolio details container not found");
    return;
  }
  
  const alertClass = type === "warning" ? "alert-warning" : 
                    type === "info" ? "alert-info" : "alert-danger";
  
  container.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="alert ${alertClass} text-center">
            <h3>${title}</h3>
            <p>${message}</p>
            <a href="index.html" class="btn btn-primary mt-3">Return to Homepage</a>
            <button onclick="location.reload()" class="btn btn-secondary mt-3 ms-2">Try Again</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Update project information in the DOM
 * @param {Object} project - Project data object
 */
function updateProjectInfo(project) {
  const infoList = document.getElementById("project-info-list");
  if (!infoList) {
    console.error("Project info list not found");
    return;
  }
  
  let infoHTML = "";
  
  // Add name if it exists (for 3D models)
  if (project.name) {
    infoHTML += `<li><strong>Name</strong>: ${project.name}</li>`;
  }
  
  // Common project information
  infoHTML += `
    <li><strong>Category</strong>: ${project.category}</li>
    ${project.client ? `<li><strong>Client</strong>: ${project.client}</li>` : ""}
    <li><strong>Project date</strong>: ${project.projectDate}</li>
    <li><strong>Tools Used</strong>: ${project.toolsUsed}</li>
    ${project.relatedEvent ? `<li><strong>Related Event</strong>: ${project.relatedEvent}</li>` : ""}
    ${project.description ? `<li><strong>Description</strong>: ${project.description}</li>` : ""}
    ${project.projectUrl ? `<li><strong>Project URL</strong>: <a href="${project.projectUrl}" target="_blank">${project.projectUrl}</a></li>` : ""}
    ${project.projectGuide ? `<li><strong>Project Guide</strong>: <a href="${project.projectGuide}" target="_blank">${project.projectGuide}</a></li>` : ""}
    ${project.githubRepo ? `<li><strong>GitHub Repository</strong>: <a href="${project.githubRepo}" target="_blank">${project.githubRepo}</a></li>` : ""}
    ${!project.hasCustomContainer && project.challenges && project.challenges !== "None" ? `<li><strong>Challenges</strong>: ${project.challenges}</li>` : ""}
    ${!project.hasCustomContainer && project.solution && project.solution !== "None" ? `<li><strong>Solution</strong>: ${project.solution}</li>` : ""}
    ${project.socialLinks ? `
      <li><strong>Social Links</strong>: 
        ${project.socialLinks.facebook ? `<a target="_blank" href="${project.socialLinks.facebook}"><i class="bx bxl-facebook-circle"></i></a>` : ""}
      </li>
    ` : ""}
    ${project.editingDetails ? `
      <li><strong>Editing Details</strong>: <br>
        ${project.editingDetails.colorCorrection ? `<strong>Color Correction</strong>: ${project.editingDetails.colorCorrection}` : ""}<br>
        ${project.editingDetails.retouching ? `<strong>Retouching</strong>: ${project.editingDetails.retouching}` : ""}<br>
        ${project.editingDetails.effects ? `<strong>Effects</strong>: ${project.editingDetails.effects}` : ""}<br>
      </li>
    ` : ""}
  `;
  
  infoList.innerHTML = infoHTML;
}

/**
 * Handle 3D model projects
 * @param {Object} project - Project data object
 */
function handle3DModelProject(project) {
  // Hide image container and show model container
  const imageContainer = document.getElementById("image-container");
  const modelContainer = document.getElementById("model-container");
  
  if (imageContainer) {
    imageContainer.style.display = "none";
  }
  
  if (modelContainer) {
    modelContainer.style.display = "block";
  }
  
  // Add model controls if they exist
  if (project.modelControls) {
    const controlsPanel = document.getElementById("controls-panel");
    const controlsList = document.getElementById("controls-list");
    
    if (controlsPanel && controlsList) {
      controlsPanel.style.display = "block";
      
      let controlsHTML = "";
      Object.entries(project.modelControls).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
        controlsHTML += `<li><strong>${formattedKey}</strong>: ${value}</li>`;
      });
      
      controlsList.innerHTML = controlsHTML;
    }
  }
  
  // Load 3D model script
  const modelScript = document.createElement("script");
  modelScript.type = "module";
  modelScript.src = "assets/js/modelLoader.js";
  document.body.appendChild(modelScript);
}

/**
 * Handle image-based projects
 * @param {Object} project - Project data object
 */
function handleImageProject(project) {
  // Hide model container and show image container
  const modelContainer = document.getElementById("model-container");
  const imageContainer = document.getElementById("image-container");
  
  if (modelContainer) {
    modelContainer.style.display = "none";
  }
  
  if (imageContainer) {
    imageContainer.style.display = "flex";
  }
  
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  if (!swiperWrapper) {
    console.error("Swiper wrapper not found");
    return;
  }
  
  if (!project.images || !Array.isArray(project.images)) {
    console.error("No images found for project");
    return;
  }
  
  swiperWrapper.innerHTML = project.images
    .map(image => `
      <div class="swiper-slide">
        <img src="${image.src}" alt="${image.caption}" 
             onerror="this.onerror=null; this.src='assets/img/portfolio/portfolio-details-1.jpg'; this.alt='Image not available';">
        <p><strong>${image.caption}</strong></p>
      </div>
    `)
    .join("");
  
  // Initialize Swiper for image projects
  try {
    new Swiper(".portfolio-details-slider", {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
    });
  } catch (error) {
    console.error("Error initializing Swiper:", error);
  }
}

/**
 * Toggle panel visibility
 * @param {string} panelId - ID of the panel to toggle
 */
function togglePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) {
    const isExpanded = panel.classList.contains("expanded");
    
    if (isExpanded) {
      panel.classList.remove("expanded");
      panel.classList.add("collapsed");
    } else {
      panel.classList.remove("collapsed");
      panel.classList.add("expanded");
    }
  }
}

// Initialize panels in collapsed state when page loads
document.addEventListener("DOMContentLoaded", () => {
  const panels = document.querySelectorAll(".panel");
  panels.forEach(panel => {
    panel.classList.add("collapsed");
  });
});

// Make togglePanel function globally available
window.togglePanel = togglePanel;
