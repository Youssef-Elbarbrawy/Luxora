
    document.addEventListener('DOMContentLoaded', function() {
            // Form submission
            const form = document.querySelector('.profile-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const bio = document.getElementById('bio').value;

    // Simple validation
    if (!firstName || !lastName) {
        alert('Please enter your first and last name');
    if (!firstName) {
        document.getElementById('firstName').classList.add('shake');
                        setTimeout(() => {
        document.getElementById('firstName').classList.remove('shake');
                        }, 600);
                    }
    if (!lastName) {
        document.getElementById('lastName').classList.add('shake');
                        setTimeout(() => {
        document.getElementById('lastName').classList.remove('shake');
                        }, 600);
                    }
    return;
                }

    if (!email) {
        alert('Please enter your email address');
    document.getElementById('email').classList.add('shake');
                    setTimeout(() => {
        document.getElementById('email').classList.remove('shake');
                    }, 600);
    return;
                }

    // If all validations pass
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Changes Saved';
    saveBtn.style.background = 'var(--success-green)';
    saveBtn.style.boxShadow = '0 6px 20px rgba(129, 199, 132, 0.4)';

    // Update the user name in the sidebar
    document.querySelector('.user-name').textContent = `${firstName} ${lastName}`;

                // Reset button after 3 seconds
                setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    saveBtn.style.background = 'var(--gradient-primary)';
    saveBtn.style.boxShadow = '0 6px 20px rgba(212, 163, 115, 0.4)';
                }, 3000);
            });

    // Avatar upload simulation
    const avatarOverlay = document.querySelector('.avatar-overlay');

    avatarOverlay.addEventListener('click', function() {
        alert('Avatar upload feature would open here. You could select a new profile image.');
            });

    // Add floating animation to some elements
    const elementsToFloat = document.querySelectorAll('.user-avatar, .membership-badge');
            elementsToFloat.forEach(el => {
        el.classList.add('floating');
            });
        });
