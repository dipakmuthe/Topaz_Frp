/**
 * TOPAZ FRP - GSAP Creative Preloader & Session Transition Script
 */

// 1. Session Transition Interceptor: Check clicks on local links
document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (anchor && anchor.href) {
        try {
            const url = new URL(anchor.href);
            // If navigating within the same origin, flag it to skip preloader
            if (url.origin === window.location.origin) {
                sessionStorage.setItem("switched-page", "true");
            }
        } catch (err) {
            // Ignore invalid URLs
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("web-loader");
    const isSwitchedPage = sessionStorage.getItem("switched-page") === "true";

    // --- Preloader Orchestration ---
    if (loader) {
        if (isSwitchedPage) {
            // Clear flag immediately
            sessionStorage.removeItem("switched-page");
            // Bypassing preloader: hide loader instantly
            document.body.classList.remove("loading");
            loader.style.display = "none";
            
            // Instantly reveal hero showcase if present
            if (document.querySelector(".hero-right-showcase")) {
                gsap.set(".hero-right-showcase", { opacity: 1, scale: 1, rotationY: 0, rotationX: 0, y: 0 });
            }

            // Refresh ScrollTrigger to ensure triggers align correctly
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }
        } else {
            // Run preloader
            document.body.classList.add("loading");

            const circleProgress = document.querySelector(".loader-circle-progress");
            const percentageText = document.querySelector(".loader-percentage");
            const logo = document.querySelector(".loader-logo");

            // Circumference of CX=50, CY=50, R=45 circle is 2*PI*45 ≈ 283
            const maxOffset = 283;

            // Set initial preloader states
            gsap.set(logo, { opacity: 0, scale: 0.75 });
            if (circleProgress) circleProgress.style.strokeDashoffset = maxOffset;
            if (percentageText) percentageText.textContent = "0%";

            const progressObj = { value: 0 };
            let isWindowLoaded = false;
            let finishTriggered = false;

            // Start logo entrance & breathing micro-animation
            const introTl = gsap.timeline();
            introTl.to(logo, {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.5)",
                onComplete: () => {
                    // Creative logo breath loop
                    gsap.to(logo, {
                        scale: 1.06,
                        duration: 0.8,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                }
            });

            // Animate progress up to 85%
            const progressTl = gsap.to(progressObj, {
                value: 85,
                duration: 1.5,
                ease: "power2.out",
                onUpdate: () => {
                    const percent = Math.round(progressObj.value);
                    updatePreloaderState(percent);
                },
                onComplete: () => {
                    if (isWindowLoaded && !finishTriggered) {
                        finishLoading();
                    }
                }
            });

            function updatePreloaderState(percent) {
                if (percentageText) percentageText.textContent = `${percent}%`;
                if (circleProgress) {
                    const offset = maxOffset - (maxOffset * percent) / 100;
                    circleProgress.style.strokeDashoffset = offset;
                }
            }

            function finishLoading() {
                if (finishTriggered) return;
                finishTriggered = true;

                progressTl.kill(); // Stop the active 85% tween
                gsap.killTweensOf(progressObj);

                gsap.to(progressObj, {
                    value: 100,
                    duration: 0.4,
                    ease: "power1.out",
                    onUpdate: () => {
                        const percent = Math.round(progressObj.value);
                        updatePreloaderState(percent);
                    },
                    onComplete: () => {
                        // Outro preloader reveal transitions
                        const outro = gsap.timeline({
                            onComplete: () => {
                                document.body.classList.remove("loading");
                                loader.style.display = "none";
                                // Refresh ScrollTrigger to ensure triggers align correctly
                                if (window.ScrollTrigger) {
                                    ScrollTrigger.refresh();
                                }
                            }
                        });

                        outro.to(".loader-inner", {
                            opacity: 0,
                            scale: 0.9,
                            y: -20,
                            duration: 0.4,
                            ease: "power2.in"
                        });

                        outro.to(loader, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.out"
                        }, "-=0.2");

                        // Smoothly animate in the hero image showcase on first load
                        if (document.querySelector(".hero-right-showcase")) {
                            outro.fromTo(".hero-right-showcase", {
                                opacity: 0,
                                scale: 0.75,
                                rotationY: -35,
                                rotationX: 12,
                                y: 50
                            }, {
                                opacity: 1,
                                scale: 1,
                                rotationY: 0,
                                rotationX: 0,
                                y: 0,
                                duration: 1.25,
                                ease: "power4.out"
                            }, "-=0.35");
                        }
                    }
                });
            }

            // Monitor document readyState and window load events
            if (document.readyState === "complete") {
                isWindowLoaded = true;
                setTimeout(() => {
                    finishLoading();
                }, 300);
            } else {
                window.addEventListener("load", () => {
                    isWindowLoaded = true;
                    if (progressObj.value >= 85) {
                        finishLoading();
                    }
                });
            }

            // Safety fallback: auto-finish if page doesn't load fully within 4.5 seconds
            setTimeout(() => {
                if (!finishTriggered) {
                    isWindowLoaded = true;
                    finishLoading();
                }
            }, 4500);
        }
    }

    // --- Why Choose Us Section GSAP ScrollTrigger Animation ---
    const whyChooseSection = document.getElementById("why-choose-us");
    if (whyChooseSection) {
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        const visualMain = whyChooseSection.querySelector(".why-choose-main-img");
        const visualOverlap = whyChooseSection.querySelector(".why-choose-overlap-img");
        const visualBadge = whyChooseSection.querySelector(".why-choose-badge");
        
        const textPre = whyChooseSection.querySelector(".ps-lg-4 > span");
        const textTitle = whyChooseSection.querySelector(".why-choose-header-title");
        const featureCards = whyChooseSection.querySelectorAll(".why-choose-feature-card");

        // Set initial states
        gsap.set(visualMain, { opacity: 0, x: -60 });
        gsap.set(visualOverlap, { opacity: 0, x: 60, y: 40 });
        gsap.set(visualBadge, { opacity: 0, scale: 0.2, rotate: -45 });
        gsap.set([textPre, textTitle], { opacity: 0, y: 30 });
        gsap.set(featureCards, { opacity: 0, y: 25 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: whyChooseSection,
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });

        tl.to(visualMain, {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out"
        })
        .to(visualOverlap, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power3.out"
        }, "-=0.75")
        .to(visualBadge, {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: "back.out(1.6)"
        }, "-=0.5")
        .to([textPre, textTitle], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out"
        }, "-=0.75")
        .to(featureCards, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out"
        }, "-=0.45");
    }

    // --- Vision & Mission Cards GSAP ScrollTrigger 3D Entry Animation ---
    const visionMissionSection = document.getElementById("vision-mission");
    if (visionMissionSection) {
        gsap.registerPlugin(ScrollTrigger);

        const visionCard = visionMissionSection.querySelector(".vision-card");
        const missionCard = visionMissionSection.querySelector(".mission-card");
        const headingPre = visionMissionSection.querySelector(".section-heading > span");
        const headingTitle = visionMissionSection.querySelector(".section-heading > h2");
        const headingSub = visionMissionSection.querySelector(".section-heading > p");

        // Set initial 3D states
        gsap.set([headingPre, headingTitle, headingSub], { opacity: 0, y: 30 });
        gsap.set(visionCard, { 
            opacity: 0, 
            x: -80, 
            rotationY: -20,
            transformOrigin: "right center"
        });
        gsap.set(missionCard, { 
            opacity: 0, 
            x: 80, 
            rotationY: 20,
            transformOrigin: "left center"
        });

        const vTl = gsap.timeline({
            scrollTrigger: {
                trigger: visionMissionSection,
                start: "top 75%",
                toggleActions: "play none none none",
                onEnter: () => {
                    visionMissionSection.classList.add("active");
                    visionMissionSection.classList.add("animate-active");
                }
            }
        });

        vTl.to([headingPre, headingTitle, headingSub], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        })
        .to([visionCard, missionCard], {
            opacity: 1,
            x: 0,
            rotationY: 0,
            duration: 1.25,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=0.4");
    }

    // --- Centralized Section Scroll Animations (Reveal In Only) ---
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const sections = document.querySelectorAll("main > section, body > section, footer.footer-custom");

        sections.forEach((section) => {
            // Exclude the preloader, sections with custom scroll triggers (Why Choose Us, Vision & Mission), or explicit bypasses
            if (
                section.id === "why-choose-us" || 
                section.id === "vision-mission" ||
                section.id === "web-loader" ||
                section.closest("#web-loader") || 
                section.classList.contains("no-gsap-scroll")
            ) {
                return;
            }

            // Apply utility class
            section.classList.add("gsap-scroll-animate");

            // Set initial state: faded and shifted down
            gsap.set(section, { opacity: 0, y: 40 });

            // Reveal once when section enters viewport — no leave/leaveBack to avoid scroll sticking
            ScrollTrigger.create({
                trigger: section,
                start: "top 88%",
                once: true,
                onEnter: () => {
                    gsap.to(section, {
                        opacity: 1,
                        y: 0,
                        duration: 0.75,
                        ease: "power2.out",
                        clearProps: "transform,opacity",
                        onComplete: () => {
                            section.classList.add("active");
                            section.classList.add("animate-active");
                        }
                    });
                }
            });
        });
    }
});
