document.addEventListener("DOMContentLoaded", async () => {
  // Get project slug from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const projectSlug = urlParams.get("project");
  if (!projectSlug) {
    console.error("No project specified");
    return;
  }
  try {
    // Fetch projects data
    const response = await fetch("/data/projects.json");
    const data = await response.json();
    // Find the specific project
    const project = data.projects.find((p) => p.slug === projectSlug);
    if (!project) {
      console.error("Project not found");

      // Add error message to the page
      const container = document.querySelector(".portfolio-details");
      container.innerHTML = `
       <div class="container">
         <div class="row">
           <div class="col-lg-12">
             <div class="alert alert-danger text-center">
               <h3>Project Not Found</h3>
               <p>Sorry, the requested project could not be found.</p>
               <a href="index.html" class="btn btn-primary mt-3">Return to Homepage</a>
             </div>
           </div>
         </div>
       </div>
     `;

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
    const infoList = document.querySelector(".portfolio-info ul");
    let infoHTML = "";
    // Add name if it exists (for 3D models)
    if (project.name) {
      infoHTML += `<li><strong>Name</strong>: ${project.name}</li>`;
    }
    // Common project information
    infoHTML += `
       <li><strong>Category</strong>: ${project.category}</li>
       ${
         project.client
           ? `<li><strong>Client</strong>: ${project.client}</li>`
           : ""
       }
       <li><strong>Project date</strong>: ${project.projectDate}</li>
       <li><strong>Tools Used</strong>: ${project.toolsUsed}</li>
       ${
         project.relatedEvent
           ? `<li><strong>Related Event</strong>: ${project.relatedEvent}</li>`
           : ""
       }
       ${
         project.description
           ? `<li><strong>Description</strong>: ${project.description}</li>`
           : ""
       }
       ${
         project.projectUrl
           ? `<li><strong>Project URL</strong>: <a href="${project.projectUrl}" target="_blank">${project.projectUrl}</a></li>`
           : ""
       }
       ${
         !project.hasCustomContainer &&
         project.challenges &&
         project.challenges !== "None"
           ? `<li><strong>Challenges</strong>: ${project.challenges}</li>`
           : ""
       }
       ${
         !project.hasCustomContainer &&
         project.solution &&
         project.solution !== "None"
           ? `<li><strong>Solution</strong>: ${project.solution}</li>`
           : ""
       }
       ${
         project.socialLinks
           ? `
         <li><strong>Social Links</strong>: 
           ${
             project.socialLinks.facebook
               ? `<a target="_blank" href="${project.socialLinks.facebook}"><i class="bx bxl-facebook-circle"></i></a>`
               : ""
           }
         </li>
       `
           : ""
       }
        ${
          project.editingDetails
            ? `
         <li><strong>Editing Details</strong>: <br>
           ${
             project.editingDetails.colorCorrection
               ? `<strong>Color Correction</strong>: ${project.editingDetails.colorCorrection}`
               : ""
           }<br>
           
           ${
             project.editingDetails.retouching
               ? `<strong>Retouching</strong>: ${project.editingDetails.retouching}`
               : ""
           }<br>

           ${
             project.editingDetails.effects
               ? `<strong>Effects</strong>: ${project.editingDetails.effects}`
               : ""
           }<br>
         </li>
       `
            : ""
        }  
     `;
    infoList.innerHTML = infoHTML;
    // Handle different container types
    if (project.hasCustomContainer && project.containerType === "3d-model") {
      // For 3D models
      const container = document.querySelector(".portfolio-details-slider");
      const modelContainer = document.createElement("div");
      modelContainer.id = "model-container";
      container.replaceWith(modelContainer);
      // Add model controls if they exist
      if (project.modelControls) {
        // Make the Project information container col-lg-12 to col-lg-8
        const projectInfo = document.getElementById("project-info");
        projectInfo.classList.remove("col-lg-12");
        // projectInfo.classList.add("col-lg-8");

        const controlsDiv = document.createElement("div");
        controlsDiv.className = "col-lg-12";
        controlsDiv.innerHTML = `
            <div class="portfolio-info">
              <h3>3D Mouse Controls</h3>
              <ul>
                ${Object.entries(project.modelControls)
                  .map(
                    ([key, value]) =>
                      `<li><strong>${key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) =>
                          str.toUpperCase()
                        )}</strong>: ${value}</li>`
                  )
                  .join("")}
              </ul>
            </div>
          `;
        document.querySelector(".row").appendChild(controlsDiv);
      }
      // Load 3D model script
      const modelScript = document.createElement("script");
      modelScript.type = "module";
      modelScript.src = "assets/js/modelLoader.js";
      document.body.appendChild(modelScript);
    } else {
      // For image-based projects
      const swiperWrapper = document.querySelector(".swiper-wrapper");
      swiperWrapper.innerHTML = project.images
        .map(
          (image) => `
          <div class="swiper-slide">
            <center><img src="${image.src}" alt="${image.caption}" style="height: 100vh; width: auto;  object-fit: cover;"></center>
            <p><center><strong>${image.caption}</strong></center></p>
          </div>
        `
        )
        .join("");
      // Initialize Swiper for image projects
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
    }
  } catch (error) {
    console.error("Error loading project data:", error);
  }
});
