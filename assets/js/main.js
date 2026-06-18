/**
 * TOPAZ FRP - Premium Corporate Website Interactions
 * Author: Experienced Frontend Developer
 */

document.addEventListener('DOMContentLoaded', function () {
    // --- Sticky Navbar on Scroll ---
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Responsive image loading defaults ---
    document.querySelectorAll('img').forEach(function (img) {
        const isPriorityAsset = img.closest('.navbar-brand-custom, .hero-fullscreen, .page-header-custom') || img.id === 'logo';
        if (!img.hasAttribute('loading') && !isPriorityAsset) {
            img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
    });

    // --- Smooth section reveal defaults across all pages ---
    document.querySelectorAll('main > section, body > section, footer.footer-custom').forEach(function (section) {
        if (section.id === 'why-choose-us' || section.classList.contains('no-gsap-scroll')) {
            return;
        }
        if (!section.classList.contains('reveal-on-scroll')) {
            section.classList.add('reveal-on-scroll');
        }
    });

    // --- Intersection Observer for Scroll Reveals & Animations ---
    let revealElements = document.querySelectorAll('.reveal-on-scroll, .animate-fade-up, .animate-fade-in, .animate-zoom-in, .animate-slide-left, .animate-slide-right');
    
    if (window.gsap && window.ScrollTrigger) {
        revealElements = Array.from(revealElements).filter(function (elem) {
            // Exclude main sections and footer which will be animated via GSAP
            return !elem.matches('main > section, body > section, footer.footer-custom');
        });
    }

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.classList.add('animate-active');
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (elem) {
            revealObserver.observe(elem);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(function (elem) {
            elem.classList.add('active');
            elem.classList.add('animate-active');
        });
    }

    // --- Counter Animation ---
    const counterElements = document.querySelectorAll('.stat-counter');
    if (counterElements.length > 0) {
        const animateCounter = function (element) {
            const target = parseInt(element.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;

            const timer = setInterval(function () {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = current;
                }
            }, stepTime);
        };

        // Trigger counters when they come into view
        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counterElements.forEach(function (elem) {
                counterObserver.observe(elem);
            });
        } else {
            counterElements.forEach(animateCounter);
        }
    }

    // --- Mobile Mega Menu Toggle Accordion ---
    const dropdownToggle = document.querySelector('.dropdown-mega > .dropdown-toggle');
    const megaMenu = document.querySelector('.dropdown-mega-menu');
    if (dropdownToggle && megaMenu) {
        dropdownToggle.addEventListener('click', function (e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                megaMenu.classList.toggle('show');
            }
        });
    }

    // Close mobile menu after choosing a normal navigation link.
    const navbarCollapse = document.getElementById('navbarContent');
    if (navbarCollapse && window.bootstrap) {
        navbarCollapse.querySelectorAll('a.nav-link:not(.dropdown-toggle), .nav-item .btn').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
                }
            });
        });
    }

    // --- Dynamic Quote Generator / Inquiry Calculator ---
    const productSelect = document.getElementById('calc-product');
    const sizeSelect = document.getElementById('calc-size');
    const loadSelect = document.getElementById('calc-load');
    const qtyInput = document.getElementById('calc-qty');

    if (productSelect && sizeSelect && loadSelect && qtyInput) {
        // Define sizes mapped to product categories
        const productSizes = {
            'square-manhole': [
                '12" X 12" (300mm x 300mm)',
                '18" X 18" (450mm x 450mm)',
                '24" X 24" (600mm x 600mm)',
                '30" X 30" (750mm x 750mm)',
                '36" X 36" (900mm x 900mm)',
                '40" X 40" (1000mm x 1000mm)',
                '48" X 48" (1200mm x 1200mm)',
                '60" X 60" (1500mm x 1500mm)'
            ],
            'rect-manhole': [
                '18" X 24" (450mm x 600mm)',
                '18" X 36" (450mm x 900mm)',
                '24" X 36" (600mm x 900mm)',
                '24" X 48" (600mm x 1200mm)',
                '48" X 36" (900mm x 1200mm)'
            ],
            'circle-manhole': [
                '21" Round (530mm Round)',
                '22" Round (560mm Round)',
                '24" Round (600mm Round)',
                '36" Round (900mm Round)'
            ],
            'tank-cover': [
                '24" Round (600mm Round) - Overhead (500kg)',
                '24" X 24" (600mm x 600mm) - Overhead (500kg)',
                '22" Round (560mm Round) - Underground (EPDM Double Seal)',
                '24" Round (600mm Round) - Underground (EPDM Double Seal)',
                '24" X 24" (600mm x 600mm) - Underground (EPDM Double Seal)'
            ],
            'recess-cover': [
                '18" X 18" (450mm x 450mm) - 65mm Depth',
                '18" X 24" (450mm x 600mm) - 65mm Depth',
                '24" X 24" (600mm x 600mm) - 65mm/32mm Depth',
                '18" X 36" (450mm x 900mm) - 65mm Depth',
                '24" X 36" (600mm x 900mm) - 65mm Depth',
                '22" X 22" (558mm x 558mm) - 32mm Depth'
            ],
            'gratings': [
                '24" Round (600mm Round)',
                '18" X 18" (450mm x 450mm)',
                '24" X 24" (600mm x 600mm)',
                '36" X 36" (900mm x 900mm)',
                '12" X 24" (300mm x 600mm)',
                '20" X 24" (500mm x 600mm)',
                '18" X 36" (450mm x 900mm)',
                '24" X 36" (600mm x 900mm)',
                '21" Round (530mm Round)',
                '14" X 40" (350mm x 1000mm)'
            ],
            'moulded-gratings': [
                'FRP Chequered Grating - Custom Standard Size',
                'FRP Stair Tread - Custom Standard Size'
            ],
            'planters-pergolas': [
                'FRP Cylindrical Planter',
                'FRP Square Planter',
                'FRP Pergola Structure'
            ],
            'custom-frp': [
                'FRP Window Shades / Chajja',
                'FRP Doors',
                'Other Custom Specifications'
            ]
        };

        const updateSizes = function () {
            const selectedProduct = productSelect.value;
            sizeSelect.innerHTML = '';

            if (productSizes[selectedProduct]) {
                productSizes[selectedProduct].forEach(function (size) {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    sizeSelect.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = '-- Select Product First --';
                sizeSelect.appendChild(option);
            }
            updateSummary();
        };

        const updateSummary = function () {
            document.getElementById('summary-product').textContent = productSelect.options[productSelect.selectedIndex]?.text || '-';
            document.getElementById('summary-size').textContent = sizeSelect.value || '-';
            document.getElementById('summary-load').textContent = loadSelect.options[loadSelect.selectedIndex]?.text || '-';
            document.getElementById('summary-qty').textContent = qtyInput.value || '1';

            // Set values inside hidden fields in the form if needed
            const hiddenMsg = document.getElementById('enquiry-message');
            if (hiddenMsg) {
                hiddenMsg.value = `Enquiry Details:\nProduct: ${productSelect.options[productSelect.selectedIndex].text}\nSize: ${sizeSelect.value}\nLoad Class: ${loadSelect.options[loadSelect.selectedIndex].text}\nQuantity: ${qtyInput.value}`;
            }
        };

        productSelect.addEventListener('change', updateSizes);
        sizeSelect.addEventListener('change', updateSummary);
        loadSelect.addEventListener('change', updateSummary);
        qtyInput.addEventListener('input', updateSummary);

        // Initial trigger
        updateSizes();
    }

    // --- Floating Action Buttons (WhatsApp & Scroll To Top) ---
    const floatingGroup = document.createElement('div');
    floatingGroup.className = 'floating-btn-group';

    // WhatsApp Button
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/919422012188?text=Hello%20Topaz%20FRP%2C%20I%20would%20like%20to%20enquire%20about%20your%20products%20and%20solutions.';
    whatsappBtn.target = '_blank';
    whatsappBtn.className = 'floating-btn floating-btn-whatsapp';
    whatsappBtn.title = 'Chat on WhatsApp';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';

    // Scroll To Top Button
    const scrollupBtn = document.createElement('button');
    scrollupBtn.className = 'floating-btn floating-btn-scrollup';
    scrollupBtn.title = 'Scroll to Top';
    scrollupBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';

    floatingGroup.appendChild(whatsappBtn);
    floatingGroup.appendChild(scrollupBtn);
    document.body.appendChild(floatingGroup);

    // Scroll to Top Logic
    const toggleScrollButton = function () {
        if (window.scrollY > 300) {
            scrollupBtn.classList.add('show');
        } else {
            scrollupBtn.classList.remove('show');
        }
    };
    window.addEventListener('scroll', toggleScrollButton);
    toggleScrollButton(); // check on load

    scrollupBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Canvas Particle Simulation ---
    const canvas = document.getElementById('hero-particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 65; // Slightly increased for a richer field

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.2 + 0.8;
                this.speedY = -(Math.random() * 0.8 + 0.3);
                this.speedX = Math.random() * 0.5 - 0.25;
                this.alpha = Math.random() * 0.45 + 0.15;
                // Mixed colors: 65% Orange, 35% White/Glow
                this.color = Math.random() > 0.35 ? '#F26A21' : '#FFFFFF';
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                if (this.color === '#FFFFFF') {
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#FFFFFF';
                } else {
                    ctx.shadowBlur = 3;
                    ctx.shadowColor = '#F26A21';
                }
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // --- 3D Card Tilt ---
    const tiltCards = document.querySelectorAll('.marquee-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((centerY - y) / centerY) * 10; // max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * -10;

            // Combine lift, scale, and 3D tilt
            card.style.transform = `translateY(-15px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
        });
    });

    // --- Redesigned Homepage Hero Typewriter, Counter, Parallax, and Scroll Click ---
    
    // 1. Typewriter Animation for "Trusted Worldwide."
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const textToType = "Trusted Worldwide.";
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let deletingSpeed = 60;
        let pauseEnd = 3000; // Pause when full text is shown
        let pauseStart = 500; // Pause when fully deleted

        function type() {
            if (!isDeleting) {
                charIdx++;
                typewriterElement.textContent = textToType.substring(0, charIdx);
                if (charIdx === textToType.length) {
                    isDeleting = true;
                    setTimeout(type, pauseEnd);
                } else {
                    setTimeout(type, typingSpeed);
                }
            } else {
                charIdx--;
                typewriterElement.textContent = textToType.substring(0, charIdx);
                if (charIdx === 0) {
                    isDeleting = false;
                    setTimeout(type, pauseStart);
                } else {
                    setTimeout(type, deletingSpeed);
                }
            }
        }
        setTimeout(type, 500);
    }

    // 2. Immediate Hero Counters
    const heroCounters = document.querySelectorAll('.hero-counter');
    if (heroCounters.length > 0) {
        heroCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            let current = 0;
            const stepTime = Math.max(Math.floor(duration / target), 15);
            const increment = Math.ceil(target / (duration / stepTime));
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = current;
                }
            }, stepTime);
        });
    }

    // 3. Single Product Showcase Mouse Parallax
    const showcase = document.getElementById('single-product-showcase');
    const productImg = showcase ? showcase.querySelector('.hero-product-image') : null;
    if (showcase && productImg) {
        showcase.addEventListener('mousemove', function (e) {
            const rect = showcase.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Calculate 3D tilt angles
            const tiltX = (y / (rect.height / 2)) * -12; // Max 12 degrees tilt
            const tiltY = (x / (rect.width / 2)) * 12;
            
            // Parallax shift offsets
            const shiftX = x * 0.12;
            const shiftY = y * 0.12;
            
            // Apply tilt and translation styles
            productImg.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 30px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        });
        
        showcase.addEventListener('mouseleave', function () {
            // Reset smoothly back to baseline float position
            productImg.style.transform = '';
        });
    }

    // 4. Scroll Indicator Click Action
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const nextSection = document.getElementById('about-us-summary');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- Center Timeline Scroll-Draw SVG/Height Path ---
    const drawLine = document.getElementById('timeline-scroll-draw');
    const companyStrengths = document.getElementById('company-strengths');
    if (drawLine && companyStrengths) {
        const updateTimelineHeight = () => {
            const rect = companyStrengths.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            if (rect.top < viewHeight && rect.bottom > 0) {
                const totalHeight = rect.height;
                const scrollProgress = (viewHeight - rect.top) / (totalHeight + viewHeight * 0.2);
                const percent = Math.min(Math.max(scrollProgress * 100, 0), 100);
                drawLine.style.height = `${percent}%`;
            }
        };
        window.addEventListener('scroll', updateTimelineHeight);
        updateTimelineHeight();
    }

    // --- Advantages Radial Orbit Infographic ---
    const orbit = document.getElementById('radial-orbit');
    const nodes = document.querySelectorAll('.radial-node-item');
    const detailPanel = document.getElementById('radial-panel');
    const detailTitle = document.getElementById('radial-panel-title');
    const detailDesc = document.getElementById('radial-panel-desc');
    const detailIcon = document.getElementById('radial-panel-icon');

    if (orbit && nodes.length > 0 && detailPanel) {
        nodes.forEach(node => {
            node.addEventListener('mouseenter', function () {
                orbit.classList.add('paused');
                detailPanel.classList.add('active');

                const title = node.getAttribute('data-title');
                const desc = node.getAttribute('data-desc');
                detailTitle.textContent = title;
                detailDesc.textContent = desc;

                // Dynamically sync icon classes
                const nodeIcon = node.querySelector('i');
                if (nodeIcon && detailIcon) {
                    detailIcon.className = nodeIcon.className;
                }
            });

            node.addEventListener('mouseleave', function () {
                orbit.classList.remove('paused');
            });
        });
    }

    // --- Laboratory Workflow Progress Line ---
    const workflowProgress = document.getElementById('workflow-progress');
    const workflowSection = document.getElementById('workflow-section');
    const steps = document.querySelectorAll('.workflow-step-item');

    if (workflowProgress && workflowSection && steps.length > 0) {
        const updateWorkflowLine = () => {
            const rect = workflowSection.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            if (rect.top < viewHeight && rect.bottom > 0) {
                let maxActive = 0;
                steps.forEach((step, idx) => {
                    const stepRect = step.getBoundingClientRect();
                    if (stepRect.top < viewHeight - 100) {
                        step.classList.add('active');
                        maxActive = idx;
                    } else if (idx > 0) {
                        step.classList.remove('active');
                    }
                });

                const totalSteps = steps.length - 1;
                const percent = (maxActive / totalSteps) * 100;

                if (window.innerWidth >= 992) {
                    workflowProgress.style.width = `${percent}%`;
                    workflowProgress.style.height = `100%`;
                } else {
                    workflowProgress.style.height = `${percent}%`;
                    workflowProgress.style.width = `100%`;
                }
            }
        };
        window.addEventListener('scroll', updateWorkflowLine);
        window.addEventListener('resize', updateWorkflowLine);
        updateWorkflowLine();
    }

    // --- Interactive World Map Pins & Tooltips ---
    const pins = document.querySelectorAll('.map-hotspot-pin');
    const mapTooltip = document.getElementById('map-tooltip');

    if (pins.length > 0 && mapTooltip) {
        const hideMapTooltip = function () {
            mapTooltip.classList.remove('active');
        };

        const showMapTooltip = function (pin) {
            const country = pin.getAttribute('data-country');
            const products = pin.getAttribute('data-products');
            const region = pin.getAttribute('data-region');
            const ports = pin.getAttribute('data-ports');

            document.getElementById('tooltip-country').textContent = country;
            document.getElementById('tooltip-region').textContent = region;
            document.getElementById('tooltip-products').textContent = products;
            document.getElementById('tooltip-ports').textContent = ports;

            mapTooltip.classList.add('active');
        };

        pins.forEach(pin => {
            pin.addEventListener('mouseenter', function (e) {
                showMapTooltip(pin);
            });

            pin.addEventListener('mousemove', function (e) {
                const wrapper = pin.closest('.svg-worldmap-wrapper');
                const wrapperRect = wrapper.getBoundingClientRect();
                const mouseX = e.clientX - wrapperRect.left;
                const mouseY = e.clientY - wrapperRect.top;

                mapTooltip.style.left = `${mouseX + 15}px`;
                mapTooltip.style.top = `${mouseY - 30}px`;
            });

            pin.addEventListener('mouseleave', function () {
                hideMapTooltip();
            });

            pin.addEventListener('click', function (e) {
                if (window.innerWidth < 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    showMapTooltip(pin);
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.map-hotspot-pin, .map-tooltip-card')) {
                hideMapTooltip();
            }
        });
    }

    // --- Masonry Wall Certificates Lightbox Popup ---
    const certItems = document.querySelectorAll('.cert-masonry-item');
    const lightboxTarget = document.getElementById('lightbox-target-img');

    if (certItems.length > 0 && lightboxTarget) {
        certItems.forEach(item => {
            item.addEventListener('click', function () {
                const imgSrc = item.getAttribute('data-img');
                lightboxTarget.src = imgSrc;
            });
        });
    }

    // --- Page Load Transition ---
    document.body.classList.add('page-loaded');

    // --- Products Page Interactive Finder Tabs ---
    const finderTabs = document.querySelectorAll('.finder-tab-btn');
    const finderResultImg = document.getElementById('finder-result-img');
    const finderResultTitle = document.getElementById('finder-result-title');
    const finderResultDesc = document.getElementById('finder-result-desc');
    const finderResultSpecs = document.getElementById('finder-result-specs');
    const finderResultLink = document.getElementById('finder-result-link');

    const categoryData = {
        'manhole-covers': {
            title: 'FRP Manhole Covers',
            desc: 'High-strength, lightweight, and completely theft-resistant composite manhole covers certified under BS EN 124 standards.',
            img: 'assets/images/products/circle.svg',
            link: 'manhole-covers.html',
            specs: [
                '<strong>Load Capacity:</strong> 2.5 Tons (A15) up to 40 Tons (D400)',
                '<strong>Standard Sizes:</strong> 12"x12" up to 60"x60" / 21" to 36" Round',
                '<strong>Material:</strong> Fibre-Reinforced Polymer (Thermoset composite)',
                '<strong>Locking:</strong> Optional stainless steel keys & EPDM double seal'
            ]
        },
        'tank-covers': {
            title: 'FRP Water Tank Covers',
            desc: 'Designed for residential and industrial water tanks. Overhead covers feature heavy duty hinges, and underground models feature airtight EPDM rubber gaskets.',
            img: 'assets/images/products/Over Head.svg',
            link: 'tank-covers.html',
            specs: [
                '<strong>Load Capacity:</strong> Pedestrian (500kg) to Heavy Duty (10T)',
                '<strong>Application:</strong> Overhead and Underground concrete tanks',
                '<strong>Features:</strong> Gas-tight, zero fiber shedding, UV stabilized',
                '<strong>Sizing:</strong> Standard 24" Round, 24"x24" Square, and custom sizes'
            ]
        },
        'gratings': {
            title: 'FRP Gully Gratings',
            desc: 'High flow rate drainage storm gratings designed for municipal roads, highways, parking plazas, and chemical refineries.',
            img: 'assets/images/products/GRATINGS.svg',
            link: 'gratings.html',
            specs: [
                '<strong>Load Capacity:</strong> 5 Tons (B125) to 40 Tons (D400)',
                '<strong>Resistance:</strong> Absolute resistance to acids, alkalis, and salts',
                '<strong>Features:</strong> High-discharge slots, skid-proof grid structure',
                '<strong>Application:</strong> Stormwater channels, industrial drainage'
            ]
        },
        'recess-covers': {
            title: 'FRP Recess Covers',
            desc: 'Allows tiles, pavers, granite, or lawn grass to fill the top tray, merging inspection chambers seamlessly with surrounding landscape designs.',
            img: 'assets/images/products/Recess cover.svg',
            link: 'recess-covers.html',
            specs: [
                '<strong>Load Capacity:</strong> 2.5 Tons (A15) to 10 Tons (B125)',
                '<strong>Depths:</strong> 32mm and 65mm tray depths',
                '<strong>Aesthetics:</strong> High-end integration into lobbies, plazas, gardens',
                '<strong>Sizes:</strong> 18"x18" up to 24"x36"'
            ]
        },
        'moulded-gratings': {
            title: 'FRP Moulded Gratings & Stair Treads',
            desc: 'Anti-slip chequered walkway panels and stair treads. Thermally and electrically non-conductive, making them perfect for industrial factories.',
            img: 'assets/images/products/MOULDING GRATING.svg',
            link: 'moulded-gratings.html',
            specs: [
                '<strong>Safety:</strong> Flame-retardant, anti-skid quartz grit surface',
                '<strong>Application:</strong> Refinery flooring, catwalks, stair steps',
                '<strong>Load Class:</strong> Uniformly Distributed Loads (UDL) up to 1000kg/m²',
                '<strong>Customization:</strong> Alternating panel widths, yellow safety noses'
            ]
        },
        'planters-pergolas': {
            title: 'FRP Designer Planters & Pergolas',
            desc: 'Luxury landscape features finished to mock luxury wooden patterns. 100% waterproof, UV-resistant, and structural weather-proof profiles.',
            img: 'assets/images/products/PLANTERS & PARGOLAS.svg',
            link: 'planters-pergolas.html',
            specs: [
                '<strong>Lifespan:</strong> Exceeds 20 years in direct outdoor sun',
                '<strong>Finish:</strong> Wood grain texturing, slate stone, or glossy custom shades',
                '<strong>Aesthetic:</strong> Luxury resort style planters, patio pergola arches',
                '<strong>Weight:</strong> 70% lighter than cement pavers/cast stone elements'
            ]
        }
    };

    if (finderTabs.length > 0 && finderResultTitle) {
        finderTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // Active tab class toggle
                finderTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Get category data
                const category = tab.getAttribute('data-category');
                const data = categoryData[category];

                if (data) {
                    // Smooth fade transition
                    const card = document.querySelector('.finder-result-card');
                    if (card) {
                        card.style.opacity = '0.3';
                        card.style.transform = 'translateY(5px)';
                        card.style.transition = 'opacity 0.25s, transform 0.25s';
                    }

                    setTimeout(() => {
                        finderResultImg.src = data.img;
                        finderResultImg.alt = data.title;
                        finderResultTitle.textContent = data.title;
                        finderResultDesc.textContent = data.desc;
                        finderResultLink.href = data.link;

                        // Clear and populate specs
                        finderResultSpecs.innerHTML = '';
                        data.specs.forEach(spec => {
                            const li = document.createElement('li');
                            li.className = 'mb-2';
                            li.innerHTML = `<i class="fas fa-check text-primary me-2"></i>${spec}`;
                            finderResultSpecs.appendChild(li);
                        });

                        if (card) {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }
                    }, 250);
                }
            });
        });
    }
});

// --- Contact Form Submission handler (Redirect to WhatsApp) ---
function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;

    let messageBody = "Hello TOPAZ FRP, I have an enquiry:\n\n";

    const elements = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    elements.forEach(el => {
        if (el.value && el.value.trim() !== '') {
            let labelElement = el.previousElementSibling;
            let fieldName = "";

            if (labelElement && labelElement.tagName.toLowerCase() === 'label') {
                fieldName = labelElement.textContent.replace('*', '').trim();
            } else if (el.placeholder) {
                fieldName = el.placeholder;
            } else {
                fieldName = "Detail";
            }

            messageBody += `*${fieldName}:* ${el.value}\n`;
        }
    });

    const whatsappNumber = "919422012188";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageBody)}`;

    window.open(whatsappUrl, '_blank');
}

// --- About Page Animations & Canvas particles ---
document.addEventListener('DOMContentLoaded', function () {
    const aboutCanvas = document.getElementById('about-particle-canvas');
    if (aboutCanvas) {
        const ctx = aboutCanvas.getContext('2d');
        let particles = [];
        const maxParticles = 40;

        const resizeCanvas = () => {
            aboutCanvas.width = aboutCanvas.parentElement.clientWidth;
            aboutCanvas.height = aboutCanvas.parentElement.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * aboutCanvas.width;
                this.y = Math.random() * aboutCanvas.height + aboutCanvas.height;
                this.size = Math.random() * 2.5 + 1;
                this.speedY = -(Math.random() * 1.2 + 0.4);
                this.speedX = Math.random() * 0.8 - 0.4;
                this.alpha = Math.random() * 0.4 + 0.15;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                if (this.y < 0) {
                    this.y = aboutCanvas.height;
                    this.x = Math.random() * aboutCanvas.width;
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = '#F26A21';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // --- About Journey Timeline Scroll-Draw SVG/Height Path ---
    const journeyLine = document.getElementById('journey-scroll-draw');
    const journeySection = document.getElementById('journey-storytelling');
    const journeySteps = document.querySelectorAll('.journey-step-creative');

    if (journeyLine && journeySection && journeySteps.length > 0) {
        const updateJourneyHeight = () => {
            const rect = journeySection.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            if (rect.top < viewHeight && rect.bottom > 0) {
                let maxActive = 0;
                journeySteps.forEach((step, idx) => {
                    const stepRect = step.getBoundingClientRect();
                    if (stepRect.top < viewHeight - 100) {
                        step.classList.add('active');
                        maxActive = idx;
                    } else if (idx > 0) {
                        step.classList.remove('active');
                    }
                });

                const totalSteps = journeySteps.length - 1;
                const percent = (maxActive / totalSteps) * 100;
                journeyLine.style.height = `${percent}%`;
            }
        };
        window.addEventListener('scroll', updateJourneyHeight);
        window.addEventListener('resize', updateJourneyHeight);
        updateJourneyHeight();
    }

    // --- Image Reveal Mask Observer ---
    const maskWrappers = document.querySelectorAll('.reveal-mask-wrapper');
    if ('IntersectionObserver' in window && maskWrappers.length > 0) {
        const maskObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        maskWrappers.forEach(wrap => maskObserver.observe(wrap));
    } else {
        maskWrappers.forEach(wrap => wrap.classList.add('active'));
    }
});
