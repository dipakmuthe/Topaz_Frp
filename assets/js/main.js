/**
 * TOPAZ FRP - Premium Corporate Website Interactions
 * Author: Experienced Frontend Developer
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- Sticky Navbar on Scroll ---
    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Intersection Observer for Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function(elem) {
            revealObserver.observe(elem);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(function(elem) {
            elem.classList.add('active');
        });
    }

    // --- Counter Animation ---
    const counterElements = document.querySelectorAll('.stat-counter');
    if (counterElements.length > 0) {
        const animateCounter = function(element) {
            const target = parseInt(element.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;

            const timer = setInterval(function() {
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
            const counterObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counterElements.forEach(function(elem) {
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
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                megaMenu.classList.toggle('show');
            }
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

        const updateSizes = function() {
            const selectedProduct = productSelect.value;
            sizeSelect.innerHTML = '';
            
            if (productSizes[selectedProduct]) {
                productSizes[selectedProduct].forEach(function(size) {
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

        const updateSummary = function() {
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
});

// --- Simple Contact Form Submission handler (mock) ---
function handleContactSubmit(event) {
    event.preventDefault();
    const btn = event.submitter;
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending Enquiry...';
    
    setTimeout(function() {
        btn.innerHTML = '<i class="fas fa-check me-2"></i>Sent Successfully!';
        btn.classList.replace('btn-primary-custom', 'btn-success');
        
        // Show thank you alert
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-success mt-4 reveal-on-scroll active';
        alertBox.role = 'alert';
        alertBox.innerHTML = '<strong>Thank you!</strong> Your quote request has been sent successfully. One of our technical executives will contact you shortly.';
        
        const form = event.target;
        form.appendChild(alertBox);
        form.reset();
        
        setTimeout(function() {
            btn.disabled = false;
            btn.innerHTML = originalText;
            btn.classList.replace('btn-success', 'btn-primary-custom');
            alertBox.remove();
        }, 6000);
        
    }, 1500);
}
