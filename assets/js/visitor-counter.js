/**
 * Visitor Counter
 * Fetches the total unique visitors from data/stats.json
 * and renders it into the DOM with a counting animation.
 */
(function () {
    "use strict";

    const STATS_URL = "data/stats.json";
    const COUNTER_SELECTOR = "#visitor-count";
    const ANIMATION_DURATION = 2000; // ms

    /**
     * Animate counting from 0 to target number.
     */
    function animateCount(element, target) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

            // Ease-out cubic for a smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * (target - start) + start);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Fetch stats and display the visitor count.
     */
    async function init() {
        const counterEl = document.querySelector(COUNTER_SELECTOR);
        if (!counterEl) return;

        try {
            const response = await fetch(STATS_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const total = data.totalUniqueVisitors || 0;

            // Use Intersection Observer to trigger animation when visible
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateCount(counterEl, total);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            observer.observe(counterEl.closest(".visitor-counter") || counterEl);
        } catch (error) {
            console.warn("Visitor counter: Could not load stats.", error);
            counterEl.textContent = "—";
        }
    }

    // Run on DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();