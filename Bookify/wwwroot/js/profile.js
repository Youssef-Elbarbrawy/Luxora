document.addEventListener('DOMContentLoaded', function() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
           
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bookingCards = document.querySelectorAll('.booking-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            bookingCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const avatarEditBtn = document.getElementById('avatarEdit');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const avatarImage = document.querySelector('.avatar-image');
                        avatarImage.style.backgroundImage = `url(${e.target.result})`;
                        avatarImage.style.backgroundSize = 'cover';
                        avatarImage.style.backgroundPosition = 'center';
                        avatarImage.innerHTML = '';
                        
                        showMessage('Profile picture updated successfully!', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        });
    }
    const editPersonalInfoBtn = document.getElementById('editPersonalInfo');
    if (editPersonalInfoBtn) {
        editPersonalInfoBtn.addEventListener('click', function() {

            showMessage('Edit profile feature coming soon!', 'info');
        });
    }

    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span').textContent;

            this.classList.add('loading');

            setTimeout(() => {
                this.classList.remove('loading');
                showMessage(`${action} feature activated!`, 'success');
            }, 1500);
        });
    });

    const progressBars = document.querySelectorAll('.progress-fill');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                progressObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    const statValues = document.querySelectorAll('.stat-value');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statValues.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateNumber(element) {
        const target = element.textContent;
        const isDecimal = target.includes('.');
        const numericValue = parseFloat(target);
        let current = 0;
        const increment = numericValue / 30;
        const duration = 1500;
        const stepTime = duration / 30;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                if (isDecimal) {
                    element.textContent = current.toFixed(1);
                } else {
                    element.textContent = Math.floor(current);
                }
            }
        }, stepTime);
    }
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.closest('.toggle-item').querySelector('span').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            showMessage(`${setting} ${status}`, 'success');
        });
    });

    const securityBtns = document.querySelectorAll('.security-btn');
    securityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent;
            
            this.classList.add('loading');
            
            setTimeout(() => {
                this.classList.remove('loading');
                showMessage(`${action} completed successfully!`, 'success');
            }, 2000);
        });
    });

    const revokeBtns = document.querySelectorAll('.revoke-btn');
    revokeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to revoke this session?')) {
                this.closest('.session-item').style.display = 'none';
                showMessage('Session revoked successfully!', 'success');
            }
        });
    });

    const editReviewBtns = document.querySelectorAll('.edit-review-btn');
    const deleteReviewBtns = document.querySelectorAll('.delete-review-btn');
    
    editReviewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showMessage('Edit review feature coming soon!', 'info');
        });
    });
    
    deleteReviewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this review?')) {
                this.closest('.review-card').style.display = 'none';
                showMessage('Review deleted successfully!', 'success');
            }
        });
    });

    const bookingActionBtns = document.querySelectorAll('.booking-actions .action-btn');
    bookingActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent;
            
            this.classList.add('loading');
            
            setTimeout(() => {
                this.classList.remove('loading');
                showMessage(`${action} action completed!`, 'success');
            }, 1500);
        });
    });

    const preferenceSelects = document.querySelectorAll('.option-item select');
    preferenceSelects.forEach(select => {
        select.addEventListener('change', function() {
            const option = this.closest('.option-item').querySelector('label').textContent;
            const value = this.value;
            showMessage(`${option} updated to: ${value}`, 'success');
        });
    });

    const profileLinks = document.querySelectorAll('a[href^="#"]');
    profileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

    const searchInput = document.querySelector('.booking-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const bookingCards = document.querySelectorAll('.booking-card');
            
            bookingCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const info = card.querySelector('.booking-info').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || info.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    let autoSaveTimeout;
    const autoSaveElements = document.querySelectorAll('select, input[type="checkbox"]');
    autoSaveElements.forEach(element => {
        element.addEventListener('change', function() {
            clearTimeout(autoSaveTimeout);

            const indicator = document.createElement('div');
            indicator.className = 'save-indicator';
            indicator.textContent = 'Saving...';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: #f0ad4e;
                color: white;
                padding: 8px 15px;
                border-radius: 5px;
                font-size: 0.9rem;
                z-index: 10000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(indicator);
            
            autoSaveTimeout = setTimeout(() => {
                indicator.textContent = 'Saved!';
                indicator.style.background = '#5cb85c';
                
                setTimeout(() => {
                    indicator.style.opacity = '0';
                    setTimeout(() => {
                        if (indicator.parentNode) {
                            indicator.parentNode.removeChild(indicator);
                        }
                    }, 300);
                }, 1000);
            }, 1000);
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const tabIndex = parseInt(e.key) - 1;
            const tabs = document.querySelectorAll('.nav-tab');
            if (tabs[tabIndex]) {
                tabs[tabIndex].click();
            }
        }

        if (e.key === 'Escape') {

            const activeElements = document.querySelectorAll('.active:not(.nav-tab):not(.tab-content)');
            activeElements.forEach(el => el.classList.remove('active'));
        }
    });

    function showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }

    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        let tooltip;
        
        element.addEventListener('mouseenter', function() {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                z-index: 10000;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            setTimeout(() => {
                if (tooltip) tooltip.style.opacity = '1';
            }, 100);

            this.setAttribute('data-title', this.getAttribute('title'));
            this.removeAttribute('title');
        });
        
        element.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 300);
            }

            if (this.getAttribute('data-title')) {
                this.setAttribute('title', this.getAttribute('data-title'));
                this.removeAttribute('data-title');
            }
        });
    });

    let performanceMetrics = {
        tabSwitches: 0,
        actionsPerformed: 0,
        timeSpent: Date.now()
    };

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            performanceMetrics.tabSwitches++;
        });
    });

    document.addEventListener('click', function(e) {
        if (e.target.matches('button, .action-btn, .quick-action-btn')) {
            performanceMetrics.actionsPerformed++;
        }
    });

    window.addEventListener('beforeunload', function() {
        performanceMetrics.timeSpent = Date.now() - performanceMetrics.timeSpent;
        console.log('Profile Page Analytics:', performanceMetrics);
    });

    console.log('Luxury Profile Page initialized successfully!');

    setTimeout(() => {
        const profileInfo = document.querySelector('.profile-info h1');
        if (profileInfo) {
            profileInfo.style.animation = 'pulse 0.6s ease-in-out';
        }
    }, 500);
    
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
    `;
    document.head.appendChild(pulseStyle);
});
