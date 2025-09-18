/////////////////////////////////////////////////////////////// layout
//////////////////////// footer///////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
    // Back to top functionality
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Floating contact menu
    const contactToggle = document.getElementById('contactToggle');
    const floatingMenu = document.getElementById('floatingMenu');

    contactToggle.addEventListener('click', function () {
        floatingMenu.classList.toggle('active');
    });

    // Close floating menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!contactToggle.contains(e.target) && !floatingMenu.contains(e.target)) {
            floatingMenu.classList.remove('active');
        }
    });

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');

    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = this.querySelector('input[type="email"]').value;
        const submitBtn = this.querySelector('.subscribe-btn');

        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span>Subscribing...</span>';

        // Simulate API call
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<span>Subscribe</span><i class="fas fa-paper-plane"></i>';

            if (validateEmail(email)) {
                showMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
                this.reset();
            } else {
                showMessage('Please enter a valid email address.', 'error');
            }
        }, 2000);
    });

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Show success/error messages
    function showMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);

        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 5000);
    }

    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    animateNumber(stat);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const brandStats = document.querySelector('.brand-stats');
    if (brandStats) {
        statsObserver.observe(brandStats);
    }

    // Number animation function
    function animateNumber(element) {
        const target = element.textContent;
        const isDecimal = target.includes('.');
        const numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
        const suffix = target.replace(/[\d.]/g, '');

        let current = 0;
        const increment = numericValue / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                if (isDecimal) {
                    element.textContent = current.toFixed(1) + suffix;
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }
        }, stepTime);
    }

    // Intersection Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    const footerSections = document.querySelectorAll('.footer-section');
    footerSections.forEach(section => {
        fadeObserver.observe(section);
    });

    // Social media link tracking (for analytics)
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const platform = this.querySelector('i').className.split('-').pop();
            console.log(`Social media click: ${platform}`);
            // Here you would typically send this to your analytics service
        });
    });

    // Contact item click handlers
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const icon = item.querySelector('i').className;

        if (icon.includes('phone')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function () {
                window.location.href = 'tel:+20123456789';
            });
        } else if (icon.includes('envelope')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function () {
                window.location.href = 'mailto:info@luxora.com';
            });
        } else if (icon.includes('map')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function () {
                window.open('https://maps.google.com/?q=123+Luxury+Street,+Cairo,+Egypt', '_blank');
            });
        }
    });

    // Dynamic year update
    const currentYear = new Date().getFullYear();
    const copyrightText = document.querySelector('.copyright p');
    if (copyrightText) {
        copyrightText.innerHTML = copyrightText.innerHTML.replace('2025', currentYear);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        // Close floating menu with Escape key
        if (e.key === 'Escape') {
            floatingMenu.classList.remove('active');
        }

        // Back to top with Ctrl/Cmd + Home
        if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    const debouncedScrollHandler = debounce(function () {
    }, 100);

    window.addEventListener('scroll', debouncedScrollHandler);
    function addRippleEffect(button) {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.className = 'ripple';

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 6000);
        });
    }
    const buttons = document.querySelectorAll('.subscribe-btn, .back-to-top, .floating-btn');
    buttons.forEach(addRippleEffect);

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Initialize tooltips (if needed)
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            // Create and show tooltip
        });

        element.addEventListener('mouseleave', function () {
            // Hide tooltip
        });
    });

    console.log('Luxury footer initialized successfully!');
});
//////////////////////////////////////////////////////////////////////////end of the footer js////////////////////////////
/////////////////////////////////////////////////////////////// navbar


document.addEventListener('DOMContentLoaded', function () {
    // Navigation elements
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navContent = document.getElementById('navbarContent');
    const dropdowns = document.querySelectorAll('.dropdown');
    const searchToggle = document.getElementById('searchToggle');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const progressBar = document.getElementById('progressBar');

    // Mobile hamburger menu
    menuToggle.addEventListener('change', function () {
        if (this.checked) {
            navContent.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            navContent.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Mobile dropdown functionality
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');

        dropdownToggle.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');

                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });

    // Search functionality
    searchToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (window.innerWidth <= 768) {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            searchDropdown.classList.toggle('active');
        }
    });

    // Close search dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchDropdown.contains(e.target) && !searchToggle.contains(e.target)) {
            searchDropdown.classList.remove('active');
        }
    });

    // Close search overlay
    closeSearch.addEventListener('click', function () {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close search overlay when clicking outside
    searchOverlay.addEventListener('click', function (e) {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;

        // Update progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                menuToggle.checked = false;
                navContent.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input');
    const searchCategories = document.querySelectorAll('.search-category');

    searchInputs.forEach(input => {
        input.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', searchTerm);
        });

        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    });

    searchCategories.forEach(category => {
        category.addEventListener('click', function () {
            const categoryType = this.querySelector('span').textContent;
            performSearch(categoryType);
        });
    });

    function performSearch(query) {
        console.log('Performing search for:', query);
        // Close search overlay/dropdown
        searchOverlay.classList.remove('active');
        searchDropdown.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Implement actual search functionality here
        // This could redirect to a search results page or filter content
    }

    // Notification functionality
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function () {
            // Toggle notification dropdown/panel
            console.log('Show notifications');
        });
    }

    // Auth state management (simulated)
    function updateAuthState(isLoggedIn) {
        if (isLoggedIn) {
            document.body.classList.add('user-logged-in');
        } else {
            document.body.classList.remove('user-logged-in');
        }
    }

    // Initialize auth state (you would get this from your backend)
    // updateAuthState(false); // Change to true if user is logged in

    // Add loading states to buttons
    const authButtons = document.querySelectorAll('.auth-btn');
    authButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.add('loading');
            // Remove loading state after API call completes
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        // ESC key closes dropdowns and overlays
        if (e.key === 'Escape') {
            searchDropdown.classList.remove('active');
            searchOverlay.classList.remove('active');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }

        // Ctrl/Cmd + K opens search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (window.innerWidth <= 768) {
                searchOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                searchDropdown.classList.add('active');
            }
            // Focus on search input
            setTimeout(() => {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        }
    });

    // Window resize handler
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            // Close mobile menu on desktop
            menuToggle.checked = false;
            navContent.classList.remove('active');
            searchOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';

            // Close mobile dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Add animation delays for staggered effects
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Initialize tooltips (if needed)
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            // Create and show tooltip
        });

        element.addEventListener('mouseleave', function () {
            // Hide tooltip
        });
    });

    // Performance: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounced scroll handler
    const debouncedScrollHandler = debounce(function () {
        // Additional scroll-based functionality can be added here
    }, 100);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Add mobile search button functionality
    function addMobileSearchButton() {
        if (window.innerWidth <= 768) {
            const navActions = document.querySelector('.nav-actions');
            if (navActions && !document.querySelector('.mobile-search-btn')) {
                const mobileSearchBtn = document.createElement('button');
                mobileSearchBtn.className = 'mobile-search-btn';
                mobileSearchBtn.innerHTML = '<i class="fas fa-search"></i>';
                mobileSearchBtn.addEventListener('click', function () {
                    searchOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
                navActions.prepend(mobileSearchBtn);
            }
        }
    }

    // Initialize mobile search button
    addMobileSearchButton();

    // Update mobile search button on resize
    window.addEventListener('resize', addMobileSearchButton);
});
///////////////////////////////////////////////////////////////////////end of the navbar js////////////////////////////
/////////////////////////////////////////////////////////////// index
/////////////////////////// hero section

document.addEventListener("DOMContentLoaded", () => {
    const nextArrow = document.querySelector(".next");
    const prevArrow = document.querySelector(".prev");

    if (window.innerWidth <= 650) {
        initSlider(".hero-section-img-small", 3000, nextArrow, prevArrow);
        document.querySelector(".hero-section-img-small").dataset.initialized = true;
    } else {
        initSlider(".hero-section-img-large", 3000, nextArrow, prevArrow);
        document.querySelector(".hero-section-img-large").dataset.initialized = true;
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth <= 650) {
            const small = document.querySelector(".hero-section-img-small");
            if (small && !small.dataset.initialized) {
                initSlider(".hero-section-img-small", 3000, nextArrow, prevArrow);
                small.dataset.initialized = true;
            }
        } else {
            const large = document.querySelector(".hero-section-img-large");
            if (large && !large.dataset.initialized) {
                initSlider(".hero-section-img-large", 3000, nextArrow, prevArrow);
                large.dataset.initialized = true;
            }
        }
    });
});

function initSlider(containerSelector, intervalTime, nextArrow, prevArrow) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const slides = container.querySelectorAll("img");
    let slideIndex = 0;
    let slideInterval;

    let dotsContainer = container.parentElement.querySelector(".dots");
    if (!dotsContainer) {
        dotsContainer = document.createElement("div");
        dotsContainer.classList.add("dots");
        container.parentElement.appendChild(dotsContainer);
    }
    dotsContainer.innerHTML = ""; 

    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            clearInterval(slideInterval);
            goToSlide(index);
            slideInterval = setInterval(nextSlide, intervalTime);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    if (slides.length > 0) {
        slides.forEach(slide => slide.classList.remove("active"));
        slides[0].classList.add("active");

        slideInterval = setInterval(nextSlide, intervalTime);

        if (nextArrow) {
            nextArrow.onclick = () => {
                clearInterval(slideInterval);
                nextSlide();
                slideInterval = setInterval(nextSlide, intervalTime);
            };
        }

        if (prevArrow) {
            prevArrow.onclick = () => {
                clearInterval(slideInterval);
                prevSlide();
                slideInterval = setInterval(nextSlide, intervalTime);
            };
        }
    }

    function nextSlide() {
        changeSlide(1);
    }

    function prevSlide() {
        changeSlide(-1);
    }

    function goToSlide(index) {
        slides[slideIndex].classList.remove("active");
        dots[slideIndex].classList.remove("active");

        slideIndex = index;

        slides[slideIndex].classList.add("active");
        dots[slideIndex].classList.add("active");
    }

    function changeSlide(direction) {
        slides[slideIndex].classList.remove("active");
        dots[slideIndex].classList.remove("active");

        slideIndex = (slideIndex + direction + slides.length) % slides.length;

        slides[slideIndex].classList.add("active");
        dots[slideIndex].classList.add("active");
    }
}

/////////////////////////// review section

const reviews = document.querySelectorAll(".hero-sections > div");

function handleScroll() {
    const triggerBottom = window.innerHeight * 0.85; 

    reviews.forEach(review => {
        const rect = review.getBoundingClientRect();

        if (rect.top < triggerBottom && rect.bottom > 0) {
            review.classList.add("show");
        } else {
            review.classList.remove("show"); 
        }
    });
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll);


/////////////////////////////////////////////////////////////// make order page
/////////////////////////// form 

// Calculate nights automatically
document.addEventListener("DOMContentLoaded", () => {
    const checkinInput = document.getElementById("check-in-date");
    const nightsInput = document.getElementById("nightsNumber");
    const checkoutInput = document.getElementById("check-out-date");

    const errorMsg = document.createElement("small");
    errorMsg.style.color = "red";
    errorMsg.style.display = "none";
    checkoutInput.parentNode.appendChild(errorMsg);

    function calculateNights() {
        const checkinDate = new Date(checkinInput.value);
        const checkoutDate = new Date(checkoutInput.value);

        if (!isNaN(checkinDate.getTime()) && !isNaN(checkoutDate.getTime())) {
            const diffTime = checkoutDate - checkinDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays > 0) {
                nightsInput.value = diffDays;
                errorMsg.style.display = "none"; 
            } else {
                nightsInput.value = "";
                errorMsg.textContent = "⚠️ Check-out date must be after Check-in date.";
                errorMsg.style.display = "block";
            }
        } else {
            nightsInput.value = "";
            errorMsg.style.display = "none";
        }
    }

    checkinInput.addEventListener("change", calculateNights);
    checkoutInput.addEventListener("change", calculateNights);
});

// Form validation
document.querySelector(".btn").addEventListener("click", function () {
    const terms = document.getElementById("terms");
    if (!terms.checked) {
        alert("You must agree to the Terms & Conditions.");
        return;
    }

    const requiredFields = document.querySelectorAll("input[required], select[required]");
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            alert("Please fill out all required fields.");
            field.focus();
            return;
        }
    }

    alert("Reservation submitted successfully!");
});
