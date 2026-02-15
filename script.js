document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && portfolioConfig.emailjs.publicKey) {
        emailjs.init(portfolioConfig.emailjs.publicKey);
    }

    // Load content from config.js
    loadPortfolioContent();

    // Initialize Typed.js
    initTypedEffect();

    // Initialize Language Toggle
    initLanguageToggle();

    // Initialize Back to Top Button
    initBackToTop();

    // Initialize Toast Notification
    initToastNotification();

    // 1. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // 3. Scroll Reveal Animation using IntersectionObserver
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Contact Form Submission with EmailJS
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Check if EmailJS is configured
            if (typeof emailjs !== 'undefined' && 
                portfolioConfig.emailjs.serviceId !== 'YOUR_SERVICE_ID') {
                try {
                    formStatus.textContent = 'Sending...';
                    formStatus.style.color = 'var(--primary-color)';

                    const response = await emailjs.send(
                        portfolioConfig.emailjs.serviceId,
                        portfolioConfig.emailjs.templateId,
                        {
                            from_name: name,
                            from_email: email,
                            message: message,
                            to_email: portfolioConfig.personal.email
                        }
                    );

                    if (response.status === 200) {
                        showToast();
                        contactForm.reset();
                        formStatus.textContent = '';
                    }
                } catch (error) {
                    console.error('EmailJS Error:', error);
                    formStatus.textContent = 'Failed to send. Please try again.';
                    formStatus.style.color = 'red';
                }
            } else {
                // Fallback to mailto if EmailJS is not configured
                formStatus.textContent = "Opening your email client...";
                formStatus.style.color = "var(--primary-color)";

                setTimeout(() => {
                    formStatus.textContent = "Thank you, " + name + "! Redirecting...";
                    formStatus.style.color = "green";

                    const mailtoLink = `mailto:${portfolioConfig.personal.email}?subject=Portfolio Contact from ${name}&body=From: ${name} <${email}>\n\n${message}`;
                    window.location.href = mailtoLink;
                    contactForm.reset();
                }, 800);
            }
        });
    }

    // 5. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Language Toggle Functionality
function initLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    const langIcon = langToggle.querySelector('.lang-icon');
    const html = document.documentElement;

    // Check for saved language
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

    langToggle.addEventListener('click', () => {
        const currentLang = html.getAttribute('lang');
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });

    function setLanguage(lang) {
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        langIcon.textContent = lang.toUpperCase();
        localStorage.setItem('language', lang);

        // Update all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = getTranslation(key, lang);
            if (translation) {
                el.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = getTranslation(key, lang);
            if (translation) {
                el.setAttribute('placeholder', translation);
            }
        });

        // Reload content to update language-specific data
        loadPortfolioContent();
    }

    function getTranslation(key, lang) {
        const keys = key.split('.');
        let value = portfolioConfig.translations[lang];
        keys.forEach(k => {
            value = value ? value[k] : null;
        });
        return value;
    }
}

// Typed.js Effect
function initTypedEffect() {
    const typedOutput = document.getElementById('typed-output');
    if (typedOutput && typeof Typed !== 'undefined') {
        new Typed('#typed-output', {
            strings: portfolioConfig.typedStrings,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            cursorChar: '|'
        });
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Toast Notification
function initToastNotification() {
    const toast = document.getElementById('success-toast');
    const closeBtn = toast.querySelector('.toast-close');

    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (toast.classList.contains('show')) {
            toast.classList.remove('show');
        }
    }, 5000);
}

function showToast() {
    const toast = document.getElementById('success-toast');
    toast.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

function loadPortfolioContent() {
    const data = portfolioConfig;
    const lang = document.documentElement.getAttribute('lang') || 'en';
    const isArabic = lang === 'ar';

    // تحديث جميع العناصر التي تحتوي على سمة data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key, lang);
        if (translation) {
            el.textContent = translation;
        }
    });

    // تحديث جميع العناصر التي تحتوي على سمة data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key, lang);
        if (translation) {
            el.setAttribute('placeholder', translation);
        }
    });

    // Header & Hero
    const names = (isArabic ? data.personal.nameAr : data.personal.name).split(' ');
    document.getElementById('header-name-first').textContent = names[0];
    document.getElementById('header-name-last').textContent = names[1] || '';
    document.getElementById('footer-name-first').textContent = names[0];
    document.getElementById('footer-name-last').textContent = names[1] || '';

    // Copyright Section
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('copyright-name').textContent = isArabic ? data.personal.nameAr : data.personal.name;

    // Photo Injection
    const photoContainer = document.getElementById('hero-image-container');
    if (data.personal.photo) {
        photoContainer.innerHTML = `<img src="${data.personal.photo}" alt="${isArabic ? data.personal.nameAr : data.personal.name}">`;
    }

    document.getElementById('hero-name').textContent = isArabic ? data.personal.nameAr : data.personal.name;
    document.getElementById('hero-title').textContent = isArabic ? data.personal.jobTitleAr : data.personal.jobTitle;
    document.getElementById('hero-tagline').textContent = isArabic ? data.personal.taglineAr : data.personal.tagline;

    // Live Status
    const liveStatus = document.getElementById('live-status');
    const statusIndicator = liveStatus.querySelector('.status-indicator');
    const statusText = liveStatus.querySelector('.status-text span');

    if (data.liveStatus.available) {
        statusIndicator.style.background = 'var(--status-available)';
        statusText.textContent = isArabic ? data.liveStatus.arabicMessage : data.liveStatus.message;
    } else {
        statusIndicator.style.background = 'var(--status-busy)';
        statusText.textContent = isArabic ? 'مشغول حالياً' : 'Currently busy';
    }

    // About
    document.getElementById('about-content').innerHTML = `
        <p class="reveal">${isArabic ? data.about.paragraphAr : data.about.paragraph}</p>
        <p class="reveal">${isArabic ? 'أحمل' : 'I hold a'} ${isArabic ? data.about.education.degreeAr : data.about.education.degree} ${isArabic ? 'من' : 'from the'} <strong>${isArabic ? 'كلية الحاسبات والمعلومات، ' : 'Faculty of Computers and Information, '}${isArabic ? data.about.education.universityAr : data.about.education.university}</strong> (${isArabic ? 'دفعة' : 'Class of'} ${data.about.education.year}). ${isArabic ? 'تخرجت بتقدير' : 'I graduated with'} '${isArabic ? data.about.education.gradeAr : data.about.education.grade}' ${isArabic ? 'ومعدل تراكمي' : 'and a GPA of'} ${data.about.education.gpa}.</p>
    `;

    document.getElementById('about-info').innerHTML = `
        <div class="info-item reveal"><span data-i18n="about.location">${isArabic ? data.translations.ar.about.location : data.translations.en.about.location}</span> ${isArabic ? data.personal.locationAr : data.personal.location}</div>
        <div class="info-item reveal"><span data-i18n="about.education">${isArabic ? data.translations.ar.about.education : data.translations.en.about.education}</span> ${isArabic ? data.about.education.universityAr : data.about.education.university} (${data.about.education.year})</div>
    `;

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = `
        <div class="skill-category">
            <h3 class="reveal">${isArabic ? data.translations.ar.skills.technical : data.translations.en.skills.technical}</h3>
            <div class="skill-cards">
                ${(isArabic ? data.skills.technicalAr : data.skills.technical).map(s => `<div class="skill-card reveal">${s}</div>`).join('')}
            </div>
        </div>
        <div class="skill-category">
            <h3 class="reveal">${isArabic ? data.translations.ar.skills.support : data.translations.en.skills.support}</h3>
            <div class="skill-cards">
                ${(isArabic ? data.skills.supportAr : data.skills.support).map(s => `<div class="skill-card reveal">${s}</div>`).join('')}
            </div>
        </div>
    `;

    // Experience
    const experienceTimeline = document.getElementById('experience-timeline');
    experienceTimeline.innerHTML = data.experience.map(exp => `
        <div class="timeline-item reveal">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h3>${isArabic ? exp.titleAr : exp.title}</h3>
                <p class="company">${isArabic ? exp.companyAr : exp.company}</p>
                <p class="date">${isArabic ? exp.periodAr : exp.period}</p>
                <ul>
                    ${(isArabic ? exp.responsibilitiesAr : exp.responsibilities).map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    // Projects
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = data.projects.map(p => `
        <div class="project-card reveal">
            <div class="project-icon"><i class="${p.icon}"></i></div>
            <h3>${isArabic ? p.titleAr : p.title}</h3>
            <p>${isArabic ? p.descriptionAr : p.description}</p>
        </div>
    `).join('');

    // CV Link
    const cvDownloadBtn = document.getElementById('cv-download-btn');
    cvDownloadBtn.href = data.personal.cvLink;

    // Contact Info
    document.getElementById('contact-info-container').innerHTML = `
        <div class="contact-item reveal"><i class="fas fa-envelope"></i><p><a href="mailto:${data.personal.email}">${data.personal.email}</a></p></div>
        <div class="contact-item reveal"><i class="fas fa-phone"></i><p><a href="tel:${data.personal.phone}">${data.personal.phone}</a></p></div>
        <div class="contact-item reveal"><i class="fab fa-whatsapp"></i><p><a href="https://wa.me/${data.personal.whatsapp}" target="_blank">${isArabic ? 'تواصل عبر واتساب' : 'WhatsApp Me'}</a></p></div>
        <div class="contact-item reveal"><i class="fas fa-map-marker-alt"></i><p>${isArabic ? data.personal.locationAr : data.personal.location}</p></div>
    `;

    // Social Links
    document.getElementById('social-links-container').innerHTML = `
        <a href="${data.personal.linkedin}" target="_blank" title="LinkedIn" class="reveal"><i class="fab fa-linkedin-in"></i></a>
        <a href="${data.personal.github}" target="_blank" title="GitHub" class="reveal"><i class="fab fa-github"></i></a>
    `;
}
