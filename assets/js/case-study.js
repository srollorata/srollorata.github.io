/**
 * Case Study Page Logic
 * Loads a single project's case study data from projects.json
 * and renders it into the case-study.html template.
 */

(function () {
  "use strict";

  // Get project slug from URL
  const params = new URLSearchParams(window.location.search);
  const projectSlug = params.get("project");

  if (!projectSlug) {
    window.location.href = "index.html";
    return;
  }

  async function loadCaseStudy() {
    try {
      const response = await fetch("data/projects.json");
      const data = await response.json();

      // Find the project
      const project = data.projects.find((p) => p.slug === projectSlug);

      if (!project || !project.caseStudy) {
        // Fallback to portfolio-details if no case study data
        window.location.href = `portfolio-details.html?project=${projectSlug}`;
        return;
      }

      // Update page title
      document.title = `${project.title || project.slug} | Selwyn Rollorata`;

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.content = project.tagline || project.description || "";
      }

      // --- Hero Section ---
      const heroImage = document.getElementById("cs-hero-image");
      if (heroImage && project.heroImage) {
        heroImage.style.backgroundImage = `url('${project.heroImage}')`;
      }

      const roleEl = document.getElementById("cs-role");
      if (roleEl) roleEl.textContent = project.role || project.category;

      const titleEl = document.getElementById("cs-title");
      if (titleEl) titleEl.textContent = project.title || project.slug;

      const taglineEl = document.getElementById("cs-tagline");
      if (taglineEl)
        taglineEl.textContent = project.tagline || project.description || "";

      // --- Meta Bar ---
      const metaGrid = document.getElementById("cs-meta-grid");
      if (metaGrid) {
        let metaHTML = "";

        if (project.projectDate) {
          metaHTML += `
            <div class="cs-meta-item">
              <span class="cs-meta-label">Timeline</span>
              <span class="cs-meta-value">${project.projectDate}</span>
            </div>`;
        }

        if (project.status) {
          metaHTML += `
            <div class="cs-meta-item">
              <span class="cs-meta-label">Status</span>
              <span class="cs-meta-value">${project.status}</span>
            </div>`;
        }

        if (project.role) {
          metaHTML += `
            <div class="cs-meta-item">
              <span class="cs-meta-label">Role</span>
              <span class="cs-meta-value">${project.role}</span>
            </div>`;
        }

        if (project.toolsUsed) {
          metaHTML += `
            <div class="cs-meta-item">
              <span class="cs-meta-label">Tools</span>
              <span class="cs-meta-value">${project.toolsUsed}</span>
            </div>`;
        }

        if (project.projectUrl) {
          metaHTML += `
            <div class="cs-meta-item">
              <span class="cs-meta-label">Live URL</span>
              <span class="cs-meta-value"><a href="${project.projectUrl}" target="_blank">${project.projectUrl.replace(/https?:\/\//, "")}</a></span>
            </div>`;
        }

        if (project.githubRepo) {
          metaHTML += `
            <div class="cs-meta-item">
              <span class="cs-meta-label">Source Code</span>
              <span class="cs-meta-value"><a href="${project.githubRepo}" target="_blank"><i class="bi bi-github"></i> GitHub Repository</a></span>
            </div>`;
        }

        metaGrid.innerHTML = metaHTML;
      }

      // --- Story Sections ---
      const storyContainer = document.getElementById("cs-story");
      if (storyContainer && project.caseStudy) {
        const cs = project.caseStudy;
        let storyHTML = "";

        if (cs.context) {
          storyHTML += `
            <div class="cs-story-block" data-aos="fade-up">
              <h2 class="cs-section-title">Context</h2>
              <p>${cs.context}</p>
            </div>`;
        }

        if (cs.challenge) {
          storyHTML += `
            <div class="cs-story-block" data-aos="fade-up">
              <h2 class="cs-section-title">The Challenge</h2>
              <p>${cs.challenge}</p>
            </div>`;
        }

        if (cs.process) {
          storyHTML += `
            <div class="cs-story-block" data-aos="fade-up">
              <h2 class="cs-section-title">Process</h2>
              <p>${cs.process}</p>
            </div>`;
        }

        if (cs.outcome) {
          storyHTML += `
            <div class="cs-story-block" data-aos="fade-up">
              <h2 class="cs-section-title">Outcome</h2>
              <p>${cs.outcome}</p>
            </div>`;
        }

        storyContainer.innerHTML = storyHTML;
      }

      // --- Gallery ---
      const galleryGrid = document.getElementById("cs-gallery-grid");
      const gallerySection = document.getElementById("cs-gallery");
      if (galleryGrid && project.images && project.images.length > 0) {
        galleryGrid.innerHTML = project.images
          .map(
            (img, i) => `
          <a href="${img.src}" class="cs-gallery-item glightbox" data-gallery="cs-gallery" data-glightbox="title: ${img.caption || ""}">
            <img src="${img.src}" alt="${img.caption || `Screenshot ${i + 1}`}" loading="lazy" />
            <div class="cs-gallery-caption">${img.caption || ""}</div>
          </a>
        `
          )
          .join("");

        // Initialize GLightbox for gallery
        GLightbox({
          selector: ".glightbox",
          touchNavigation: true,
          loop: true,
        });
      } else if (gallerySection) {
        gallerySection.style.display = "none";
      }

      // --- Takeaways ---
      const takeawaysList = document.getElementById("cs-takeaways-list");
      const takeawaysSection = document.getElementById("cs-takeaways");
      if (
        takeawaysList &&
        project.caseStudy.takeaways &&
        project.caseStudy.takeaways.length > 0
      ) {
        takeawaysList.innerHTML = project.caseStudy.takeaways
          .map(
            (t) => `
          <li data-aos="fade-left">
            <i class="bi bi-check-circle-fill"></i>
            <span>${t}</span>
          </li>
        `
          )
          .join("");
      } else if (takeawaysSection) {
        takeawaysSection.style.display = "none";
      }

      // --- Documentary Timeline ---
      const docSection = document.getElementById("cs-documentary");
      const docIntro = document.getElementById("cs-doc-intro");
      const docTimeline = document.getElementById("cs-doc-timeline");

      if (docTimeline && project.documentary && project.documentary.chapters) {
        const doc = project.documentary;
        if (docIntro && doc.intro) docIntro.textContent = doc.intro;

        docTimeline.innerHTML = doc.chapters.map((ch) => {
          if (ch.kind === "pause") {
            return `
              <div class="cs-doc-chapter cs-doc-pause" data-aos="fade-up">
                <span class="cs-doc-date">${ch.date}</span>
                <h3 class="cs-doc-title"><i class="bi bi-moon-stars"></i> ${ch.title}</h3>
                <p class="cs-doc-narrative">${ch.narrative}</p>
              </div>`;
          }
          return `
            <div class="cs-doc-chapter" data-aos="fade-up">
              <span class="cs-doc-phase">Phase ${ch.phase}</span>
              <span class="cs-doc-date">${ch.date}</span>
              <h3 class="cs-doc-title">${ch.title}</h3>
              <p class="cs-doc-narrative">${ch.narrative}</p>
              ${ch.highlights && ch.highlights.length ? `
                <ul class="cs-doc-highlights">
                  ${ch.highlights.map((h) => `<li><i class="bi bi-git"></i> ${h}</li>`).join("")}
                </ul>` : ""}
            </div>`;
        }).join("");
      } else if (docSection) {
        docSection.style.display = "none";
      }

      // --- Prev/Next Navigation ---
      const navGrid = document.getElementById("cs-nav-grid");
      if (navGrid) {
        const featured = data.projects
          .filter((p) => p.featured)
          .sort((a, b) => a.featuredOrder - b.featuredOrder);

        const currentIndex = featured.findIndex(
          (p) => p.slug === projectSlug
        );

        let navHTML = "";

        // Prev
        if (currentIndex > 0) {
          const prev = featured[currentIndex - 1];
          navHTML += `
            <a href="case-study.html?project=${prev.slug}" class="cs-nav-item cs-nav-prev">
              <span class="cs-nav-label"><i class="bi bi-arrow-left"></i> Previous</span>
              <span class="cs-nav-title">${prev.title || prev.slug}</span>
            </a>`;
        } else {
          navHTML += `<div></div>`;
        }

        // Next
        if (currentIndex < featured.length - 1) {
          const next = featured[currentIndex + 1];
          navHTML += `
            <a href="case-study.html?project=${next.slug}" class="cs-nav-item cs-nav-next">
              <span class="cs-nav-label">Next <i class="bi bi-arrow-right"></i></span>
              <span class="cs-nav-title">${next.title || next.slug}</span>
            </a>`;
        } else {
          navHTML += `<div></div>`;
        }

        navGrid.innerHTML = navHTML;
      }

      // --- Remove Preloader ---
      const preloader = document.getElementById("preloader");
      if (preloader) preloader.remove();

      // --- Init AOS ---
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    } catch (error) {
      console.error("Error loading case study:", error);
      document.getElementById("cs-title").textContent = "Project Not Found";
      const preloader = document.getElementById("preloader");
      if (preloader) preloader.remove();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadCaseStudy);
  } else {
    loadCaseStudy();
  }
})();
