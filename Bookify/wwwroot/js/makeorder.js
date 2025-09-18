
        class HotelBookingForm {
            constructor() {
                this.form = document.getElementById('bookingForm');
                this.initializeFormHandlers();
                this.initializeDateHandlers();
                this.initializeCounters();
                this.initializePriceCalculation();
                this.initializeValidation();
                this.setMinimumDates();
            }

            initializeFormHandlers() {
                this.form.addEventListener('submit', this.handleSubmit.bind(this));
                const inputs = this.form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => this.validateField(input));
                    input.addEventListener('input', () => this.clearFieldError(input));
                });
            }

            setMinimumDates() {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                
                const checkinInput = document.getElementById('checkinDate');
                const checkoutInput = document.getElementById('checkoutDate');
                
                checkinInput.min = today.toISOString().split('T')[0];
                checkoutInput.min = tomorrow.toISOString().split('T')[0];
                checkinInput.value = today.toISOString().split('T')[0];
                checkoutInput.value = tomorrow.toISOString().split('T')[0];
                
                this.updateNightsDisplay();
                this.calculateTotal();
            }

            initializeDateHandlers() {
                const checkinInput = document.getElementById('checkinDate');
                const checkoutInput = document.getElementById('checkoutDate');

                checkinInput.addEventListener('change', () => {
                    const checkinDate = new Date(checkinInput.value);
                    const nextDay = new Date(checkinDate);
                    nextDay.setDate(checkinDate.getDate() + 1);
                    
                    checkoutInput.min = nextDay.toISOString().split('T')[0];
                    
                    if (new Date(checkoutInput.value) <= checkinDate) {
                        checkoutInput.value = nextDay.toISOString().split('T')[0];
                    }
                    
                    this.updateNightsDisplay();
                    this.calculateTotal();
                });

                checkoutInput.addEventListener('change', () => {
                    this.updateNightsDisplay();
                    this.calculateTotal();
                });
            }

            updateNightsDisplay() {
                const checkinDate = new Date(document.getElementById('checkinDate').value);
                const checkoutDate = new Date(document.getElementById('checkoutDate').value);
                const nightsDisplay = document.getElementById('nightsDisplay');

                if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
                    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
                    nightsDisplay.textContent = nights;
                    nightsDisplay.parentElement.style.opacity = '1';
                } else {
                    nightsDisplay.textContent = '0';
                    nightsDisplay.parentElement.style.opacity = '0.5';
                }
            }

            initializeCounters() {
                this.setupCounter('adults', 1, 10, 1);
                this.setupCounter('children', 0, 8, 0);
                this.setupCounter('rooms', 1, 5, 1);
            }

            setupCounter(type, min, max, initial) {
                const decreaseBtn = document.getElementById(`${type}Decrease`);
                const increaseBtn = document.getElementById(`${type}Increase`);
                const countElement = document.getElementById(`${type}Count`);

                let count = initial;
                countElement.textContent = count;

                decreaseBtn.addEventListener('click', () => {
                    if (count > min) {
                        count--;
                        countElement.textContent = count;
                        this.updateCounterButtons(type, count, min, max);
                        this.calculateTotal();
                    }
                });

                increaseBtn.addEventListener('click', () => {
                    if (count < max) {
                        count++;
                        countElement.textContent = count;
                        this.updateCounterButtons(type, count, min, max);
                        this.calculateTotal();
                    }
                });

                this.updateCounterButtons(type, count, min, max);
            }

            updateCounterButtons(type, count, min, max) {
                const decreaseBtn = document.getElementById(`${type}Decrease`);
                const increaseBtn = document.getElementById(`${type}Increase`);

                decreaseBtn.disabled = count <= min;
                increaseBtn.disabled = count >= max;
            }

            initializePriceCalculation() {
                const roomTypeSelect = document.getElementById('roomType');
                const serviceCheckboxes = document.querySelectorAll('input[name="services"]');

                roomTypeSelect.addEventListener('change', () => this.calculateTotal());
                serviceCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => this.calculateTotal());
                });
            }

            calculateTotal() {
                const nights = parseInt(document.getElementById('nightsDisplay').textContent) || 0;
                const rooms = parseInt(document.getElementById('roomsCount').textContent) || 1;
                const roomTypeSelect = document.getElementById('roomType');
                const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
                const roomPrice = parseInt(selectedOption.getAttribute('data-price')) || 0;

                let subtotal = nights * rooms * roomPrice;
                let servicesTotal = 0;
                const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
                const servicesBreakdown = document.getElementById('servicesBreakdown');
                servicesBreakdown.innerHTML = '';

                serviceCheckboxes.forEach(checkbox => {
                    const servicePrice = parseInt(checkbox.getAttribute('data-price')) || 0;
                    const serviceName = checkbox.nextElementSibling.querySelector('strong').textContent;
                    
                    let serviceTotal = 0;
                    if (checkbox.value === 'extra-bed' || checkbox.value === 'breakfast' || checkbox.value === 'minibar') {
                        serviceTotal = servicePrice * nights * rooms;
                    } else {
                        serviceTotal = servicePrice;
                    }
                    
                    servicesTotal += serviceTotal;
                    
                    const serviceItem = document.createElement('div');
                    serviceItem.className = 'price-item';
                    serviceItem.innerHTML = `<span>${serviceName}</span><span>${serviceTotal}</span>`;
                    servicesBreakdown.appendChild(serviceItem);
                });

                const beforeTax = subtotal + servicesTotal;
                const taxes = Math.round(beforeTax * 0.12);
                const total = beforeTax + taxes;
                document.getElementById('summaryNights').textContent = nights;
                document.getElementById('summaryRooms').textContent = rooms;
                document.getElementById('roomTotal').textContent = `${subtotal}`;
                document.getElementById('taxesTotal').textContent = `${taxes}`;
                document.getElementById('grandTotal').textContent = `${total}`;
            }

            initializeValidation() {
                const requiredFields = {
                    fullName: {
                        validate: (value) => {
                            if (!value.trim()) return 'Full name is required';
                            if (value.trim().length < 2) return 'Name must be at least 2 characters';
                            if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
                            return null;
                        }
                    },
                    email: {
                        validate: (value) => {
                            if (!value.trim()) return 'Email address is required';
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(value)) return 'Please enter a valid email address';
                            return null;
                        }
                    },
                    phone: {
                        validate: (value) => {
                            if (!value.trim()) return 'Phone number is required';
                            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                                return 'Please enter a valid phone number';
                            }
                            return null;
                        }
                    },
                    nationality: {
                        validate: (value) => {
                            if (!value.trim()) return 'Nationality is required';
                            return null;
                        }
                    },
                    idNumber: {
                        validate: (value) => {
                            if (!value.trim()) return 'ID or passport number is required';
                            if (value.trim().length < 6) return 'ID must be at least 6 characters';
                            return null;
                        }
                    },
                    checkinDate: {
                        validate: (value) => {
                            if (!value) return 'Check-in date is required';
                            const checkinDate = new Date(value);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            if (checkinDate < today) return 'Check-in date cannot be in the past';
                            return null;
                        }
                    },
                    checkoutDate: {
                        validate: (value) => {
                            if (!value) return 'Check-out date is required';
                            const checkinDate = new Date(document.getElementById('checkinDate').value);
                            const checkoutDate = new Date(value);
                            if (checkoutDate <= checkinDate) {
                                return 'Check-out date must be after check-in date';
                            }
                            return null;
                        }
                    },
                    roomType: {
                        validate: (value) => {
                            if (!value) return 'Please select a room type';
                            return null;
                        }
                    }
                };

                this.validationRules = requiredFields;
            }

            validateField(field) {
                const fieldName = field.name || field.id;
                const rule = this.validationRules[fieldName];
                
                if (rule) {
                    const error = rule.validate(field.value);
                    if (error) {
                        this.showFieldError(field, error);
                        return false;
                    } else {
                        this.showFieldSuccess(field);
                        return true;
                    }
                }
                
                return true;
            }

            showFieldError(field, message) {
                field.classList.add('error');
                field.classList.remove('success');
                
                const errorElement = field.closest('.form-group').querySelector('.error-message');
                if (errorElement) {
                    errorElement.querySelector('span').textContent = message;
                    errorElement.classList.add('show');
                }
            }

            showFieldSuccess(field) {
                field.classList.remove('error');
                field.classList.add('success');
                
                const errorElement = field.closest('.form-group').querySelector('.error-message');
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            }

            clearFieldError(field) {
                field.classList.remove('error');
                const errorElement = field.closest('.form-group').querySelector('.error-message');
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            }

            validateForm() {
                let isValid = true;
                const requiredInputs = this.form.querySelectorAll('input[required], select[required]');
                
                requiredInputs.forEach(input => {
                    if (!this.validateField(input)) {
                        isValid = false;
                    }
                });
                const paymentMethod = this.form.querySelector('input[name="payment"]:checked');
                if (!paymentMethod) {
                    const paymentError = this.form.querySelector('input[name="payment"]')
                        .closest('.form-group').querySelector('.error-message');
                    if (paymentError) {
                        paymentError.querySelector('span').textContent = 'Please select a payment method';
                        paymentError.classList.add('show');
                    }
                    isValid = false;
                }
                const termsCheckbox = document.getElementById('terms');
                if (!termsCheckbox.checked) {
                    alert('Please agree to the Terms & Conditions to proceed with your booking.');
                    termsCheckbox.focus();
                    isValid = false;
                }

                return isValid;
            }

            async handleSubmit(event) {
                event.preventDefault();
                
                if (!this.validateForm()) {
                    return;
                }

                const submitBtn = document.getElementById('submitBtn');
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                try {
                    await this.simulateBookingSubmission();
                    const confirmationNumber = 'HTL' + Date.now().toString().slice(-8);
                    document.getElementById('confirmationNumber').textContent = confirmationNumber;
                    document.getElementById('successModal').classList.add('show');
                    
                } catch (error) {
                    console.error('Booking submission failed:', error);
                    alert('There was an error processing your booking. Please try again.');
                } finally {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }

            async simulateBookingSubmission() {
                return new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                });
            }
        }
        document.addEventListener('DOMContentLoaded', () => {
            new HotelBookingForm();
        });

        function closeModal() {
            document.getElementById('successModal').classList.remove('show');
        }
        document.getElementById('successModal').addEventListener('click', (e) => {
            if (e.target.id === 'successModal') {
                closeModal();
            }
        });
