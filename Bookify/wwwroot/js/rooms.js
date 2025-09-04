// =======================
// Rooms Section JS
// =======================

// Animate cards on scroll
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".room-card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
});

// =======================
// Rotating Cube Controls
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const cube = document.querySelector(".cube");
    if (!cube) return;

    let rotateX = -20, rotateY = -20;
    let isDragging = false, startX, startY;

    // Drag to rotate cube
    cube.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener("mouseup", () => { isDragging = false; });
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        let deltaX = e.clientX - startX;
        let deltaY = e.clientY - startY;
        rotateY += deltaX * 0.3;
        rotateX -= deltaY * 0.3;
        cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        startX = e.clientX;
        startY = e.clientY;
    });

    // Auto spin cube
    let autoRotate = setInterval(() => {
        rotateY += 1;
        cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, 50);

    // Pause auto rotation on hover
    cube.addEventListener("mouseenter", () => clearInterval(autoRotate));
    cube.addEventListener("mouseleave", () => {
        autoRotate = setInterval(() => {
            rotateY += 1;
            cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }, 50);
    });
});

// =======================
// Floating Particles
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".particles-container");
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animation = `float ${3 + Math.random() * 5}s linear infinite`;
        container.appendChild(particle);
    }
});

// Floating animation
const style = document.createElement("style");
style.textContent = `
@keyframes float {
  from { transform: translateY(0); opacity: 0.8; }
  to { transform: translateY(-100vh); opacity: 0; }
}`;
document.head.appendChild(style);
