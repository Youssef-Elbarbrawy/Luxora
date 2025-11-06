// Global rooms array - will be populated from server data
let rooms = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Use server-side data
    rooms = serverRooms;

    // Initialize the rooms grid
    renderRooms();

    // Set up event listeners
    initializeEventListeners();

    // Fade in the page
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

function initializeEventListeners() {
    const roomsGrid = document.getElementById('roomsGrid');
    const searchInput = document.getElementById('searchInput');
    const viewButtons = document.querySelectorAll('.view-btn');
    const filterChips = document.querySelectorAll('.filter-chip');
    const roomModal = document.getElementById('roomModal');
    const closeModal = document.getElementById('closeModal');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const sortSelect = document.getElementById('sortSelect');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const addToFavoritesBtn = document.getElementById('addToFavorites');
    const modalBookBtn = document.getElementById('modalBookBtn');

    // View buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const view = this.getAttribute('data-view');
            showToast(`Switched to ${view} view`);
        });
    });

    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', function () {
            this.classList.toggle('active');
            const filterText = this.textContent.trim();
            showToast(`${this.classList.contains('active') ? 'Applied' : 'Removed'} filter: ${filterText}`);
            filterRooms();
        });
    });

    // Modal events
    closeModal.addEventListener('click', function () {
        roomModal.classList.remove('active');
    });

    roomModal.addEventListener('click', function (e) {
        if (e.target === roomModal) {
            roomModal.classList.remove('active');
        }
    });

    // Filter events
    clearFiltersBtn.addEventListener('click', function () {
        document.getElementById('typeFilter').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('capacityFilter').value = '';
        document.getElementById('statusFilter').value = '';
        searchInput.value = '';

        filterChips.forEach(chip => {
            if (chip.textContent.includes('All Rooms')) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
        });

        filterRooms();
        showToast('All filters cleared');
    });

    applyFiltersBtn.addEventListener('click', function () {
        filterRooms();
        showToast('Filters applied successfully');
    });

    // Input events for real-time filtering
    document.getElementById('typeFilter').addEventListener('change', filterRooms);
    document.getElementById('minPrice').addEventListener('input', filterRooms);
    document.getElementById('maxPrice').addEventListener('input', filterRooms);
    document.getElementById('capacityFilter').addEventListener('change', filterRooms);
    document.getElementById('statusFilter').addEventListener('change', filterRooms);
    searchInput.addEventListener('input', filterRooms);
    sortSelect.addEventListener('change', filterRooms);

    // Modal action buttons
    addToFavoritesBtn.addEventListener('click', function () {
        const roomId = this.getAttribute('data-room');
        if (roomId) {
            addToFavorites(roomId);
        }
    });

    modalBookBtn.addEventListener('click', function () {
        const roomId = this.getAttribute('data-room');
        if (roomId) {
            bookRoom(roomId);
        }
    });
}

function renderRooms(roomsToRender = rooms) {
    const roomsGrid = document.getElementById('roomsGrid');
    roomsGrid.innerHTML = '';

    if (roomsToRender.length === 0) {
        roomsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="font-weight: 400; margin-bottom: 10px;">No rooms found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </div>
        `;
        return;
    }

    roomsToRender.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = `room-card ${room.featured ? 'featured' : ''} ${room.premium ? 'premium' : ''}`;

        roomCard.innerHTML = `
            <div class="room-image">
                <img src="${room.image}" alt="Room ${room.number}" onerror="this.src='https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'">
                <div class="room-status status-${room.status}">${room.status}</div>
            </div>
            <div class="room-content">
                <div class="room-header">
                    <h3 class="room-title">Room ${room.number}</h3>
                    <div class="room-price">$${room.price}<span>/night</span></div>
                </div>
                <div class="room-type">${room.type.charAt(0).toUpperCase() + room.type.slice(1)}</div>
                <div class="room-specs">
                    <div class="room-spec"><i class="fas fa-users"></i> ${room.capacity} Guests</div>
                    <div class="room-spec"><i class="fas fa-arrows-alt"></i> ${room.size} m²</div>
                    <div class="room-spec"><i class="fas fa-binoculars"></i> ${room.view} View</div>
                </div>
                <div class="room-amenities">
                    ${room.amenities.slice(0, 3).map(amenity => `
                        <div class="amenity-tag">${amenity}</div>
                    `).join('')}
                    ${room.amenities.length > 3 ? `<div class="amenity-tag">+${room.amenities.length - 3}</div>` : ''}
                </div>
                <div class="room-actions">
                    <button class="btn-details" data-room="${room.id}">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn-book" data-room="${room.id}" ${room.status !== 'available' ? 'disabled' : ''}>
                        <i class="fas fa-concierge-bell"></i> ${room.status === 'available' ? 'Book Now' : room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </button>
                </div>
            </div>
        `;

        roomsGrid.appendChild(roomCard);
    });

    // Add event listeners to dynamically created buttons
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function () {
            const roomId = this.getAttribute('data-room');
            openRoomModal(roomId);
        });
    });

    document.querySelectorAll('.btn-book').forEach(button => {
        button.addEventListener('click', function () {
            if (this.disabled) return;
            const roomId = this.getAttribute('data-room');
            bookRoom(roomId);
        });
    });
}

async function openRoomModal(roomId) {
    const room = rooms.find(r => r.id == roomId);
    if (!room) return;

    document.getElementById('modalRoomTitle').innerHTML = `<i class="fas fa-info-circle"></i> ${room.type.charAt(0).toUpperCase() + room.type.slice(1)} - Room ${room.number}`;

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="modal-image">
            <img src="${room.image}" alt="Room ${room.number}" onerror="this.src='https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'">
        </div>
        <div class="modal-details">
            <div class="detail-group">
                <div class="detail-label">Room Type</div>
                <div class="detail-value">${room.type.charAt(0).toUpperCase() + room.type.slice(1)}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Price</div>
                <div class="detail-value">$${room.price} <span style="color: var(--text-muted); font-size: 0.9rem;">/ night</span></div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Capacity</div>
                <div class="detail-value">${room.capacity} Guests</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Size</div>
                <div class="detail-value">${room.size} m²</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Bed Type</div>
                <div class="detail-value">${room.bedType}</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">View</div>
                <div class="detail-value">${room.view.charAt(0).toUpperCase() + room.view.slice(1)} View</div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-${room.status}" style="padding: 6px 12px; border-radius: 8px; font-size: 0.85rem;">${room.status.charAt(0).toUpperCase() + room.status.slice(1)}</span></div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Amenities</div>
                <div class="amenities-grid">
                    ${room.amenities.map(amenity => `
                        <div class="amenity-tag">${amenity}</div>
                    `).join('')}
                </div>
            </div>
            <div class="detail-group">
                <div class="detail-label">Description</div>
                <div class="detail-value">${room.description}</div>
            </div>
        </div>
    `;

    // Set data attributes for modal action buttons
    document.getElementById('addToFavorites').setAttribute('data-room', roomId);
    document.getElementById('modalBookBtn').setAttribute('data-room', roomId);

    // Update book button state
    const modalBookBtn = document.getElementById('modalBookBtn');
    modalBookBtn.disabled = room.status !== 'available';
    modalBookBtn.innerHTML = `<i class="fas fa-concierge-bell"></i> ${room.status === 'available' ? 'Book This Room' : 'Not Available'}`;

    document.getElementById('roomModal').classList.add('active');
}

function filterRooms() {
    const typeFilter = document.getElementById('typeFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const capacityFilter = document.getElementById('capacityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchQuery = searchInput.value.toLowerCase();

    let filteredRooms = rooms.filter(room => {
        // Type filter
        if (typeFilter && room.type !== typeFilter) return false;

        // Price filter
        if (minPrice && room.price < parseInt(minPrice)) return false;
        if (maxPrice && room.price > parseInt(maxPrice)) return false;

        // Capacity filter
        if (capacityFilter && room.capacity < parseInt(capacityFilter)) return false;

        // Status filter
        if (statusFilter && room.status !== statusFilter) return false;

        // Search query
        if (searchQuery &&
            !room.number.toLowerCase().includes(searchQuery) &&
            !room.type.toLowerCase().includes(searchQuery) &&
            !room.view.toLowerCase().includes(searchQuery)) {
            return false;
        }

        // Filter chips
        const activeChips = Array.from(document.querySelectorAll('.filter-chip.active'));
        if (activeChips.length > 0) {
            const shouldInclude = activeChips.some(chip => {
                const chipText = chip.textContent.toLowerCase();
                if (chipText.includes('ocean view') && room.view.includes('ocean')) return true;
                if (chipText.includes('city view') && room.view.includes('city')) return true;
                if (chipText.includes('premium') && room.premium) return true;
                if (chipText.includes('featured') && room.featured) return true;
                if (chipText.includes('all rooms')) return true;
                return false;
            });
            if (!shouldInclude) return false;
        }

        return true;
    });

    // Sort rooms
    const sortValue = sortSelect.value;
    if (sortValue === 'price') {
        filteredRooms.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'capacity') {
        filteredRooms.sort((a, b) => a.capacity - b.capacity);
    } else if (sortValue === 'type') {
        filteredRooms.sort((a, b) => a.type.localeCompare(b.type));
    } else {
        filteredRooms.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    }

    renderRooms(filteredRooms);
}

function bookRoom(roomId) {
    const room = rooms.find(r => r.id == roomId);
    if (!room) return;

    showToast(`Room ${room.number} booked successfully!`);
    console.log(`Booking Room ${room.number} - ${room.type} for $${room.price}/night`);

    // Close modal if open
    document.getElementById('roomModal').classList.remove('active');
}

function addToFavorites(roomId) {
    const room = rooms.find(r => r.id == roomId);
    if (!room) return;

    showToast(`Room ${room.number} added to favorites!`);
    console.log(`Added Room ${room.number} to favorites`);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize body opacity transition
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in-out';