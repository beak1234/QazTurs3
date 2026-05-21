// script.js

// Функция для получения пользователей из localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Функция для сохранения пользователей в localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Функция для получения мест из localStorage
function getPlaces() {
    return JSON.parse(localStorage.getItem('places') || '[]');
}

// Функция для сохранения мест в localStorage
function savePlaces(places) {
    localStorage.setItem('places', JSON.stringify(places));
}

// Регистрация
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const users = getUsers();
        users.push({ username, email, password, status: 'approved' });
        saveUsers(users);

        alert(getTranslation('registrationSuccess'));
        window.location.href = 'dashboard.html';
    });
}

// Вход
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (username === 'AAAA' && password === 'AAAA') {
            window.location.href = 'admin.html';
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password && u.status === 'approved');

        if (user) {
            localStorage.setItem('currentUser', username);
            window.location.href = 'dashboard.html';
        } else {
            alert(getTranslation('invalidData'));
        }
    });
}

// Админ панель
if (document.getElementById('pendingPlaces')) {
    function loadPendingPlaces() {
        const places = getPlaces();
        const pending = places.filter(p => p.status === 'pending');
        const list = document.getElementById('pendingPlaces');
        list.innerHTML = '';

        pending.forEach((place, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${place.name} - ${place.description} (от ${place.user})</span>
                <div>
                    <button onclick="approvePlace(${index})" data-translate="approve">${getTranslation('approve')}</button>
                    <button class="reject" onclick="rejectPlace(${index})" data-translate="reject">${getTranslation('reject')}</button>
                </div>
            `;
            list.appendChild(li);
        });
    }

    window.approvePlace = function(index) {
        const places = getPlaces();
        const pending = places.filter(p => p.status === 'pending');
        pending[index].status = 'approved';
        savePlaces(places);
        loadPendingPlaces();
    };

    window.rejectPlace = function(index) {
        const places = getPlaces();
        const pending = places.filter(p => p.status === 'pending');
        places.splice(places.indexOf(pending[index]), 1);
        savePlaces(places);
        loadPendingPlaces();
    };

    loadPendingPlaces();
}

// Dashboard для пользователей
if (document.getElementById('addPlaceForm')) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
    }

    document.getElementById('profileName').textContent = currentUser;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    document.getElementById('addPlaceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('placeName').value;
        const description = document.getElementById('placeDescription').value;
        const photoFile = document.getElementById('placePhoto').files[0];

        const places = getPlaces();

        const savePlace = (photoData) => {
            places.push({ name, description, user: currentUser, status: 'pending', photo: photoData });
            savePlaces(places);

            alert(getTranslation('placedAdded'));
            document.getElementById('addPlaceForm').reset();
            document.getElementById('placePhotoPreview').innerHTML = '';
        };

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                savePlace(event.target.result);
            };
            reader.readAsDataURL(photoFile);
        } else {
            savePlace(null);
        }
    });

    const placePhotoInput = document.getElementById('placePhoto');
    const placePhotoPreview = document.getElementById('placePhotoPreview');

    if (placePhotoInput && placePhotoPreview) {
        placePhotoInput.addEventListener('change', function() {
            const file = placePhotoInput.files[0];
            if (!file) {
                placePhotoPreview.innerHTML = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                placePhotoPreview.innerHTML = `<img src="${event.target.result}" alt="Фото места">`;
            };
            reader.readAsDataURL(file);
        });
    }

    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');

    function loadAvatar() {
        const avatarData = localStorage.getItem(`avatar_${currentUser}`);
        if (avatarData) {
            avatarPreview.innerHTML = `<img src="${avatarData}" alt="Аватар">`;
        } else {
            avatarPreview.textContent = 'Аватар';
        }
    }

    avatarInput.addEventListener('change', function() {
        const file = avatarInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const imageData = event.target.result;
            localStorage.setItem(`avatar_${currentUser}`, imageData);
            loadAvatar();
        };
        reader.readAsDataURL(file);
    });

    let allPlaces = [];

    function getCombinedPlaces() {
        const filePlaces = (window.placesWithCategories || typeof placesWithCategories !== 'undefined' && placesWithCategories || []).map(place => ({ ...place, status: 'approved' }));
        const localPlaces = getPlaces().filter(place => place.status === 'approved');
        return [...filePlaces, ...localPlaces];
    }

    function populateCategoryFilter(places) {
        const filter = document.getElementById('filterCategory');
        if (!filter) return;

        const categories = Array.from(new Set(places.map(place => place.category).filter(Boolean))).sort();
        const options = [`<option value="">${getTranslation('allCategories')}</option>`];
        categories.forEach(category => {
            options.push(`<option value="${category}">${category}</option>`);
        });
        filter.innerHTML = options.join('');
    }

    function renderPlaces(places) {
        const list = document.getElementById('approvedPlaces');
        if (!list) return;

        list.innerHTML = '';
        if (places.length === 0) {
            list.innerHTML = `<li class="empty-list">${getTranslation('noPlacesFound')}</li>`;
            return;
        }

        places.forEach(place => {
            const li = document.createElement('li');
            const card = document.createElement('article');
            card.className = 'place-card';

            const imageUrl = place.photo || place.image || '';
            const imageBlock = document.createElement('div');
            imageBlock.className = 'place-card-image';
            if (imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = place.name;
                imageBlock.appendChild(img);
            } else {
                imageBlock.classList.add('place-card-image-placeholder');
                imageBlock.textContent = place.category || getTranslation('noCategory');
            }
            card.appendChild(imageBlock);

            const content = document.createElement('div');
            content.className = 'place-card-content';

            if (place.category) {
                const categoryBadge = document.createElement('span');
                categoryBadge.className = 'place-category';
                categoryBadge.textContent = place.category;
                content.appendChild(categoryBadge);
            }

            const title = document.createElement('h3');
            title.className = 'place-title';
            title.textContent = place.name;
            content.appendChild(title);

            const description = document.createElement('p');
            description.className = 'place-description';
            description.textContent = place.description || '';
            content.appendChild(description);

            const meta = document.createElement('div');
            meta.className = 'place-meta';

            if (typeof place.latitude === 'number' && typeof place.longitude === 'number') {
                const coords = document.createElement('span');
                coords.className = 'place-coords';
                coords.textContent = `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`;
                meta.appendChild(coords);
            }

            const author = document.createElement('span');
            author.textContent = `${getTranslation('user')} ${place.user || '—'}`;
            meta.appendChild(author);

            content.appendChild(meta);
            card.appendChild(content);
            li.appendChild(card);
            list.appendChild(li);
        });
    }

    function updatePlaces() {
        const searchValue = document.getElementById('searchPlaces')?.value.trim().toLowerCase() || '';
        const categoryValue = document.getElementById('filterCategory')?.value || '';
        const filteredPlaces = allPlaces.filter(place => {
            const matchesSearch = !searchValue || [place.name, place.description, place.category].some(text => text && text.toLowerCase().includes(searchValue));
            const matchesCategory = !categoryValue || place.category === categoryValue;
            return matchesSearch && matchesCategory;
        });
        renderPlaces(filteredPlaces);
    }

    function loadApprovedPlaces() {
        allPlaces = getCombinedPlaces();
        populateCategoryFilter(allPlaces);
        updatePlaces();
    }

    loadAvatar();
    loadApprovedPlaces();

    const searchInput = document.getElementById('searchPlaces');
    const categoryFilter = document.getElementById('filterCategory');
    if (searchInput) {
        searchInput.addEventListener('input', updatePlaces);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', updatePlaces);
    }

    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const tabPanels = document.querySelectorAll('.tab-panel');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const target = item.getAttribute('data-tab');
            tabPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === target);
            });
        });
    });
}

function initAuthFlipCard() {
    const authCard = document.getElementById('authCard');
    const showLogin = document.getElementById('showLogin');
    const showRegister = document.getElementById('showRegister');
    const toggleToRegister = document.getElementById('toggleToRegister');
    const toggleToLogin = document.getElementById('toggleToLogin');

    if (!authCard) {
        return;
    }

    const setSide = side => {
        if (side === 'register') {
            authCard.classList.add('flip');
            showRegister?.classList.add('active');
            showLogin?.classList.remove('active');
        } else {
            authCard.classList.remove('flip');
            showLogin?.classList.add('active');
            showRegister?.classList.remove('active');
        }
    };

    showLogin?.addEventListener('click', () => setSide('login'));
    showRegister?.addEventListener('click', () => setSide('register'));
    toggleToRegister?.addEventListener('click', () => setSide('register'));
    toggleToLogin?.addEventListener('click', () => setSide('login'));
}

initAuthFlipCard();

// Переключение языков
if (document.getElementById('langToggle')) {
    const langToggle = document.getElementById('langToggle');
    const langMenu = document.getElementById('langMenu');

    langToggle.addEventListener('click', () => {
        langMenu.classList.toggle('active');
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}