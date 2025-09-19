
    document.addEventListener('DOMContentLoaded', function() {
            const logoutBtn = document.getElementById('logoutBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    const finalLogout = document.getElementById('finalLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // Open confirmation modal
    logoutBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'flex';
            });

    // Final logout action
    finalLogout.addEventListener('click', function() {
                // Simulate logout process
                const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
    <div class="modal-icon">
        <i class="fas fa-check-circle" style="color:#81c784"></i>
    </div>
    <h2 class="modal-title">Successfully Logged Out</h2>
    <p class="modal-message">You have been successfully signed out of your account.</p>
    <div class="modal-actions">
        <a href="#" class="modal-btn modal-confirm">Return to Login</a>
    </div>
    `;

                // In a real application, you would redirect to logout URL
                setTimeout(() => {
        // window.location.href = '/login'; // Actual redirect
    }, 2000);
            });

    // Cancel logout
    cancelLogout.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
            });

    // Close modal when clicking outside
    confirmationModal.addEventListener('click', function(e) {
                if (e.target === confirmationModal) {
        confirmationModal.style.display = 'none';
                }
            });
        });
