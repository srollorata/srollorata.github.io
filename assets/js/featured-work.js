/**
 * Featured Work Loader
 * Loads featured case study cards on the homepage from projects.json
 */

(function () {
  "use strict";

  async function loadFeaturedProjects() {
    const container = document.getElementById("case-studies-container");
    if (!container) return;

    try {
      const response = await fetch("data/projects.json");
      const data = await response.json();

      // Filter and sort featured projects
      const featured = data.projects
        .filter((p) => p.featured)
        .sort((a, b) => a.featuredOrder - b.featuredOrder);

      if (featured.length === 0) {
        container.innerHTML =
          '<p class="text-center">No featured projects found.</p>';
        return;
      }

      container.innerHTML = featured
        .map((project, index) => {
          const isReversed = index % 2 !== 0;
          const delay = (index + 1) * 100;
          const tools = project.toolsUsed
            .split(",")
            .map((t) => t.trim())
            .slice(0, 4);

          return `
          <div class="case-study-card ${isReversed ? "reversed" : ""}" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="case-study-image">
              <a href="case-study.html?project=${project.slug}">
                <img src="${project.heroImage}" alt="${project.title}" loading="lazy" />
                <div class="case-study-image-overlay">
                  <i class="bi bi-arrow-right"></i>
                </div>
              </a>
            </div>
            <div class="case-study-info">
              <span class="case-study-role">${project.role}</span>
              <h3 class="case-study-title">
                <a href="case-study.html?project=${project.slug}">${project.title}</a>
              </h3>
              <p class="case-study-tagline">${project.tagline}</p>
              <div class="case-study-tools">
                ${tools.map((tool) => `<span class="tool-tag">${tool}</span>`).join("")}
              </div>
              <div class="case-study-meta">
                <span><i class="bi bi-calendar3"></i> ${project.projectDate}</span>
                ${project.projectUrl ? `<a href="${project.projectUrl}" target="_blank" class="case-study-link"><i class="bi bi-box-arrow-up-right"></i> Live</a>` : ""}
                ${project.githubRepo ? `<a href="${project.githubRepo}" target="_blank" class="case-study-link"><i class="bi bi-github"></i> Code</a>` : ""}
              </div>
              <a href="case-study.html?project=${project.slug}" class="btn-case-study">
                View Case Study <i class="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        `;
        })
        .join("");
    } catch (error) {
      console.error("Error loading featured projects:", error);
      container.innerHTML =
        '<p class="text-center text-muted">Unable to load projects.</p>';
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFeaturedProjects);
  } else {
    loadFeaturedProjects();
  }
})();
