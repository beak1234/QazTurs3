const translations = {
  ru: {
    // Dashboard
    main: 'Главная',
    welcome: 'На карте ниже вы можете перейти к нужному месту и посмотреть маршрут.',
    addPlace: 'Добавить место',
    addPlaceTitle: 'Добавить место',
    placeName: 'Название места',
    placeDescription: 'Описание',
    addButton: 'Добавить',
    placePhotoUpload: 'Выберите фото',
    places: 'Места',
    placesTitle: 'Места',
    searchPlaces: 'Поиск места',
    allCategories: 'Все категории',
    noPlacesFound: 'Места не найдены.',
    noCategory: 'Без категории',
    noApprovedPlaces: 'Нет подтверждённых мест.',
    profile: 'Профиль',
    user: 'Пользователь:',
    avatar: 'Аватар',
    chooseAvatar: 'Выберите аватар',
    logout: 'Выход из аккаунта',
    placedAdded: 'Место добавлено! Ожидает подтверждения.',
    
    // Auth pages
    login: 'Вход',
    loginTitle: 'Вход в QazTurs',
    registration: 'Регистрация',
    registrationTitle: 'Регистрация в QazTurs',
    username: 'Имя пользователя',
    email: 'Email',
    password: 'Пароль',
    register: 'Зарегистрироваться',
    alreadyAccount: 'Уже есть аккаунт? Войти',
    noAccount: 'Нет аккаунта? Зарегистрироваться',
    registrationSuccess: 'Регистрация успешна!',
    invalidData: 'Неверные данные.',
    
    // Admin
    admin: 'Админ Панель',
    placesForApproval: 'Места на подтверждение',
    approve: 'Подтвердить',
    reject: 'Отклонить',
    
    // Home
    welcome_main: 'Добро пожаловать в мир путешествий!'
  },
  en: {
    // Dashboard
    main: 'Main',
    welcome: 'On the map below, you can go to the desired location and view the route.',
    addPlace: 'Add Place',
    addPlaceTitle: 'Add Place',
    placeName: 'Place Name',
    placeDescription: 'Description',
    addButton: 'Add',
    placePhotoUpload: 'Choose Photo',
    places: 'Places',
    placesTitle: 'Places',
    searchPlaces: 'Search places',
    allCategories: 'All categories',
    noPlacesFound: 'No places found.',
    noCategory: 'No category',
    noApprovedPlaces: 'No approved places yet.',
    profile: 'Profile',
    user: 'User:',
    avatar: 'Avatar',
    chooseAvatar: 'Choose Avatar',
    logout: 'Logout',
    placedAdded: 'Place added! Awaiting confirmation.',
    
    // Auth pages
    login: 'Login',
    loginTitle: 'Login to QazTurs',
    registration: 'Registration',
    registrationTitle: 'Register for QazTurs',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    register: 'Register',
    alreadyAccount: 'Already have an account? Login',
    noAccount: 'No account? Register',
    registrationSuccess: 'Registration successful!',
    invalidData: 'Invalid data.',
    
    // Admin
    admin: 'Admin Panel',
    placesForApproval: 'Places for Approval',
    approve: 'Approve',
    reject: 'Reject',
    
    // Home
    welcome_main: 'Welcome to the world of travel!'
  },
  kk: {
    // Dashboard
    main: 'Басты бет',
    welcome: 'Төмендегі картада сіз қажетті орынға барып, маршрутты көре аласыз.',
    addPlace: 'Орын қосу',
    addPlaceTitle: 'Орын қосу',
    placeName: 'Орынның аты',
    placeDescription: 'Сипаттама',
    addButton: 'Қосу',
    placePhotoUpload: 'Фотосуретті таңдаңыз',
    places: 'Орындар',
    placesTitle: 'Орындар',
    searchPlaces: 'Орындарды іздеу',
    allCategories: 'Барлық категориялар',
    noPlacesFound: 'Орындар табылмады.',
    noCategory: 'Категория жоқ',
    noApprovedPlaces: 'Расталған орындар әлі жоқ.',
    profile: 'Профиль',
    user: 'Пайдаланушы:',
    avatar: 'Аватар',
    chooseAvatar: 'Аватарды таңдаңыз',
    logout: 'Аккаунттан шығу',
    placedAdded: 'Орын қосылды! Бекітілуін күтеміз.',
    
    // Auth pages
    login: 'Кіру',
    loginTitle: 'QazTurs-ке кіру',
    registration: 'Тіркеу',
    registrationTitle: 'QazTurs-ке тіркелу',
    username: 'Пайдаланушы аты',
    email: 'Email',
    password: 'Пароль',
    register: 'Тіркелу',
    alreadyAccount: 'Аккаунтыңыз бар ма? Кіру',
    noAccount: 'Аккаунтыңыз жоқ па? Тіркелу',
    registrationSuccess: 'Тіркеу сәтті аяқталды!',
    invalidData: 'Деректер қате.',
    
    // Admin
    admin: 'Админ Панелі',
    placesForApproval: 'Бекітілуге арналған орындар',
    approve: 'Бекіту',
    reject: 'Бас тарту',
    
    // Home
    welcome_main: 'Саяхаттау ӘСsемінде қош келдіңіз!'
  }
};

function getTranslation(key) {
  const lang = localStorage.getItem('language') || 'ru';
  return translations[lang][key] || translations['ru'][key] || key;
}

function setLanguage(lang) {
  localStorage.setItem('language', lang);
  location.reload();
}

function applyTranslations() {
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    element.textContent = getTranslation(key);
  });
  
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    element.placeholder = getTranslation(key);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyTranslations);
} else {
  applyTranslations();
}
