
    document.addEventListener('DOMContentLoaded', function() {
            // Password visibility toggles
            const toggleButtons = document.querySelectorAll('.toggle-password');
            
            toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
            });

    // Password strength meter
    const newPasswordInput = document.getElementById('newPassword');
    const strengthMeter = document.getElementById('passwordStrengthMeter');
    const strengthText = document.getElementById('passwordStrengthText');
    const strengthSpan = strengthText.querySelector('span');

    // Criteria elements
    const lengthCriterion = document.getElementById('lengthCriterion');
    const uppercaseCriterion = document.getElementById('uppercaseCriterion');
    const lowercaseCriterion = document.getElementById('lowercaseCriterion');
    const numberCriterion = document.getElementById('numberCriterion');
    const specialCriterion = document.getElementById('specialCriterion');

    newPasswordInput.addEventListener('input', function() {
                const password = this.value;
    let strength = 0;

    // Reset criteria
    const criteria = [
    lengthCriterion,
    uppercaseCriterion,
    lowercaseCriterion,
    numberCriterion,
    specialCriterion
    ];
                
                criteria.forEach(criterion => {
        criterion.innerHTML = criterion.innerHTML.replace('fa-check-circle', 'fa-circle');
    criterion.classList.remove('criteria-met');
                });

                // Check password length
                if (password.length >= 12) {
        strength += 20;
    lengthCriterion.querySelector('i').classList.add('fa-check-circle');
    lengthCriterion.classList.add('criteria-met');
                } else {
        lengthCriterion.querySelector('i').classList.add('fa-circle');
                }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
        strength += 20;
    uppercaseCriterion.querySelector('i').classList.add('fa-check-circle');
    uppercaseCriterion.classList.add('criteria-met');
                } else {
        uppercaseCriterion.querySelector('i').classList.add('fa-circle');
                }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
        strength += 20;
    lowercaseCriterion.querySelector('i').classList.add('fa-check-circle');
    lowercaseCriterion.classList.add('criteria-met');
                } else {
        lowercaseCriterion.querySelector('i').classList.add('fa-circle');
                }

    // Check for numbers
    if (/[0-9]/.test(password)) {
        strength += 20;
    numberCriterion.querySelector('i').classList.add('fa-check-circle');
    numberCriterion.classList.add('criteria-met');
                } else {
        numberCriterion.querySelector('i').classList.add('fa-circle');
                }

    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 20;
    specialCriterion.querySelector('i').classList.add('fa-check-circle');
    specialCriterion.classList.add('criteria-met');
                } else {
        specialCriterion.querySelector('i').classList.add('fa-circle');
                }

    // Update strength meter
    strengthMeter.style.width = strength + '%';

    // Update strength text
    if (password.length === 0) {
        strengthSpan.textContent = 'None';
    strengthText.querySelector('i').className = 'fas fa-info-circle';
    strengthText.querySelector('i').style.color = '';
    strengthMeter.style.background = '';
                } else if (strength < 40) {
        strengthSpan.textContent = 'Weak';
    strengthText.querySelector('i').className = 'fas fa-exclamation-circle';
    strengthText.querySelector('i').style.color = '#e74c3c';
    strengthMeter.style.background = '#e74c3c';
                } else if (strength < 80) {
        strengthSpan.textContent = 'Fair';
    strengthText.querySelector('i').className = 'fas fa-exclamation-triangle';
    strengthText.querySelector('i').style.color = '#f59e0b';
    strengthMeter.style.background = '#f59e0b';
                } else {
        strengthSpan.textContent = 'Strong';
    strengthText.querySelector('i').className = 'fas fa-check-circle';
    strengthText.querySelector('i').style.color = '#81c784';
    strengthMeter.style.background = '#81c784';
                }

    // Add pulse animation when strength changes
    strengthMeter.classList.add('pulse');
                setTimeout(() => {
        strengthMeter.classList.remove('pulse');
                }, 500);
            });

    // Password confirmation check
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatchText = document.getElementById('passwordMatchText');

    confirmPasswordInput.addEventListener('input', function() {
                const newPassword = newPasswordInput.value;
    const confirmPassword = this.value;

    if (confirmPassword.length === 0) {
        passwordMatchText.textContent = '';
                } else if (newPassword === confirmPassword) {
        passwordMatchText.innerHTML = '<i class="fas fa-check-circle" style="color:#81c784"></i> Passwords match!';
    passwordMatchText.style.color = '#81c784';
                } else {
        passwordMatchText.innerHTML = '<i class="fas fa-times-circle" style="color:#e74c3c"></i> Passwords do not match';
    passwordMatchText.style.color = '#e74c3c';
                }
            });

    // Form submission
    const form = document.querySelector('.password-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Simple validation
    if (!currentPassword) {
        alert('Please enter your current password');
    document.getElementById('currentPassword').classList.add('shake');
                    setTimeout(() => {
        document.getElementById('currentPassword').classList.remove('shake');
                    }, 600);
    return;
                }

    if (newPassword.length < 12) {
        alert('New password must be at least 12 characters long');
    newPasswordInput.classList.add('shake');
                    setTimeout(() => {
        newPasswordInput.classList.remove('shake');
                    }, 600);
    return;
                }

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
    confirmPasswordInput.classList.add('shake');
                    setTimeout(() => {
        confirmPasswordInput.classList.remove('shake');
                    }, 600);
    return;
                }

    // If all validations pass
    alert('Password changed successfully!');
    form.reset();
    strengthMeter.style.width = '0%';
    strengthSpan.textContent = 'None';
    passwordMatchText.textContent = '';

    // Reset criteria icons
    const criteriaIcons = document.querySelectorAll('.criteria-list i');
                criteriaIcons.forEach(icon => {
        icon.classList.remove('fa-check-circle');
    icon.classList.add('fa-circle');
                });

    const criteriaItems = document.querySelectorAll('.criteria-list li');
                criteriaItems.forEach(item => {
        item.classList.remove('criteria-met');
                });
            });
        });
