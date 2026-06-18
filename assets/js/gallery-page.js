/**
 * TOPAZ FRP - Interactive Product Gallery Page Controller
 */

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("gallery-grid");
    const filterButtons = document.querySelectorAll(".btn-filter");
    
    // Lightbox Elements
    const lightboxModalEl = document.getElementById("galleryLightboxModal");
    if (!grid || !lightboxModalEl) return;

    const lightboxModal = new bootstrap.Modal(lightboxModalEl);
    const lightboxMediaContainer = document.getElementById("lightbox-media-container");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const btnPrev = document.getElementById("lightbox-prev");
    const btnNext = document.getElementById("lightbox-next");

    let currentFilter = "all";
    let activeMediaList = [];
    let currentActiveIndex = 0;

    // Initialize gallery
    function initGallery() {
        if (typeof GALLERY_PRODUCT_DATA === 'undefined') {
            console.error("Gallery product data is missing! Make sure gallery-product-data.js is loaded.");
            return;
        }

        renderGalleryItems(GALLERY_PRODUCT_DATA);
        setupFilters();
        setupLightboxNavigation();
    }

    // Render cards to grid
    function renderGalleryItems(data) {
        grid.innerHTML = "";
        activeMediaList = data;

        if (data.length === 0) {
            grid.innerHTML = `<div class="text-center w-100 py-5 text-slate-light" style="grid-column: 1 / -1;">No media items found.</div>`;
            return;
        }

        data.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = `gallery-card gallery-item-${item.type}`;
            card.setAttribute("data-index", index);

            const isVideo = item.type === "video";
            const mediaPath = `assets/images/Product/${item.filename}`;

            let mediaHTML = "";
            let overlayIcon = "fa-search-plus";

            if (isVideo) {
                overlayIcon = "fa-play";
                mediaHTML = `
                    <video class="gallery-video" muted playsinline loop preload="metadata">
                        <source src="${mediaPath}" type="video/mp4">
                    </video>`;
            } else {
                mediaHTML = `<img src="${mediaPath}" alt="${item.title}" class="gallery-img" loading="lazy">`;
            }

            card.innerHTML = `
                <div class="gallery-media-wrap">
                    ${mediaHTML}
                    <div class="gallery-overlay">
                        <div class="gallery-icon-circle">
                            <i class="fas ${overlayIcon}"></i>
                        </div>
                    </div>
                </div>
                <div class="gallery-info">
                    <h4 class="gallery-title">${item.title}</h4>
                    <span class="gallery-badge gallery-badge-${item.type}">${item.type}</span>
                </div>
            `;

            // Hover play/pause behavior for video previews
            if (isVideo) {
                const videoEl = card.querySelector("video");
                card.addEventListener("mouseenter", () => {
                    videoEl.play().catch(() => {});
                });
                card.addEventListener("mouseleave", () => {
                    videoEl.pause();
                    videoEl.currentTime = 0;
                });
            }

            // Click listener to open Lightbox
            card.addEventListener("click", () => {
                openLightbox(index);
            });

            grid.appendChild(card);
        });

        // GSAP Stagger Entrance Animation
        gsap.fromTo(grid.querySelectorAll(".gallery-card"), 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: "power2.out" }
        );
    }

    // Set up filtering
    function setupFilters() {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                if (btn.classList.contains("active")) return;

                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                currentFilter = btn.getAttribute("data-filter");
                
                const filteredData = GALLERY_PRODUCT_DATA.filter(item => {
                    if (currentFilter === "all") return true;
                    return item.type === currentFilter;
                });

                // Fade out current grid items, then render new ones
                const currentCards = grid.querySelectorAll(".gallery-card");
                if (currentCards.length > 0) {
                    gsap.to(currentCards, {
                        opacity: 0,
                        y: -15,
                        duration: 0.25,
                        stagger: 0.01,
                        onComplete: () => {
                            renderGalleryItems(filteredData);
                        }
                    });
                } else {
                    renderGalleryItems(filteredData);
                }
            });
        });
    }

    // Lightbox Open
    function openLightbox(index) {
        currentActiveIndex = index;
        updateLightboxContent();
        lightboxModal.show();
    }

    // Update Modal content
    function updateLightboxContent() {
        const item = activeMediaList[currentActiveIndex];
        if (!item) return;

        lightboxMediaContainer.innerHTML = "";
        const isVideo = item.type === "video";
        const mediaPath = `assets/images/Product/${item.filename}`;

        if (isVideo) {
            lightboxMediaContainer.innerHTML = `
                <div class="lightbox-video-wrap">
                    <video controls autoplay loop class="img-fluid" style="outline: none;">
                        <source src="${mediaPath}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>`;
        } else {
            lightboxMediaContainer.innerHTML = `
                <div class="lightbox-img-wrap">
                    <img src="${mediaPath}" alt="${item.title}" class="img-fluid">
                </div>`;
        }

        lightboxCaption.textContent = item.title;

        // Hide navigation arrows if there is only 1 item in the active selection
        if (activeMediaList.length <= 1) {
            btnPrev.style.display = "none";
            btnNext.style.display = "none";
        } else {
            btnPrev.style.display = "flex";
            btnNext.style.display = "flex";
        }
    }

    // Setup Lightbox Navigation controls
    function setupLightboxNavigation() {
        // Prev button click
        btnPrev.addEventListener("click", (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });

        // Next button click
        btnNext.addEventListener("click", (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (!lightboxModalEl.classList.contains("show")) return;
            
            if (e.key === "ArrowLeft") {
                navigateLightbox(-1);
            } else if (e.key === "ArrowRight") {
                navigateLightbox(1);
            }
        });

        // Clear content (pausing videos) when modal is closed
        lightboxModalEl.addEventListener("hidden.bs.modal", () => {
            lightboxMediaContainer.innerHTML = "";
        });
    }

    function navigateLightbox(direction) {
        const currentCards = activeMediaList.length;
        if (currentCards <= 1) return;

        const currentElement = lightboxMediaContainer.firstElementChild;
        if (!currentElement) return;

        // Transition fade out
        gsap.to(currentElement, {
            opacity: 0,
            scale: 0.95,
            duration: 0.15,
            onComplete: () => {
                currentActiveIndex = (currentActiveIndex + direction + currentCards) % currentCards;
                updateLightboxContent();
                
                // Transition fade in
                const newElement = lightboxMediaContainer.firstElementChild;
                if (newElement) {
                    gsap.fromTo(newElement, 
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" }
                    );
                }
            }
        });
    }

    // Run Gallery Initialization
    initGallery();
});
