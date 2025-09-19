
    document.addEventListener('DOMContentLoaded', function() {
            const termsNavItems = document.querySelectorAll('.terms-nav-item');
    const termsSections = document.querySelectorAll('.terms-section');
            
            termsNavItems.forEach(item => {
        item.addEventListener('click', function () {
            const sectionId = this.getAttribute('data-section');
            termsNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            const section = document.getElementById(`terms-section-${sectionId}`);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                section.classList.add('terms-highlight-section');
                setTimeout(() => {
                    section.classList.remove('terms-highlight-section');
                }, 2000);
            }
        });
            });
    const termsAcceptBtn = document.querySelector('.terms-accept-btn');

    termsAcceptBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-check"></i> Terms Accepted';
    this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
    this.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
    this.disabled = true;
    const thankYou = document.createElement('p');
    thankYou.innerHTML = '<i class="fas fa-smile"></i> Thank you for accepting our terms!';
    thankYou.style.marginTop = '25px';
    thankYou.style.fontWeight = '600';
    thankYou.style.color = '#4CAF50';
    thankYou.style.fontSize = '18px';

    this.parentNode.appendChild(thankYou);
    createConfetti();
            });
            const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
            }, {threshold: 0.1 });
            termsSections.forEach(section => {
        section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
            });
    window.addEventListener('scroll', function() {
        let current = '';
                termsSections.forEach(section => {
                    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
                    if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id').split('-')[2];
                    }
                });
                
                termsNavItems.forEach(item => {
        item.classList.remove('active');
    if (item.getAttribute('data-section') === current) {
        item.classList.add('active');
                    }
                });
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    document.querySelector('.terms-scroll-progress').style.width = scrollPercent + '%';
            });

    function createConfetti() {
                const colors = ['#D3A376', '#BF8C60', '#4CAF50', '#3E2723', '#FFF2DF'];
    const container = document.querySelector('.terms-acceptance');

    for (let i = 0; i < 50; i++) {
                    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.top = '50%';
    confetti.style.left = '50%';
    confetti.style.opacity = '0';
    container.appendChild(confetti);

    const animation = confetti.animate([
    {opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
    {opacity: 0, transform: `translate(${Math.random() * 200 - 100}%, ${Math.random() * 200 - 100}%) scale(0)` }
    ], {
        duration: 1000 + Math.random() * 1000,
    easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
                    });
                    
                    animation.onfinish = () => confetti.remove();
                }
            }
        });
