// ================================================================
// КЫРГЫЗСКИЙ ФИНАНСОВЫЙ АЛЬЯНС - ГЛАВНЫЙ JAVASCRIPT
// ================================================================

(function() {
    'use strict';

    // ----------------------------------------------------------------
    // COOKIE MANAGEMENT
    // ----------------------------------------------------------------

    // Проверить наличие согласия при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        // Cookie banner
        if (!localStorage.getItem('cookies_accepted')) {
            showCookieBanner();
        }

        // Initialize other components
        initMobileMenu();
        initSmoothScroll();
        initBackToTop();
    });

    function showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
        }
    }

    function hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Принять все cookies
    window.acceptAllCookies = function() {
        localStorage.setItem('cookies_accepted', 'true');
        localStorage.setItem('analytics_enabled', 'true');
        hideCookieBanner();
        enableAnalytics();
    };

    // Отклонить cookies
    window.rejectCookies = function() {
        localStorage.setItem('cookies_accepted', 'false');
        localStorage.setItem('analytics_enabled', 'false');
        hideCookieBanner();
    };

    // Активировать аналитику (Google Analytics, Яндекс.Метрика)
    function enableAnalytics() {
        // Здесь можно добавить код для активации Google Analytics или Яндекс.Метрики
        console.log('Analytics enabled');

        // Пример для Google Analytics (замените GA_MEASUREMENT_ID на ваш ID):
        /*
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
        */

        // Пример для Яндекс.Метрики (замените XXXXXX на ваш ID):
        /*
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(XXXXXX, "init", {
             clickmap:true,
             trackLinks:true,
             accurateTrackBounce:true,
             webvisor:true
        });
        */
    }

    // ----------------------------------------------------------------
    // MOBILE MENU
    // ----------------------------------------------------------------

    function initMobileMenu() {
        // Можно добавить гамбургер-меню для мобильных устройств
        const navbar = document.querySelector('.navbar');

        // Проверка размера экрана
        if (window.innerWidth <= 768) {
            // Добавить мобильное меню при необходимости
        }
    }

    // ----------------------------------------------------------------
    // SMOOTH SCROLL
    // ----------------------------------------------------------------

    function initSmoothScroll() {
        // Плавная прокрутка для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ----------------------------------------------------------------
    // BACK TO TOP BUTTON
    // ----------------------------------------------------------------

    function initBackToTop() {
        // Создать кнопку "Наверх"
        const backToTopButton = document.createElement('button');
        backToTopButton.id = 'back-to-top';
        backToTopButton.innerHTML = '↑';
        backToTopButton.setAttribute('aria-label', 'Наверх');
        backToTopButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: var(--primary-color, #003366);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            display: none;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(backToTopButton);

        // Показать/скрыть кнопку при прокрутке
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        // Прокрутка наверх при клике
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Hover эффект
        backToTopButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        backToTopButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // ----------------------------------------------------------------
    // DOWNLOAD TRACKING
    // ----------------------------------------------------------------

    // Отслеживание скачиваний документов
    document.querySelectorAll('a[href$=".pdf"], a[href$=".docx"], a[href$=".zip"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const filename = this.getAttribute('href').split('/').pop();
            console.log('Download:', filename);

            // Можно отправить событие в аналитику
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    'event_category': 'Documents',
                    'event_label': filename
                });
            }
        });
    });

    // ----------------------------------------------------------------
    // FORM VALIDATION
    // ----------------------------------------------------------------

    // Валидация форм
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                return false;
            }
        });
    });

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'Это поле обязательно для заполнения');
            } else {
                clearFieldError(field);
            }

            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    showFieldError(field, 'Введите корректный email адрес');
                }
            }

            // Phone validation (для кыргызских номеров)
            if (field.type === 'tel' && field.value.trim()) {
                const phoneRegex = /^\+996\d{9}$/;
                if (!phoneRegex.test(field.value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    showFieldError(field, 'Введите корректный номер телефона (+996XXXXXXXXX)');
                }
            }
        });

        // Проверка чекбоксов согласия
        const agreementCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
        agreementCheckboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                isValid = false;
                showFieldError(checkbox, 'Необходимо согласие');
            }
        });

        return isValid;
    }

    function showFieldError(field, message) {
        clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
        errorDiv.textContent = message;

        field.style.borderColor = '#dc3545';
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }

    // ----------------------------------------------------------------
    // SEARCH FUNCTIONALITY
    // ----------------------------------------------------------------

    // Поиск по документам (если есть поле поиска)
    const searchInput = document.querySelector('[data-search]');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const searchableItems = document.querySelectorAll('[data-searchable]');

            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // ----------------------------------------------------------------
    // NOTIFICATIONS
    // ----------------------------------------------------------------

    // Показать уведомление
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideInRight 0.5s ease;
            max-width: 300px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Автоматически удалить через 5 секунд
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    };

    // ----------------------------------------------------------------
    // PRINT FUNCTIONALITY
    // ----------------------------------------------------------------

    // Печать документа
    const printButtons = document.querySelectorAll('[data-print]');
    printButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.print();
        });
    });

    // ----------------------------------------------------------------
    // LOADING STATE
    // ----------------------------------------------------------------

    // Показать состояние загрузки
    window.showLoading = function() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        loader.innerHTML = '<div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #003366; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;"></div>';

        document.body.appendChild(loader);
    };

    window.hideLoading = function() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.remove();
        }
    };

    // ----------------------------------------------------------------
    // ANALYTICS EVENTS
    // ----------------------------------------------------------------

    // Отслеживание кликов по важным элементам
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('Button clicked:', buttonText);

            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Button',
                    'event_label': buttonText
                });
            }
        });
    });

    // ----------------------------------------------------------------
    // ANIMATIONS
    // ----------------------------------------------------------------

    // Добавить CSS для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ----------------------------------------------------------------
    // CONSOLE MESSAGE
    // ----------------------------------------------------------------

    console.log('%c👋 Добро пожаловать на сайт КФА!', 'font-size: 20px; font-weight: bold; color: #003366;');
    console.log('%cКыргызский Финансовый Альянс', 'font-size: 14px; color: #006699;');
    console.log('%cPowered by BMAD Method v6.0', 'font-size: 12px; color: #999;');

})();
