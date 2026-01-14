/* --- Меню для мобил --- */
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

const mobileLinks = document.querySelectorAll(".nav-link-mobile");
mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });
});


/* --- Плавный скролл --- */
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        const headerHeight = document.getElementById("header").offsetHeight;
        const offsetPosition = section.offsetTop - headerHeight;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll(".feature-card, .product-card, .gallery-item, .contact-info-card");
animatedElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
});

window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
        header.style.background = "rgba(252, 250, 248, 0.95)";
    } else {
        header.style.background = "rgba(252, 250, 248, 0.8)";
    }
});


/* --- Модальное окно --- */
const modalOverlay = document.getElementById('modalOverlay');
const modalWindow = document.querySelector('.modal-window');
const modalCloseBtn = document.getElementById('modalClose');
const modalActionBtn = document.getElementById('modalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalIcon = document.getElementById('modalIcon');

const iconSuccess = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
const iconError = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

function showModal(type, title, message) {
    modalWindow.classList.remove('success', 'error');

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    if (type === 'success') {
        modalWindow.classList.add('success');
        modalIcon.innerHTML = iconSuccess;
        modalActionBtn.textContent = "Отлично";
    } else {
        modalWindow.classList.add('error');
        modalIcon.innerHTML = iconError;
        modalActionBtn.textContent = "Закрыть";
    }

    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

modalCloseBtn.addEventListener('click', closeModal);
modalActionBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});


/* --- Валидация для формы отправки--- */
document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const charCount = document.querySelector(".char-count");

    function showError(input, message) {
        const errorDiv = document.getElementById(input.name + "-error");
        const formGroup = input.closest(".form-group");
        errorDiv.textContent = message;
        formGroup.classList.add("error");
        input.classList.add("error-input");
    }

    function clearError(input) {
        const errorDiv = document.getElementById(input.name + "-error");
        const formGroup = input.closest(".form-group");
        errorDiv.textContent = "";
        formGroup.classList.remove("error");
        input.classList.remove("error-input");
    }

    function validateName() {
        const value = nameInput.value.trim();
        if (value === "") return showError(nameInput, "Пожалуйста, введите ваше имя."), false;
        if (!/^[\p{L}\s'-]+$/u.test(value)) return showError(nameInput, "Имя может содержать только буквы."), false;
        if (value.length > 50) return showError(nameInput, "Слишком длинное имя."), false;
        clearError(nameInput);
        return true;
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        if (value === "") return showError(phoneInput, "Пожалуйста, введите телефон."), false;
        if (!/^[\d\s\+\-\(\)]{10,20}$/.test(value)) return showError(phoneInput, "Введите корректный номер."), false;
        clearError(phoneInput);
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        if (value === "") {
            clearError(emailInput);
            return true;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return showError(emailInput, "Некорректный email."), false;
        clearError(emailInput);
        return true;
    }

    function updateCharCount() {
        const len = messageInput.value.length;
        charCount.textContent = `${len} / 200`;
    }

    nameInput.addEventListener("input", () => {
        if (nameInput.classList.contains("error-input")) validateName();
    });
    phoneInput.addEventListener("input", () => {
        if (phoneInput.classList.contains("error-input")) validatePhone();
    });
    emailInput.addEventListener("input", () => {
        if (emailInput.classList.contains("error-input")) validateEmail();
    });
    messageInput.addEventListener("input", updateCharCount);

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();

        if (isNameValid && isPhoneValid && isEmailValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = "Отправка...";

            const formData = {
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            fetch("send-order.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(async response => {
                    const result = await response.json();
                    if (result.success) {
                        showModal('success', 'Заказ отправлен!', 'Спасибо! Мы свяжемся с вами в ближайшее время.');
                        contactForm.reset();
                        updateCharCount();
                        document.querySelectorAll(".form-group").forEach(el => el.classList.remove("error"));
                        document.querySelectorAll(".error-input").forEach(el => el.classList.remove("error-input"));
                    } else {
                        throw new Error(result.error || "Ошибка сервера");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    showModal('error', 'Ошибка отправки', 'Не удалось отправить заказ. Попробуйте позже или позвоните нам.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        }
    });

    updateCharCount();
});


/* --- Lightbox --- */
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentIndex = 0;
    const images = [];

    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            images.push(img.src);
            item.addEventListener('click', () => {
                currentIndex = index;
                openLightbox(index);
            });
        }
    });

    function openLightbox(index) {
        lightboxImage.src = images[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            lightboxImage.classList.add('visible');
        }, 50);
    }

    function closeLightbox() {
        lightboxImage.classList.remove('visible');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImage.src = '';
        }, 300);
    }

    function changeImage(direction) {
        lightboxImage.classList.remove('visible');
        lightboxImage.style.transform = direction === 'next' ? 'translateX(-50px) scale(0.95)' : 'translateX(50px) scale(0.95)';
        lightboxImage.style.opacity = '0';

        setTimeout(() => {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }

            lightboxImage.src = images[currentIndex];

            lightboxImage.style.transition = 'none';
            lightboxImage.style.transform = direction === 'next' ? 'translateX(50px) scale(0.95)' : 'translateX(-50px) scale(0.95)';

            void lightboxImage.offsetWidth;

            lightboxImage.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            lightboxImage.style.transform = 'translateX(0) scale(1)';
            lightboxImage.style.opacity = '1';
            lightboxImage.classList.add('visible');

        }, 300);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        changeImage('next');
    });
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        changeImage('prev');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') changeImage('next');
        if (e.key === 'ArrowLeft') changeImage('prev');
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {
        passive: true
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {
        passive: true
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            changeImage('next');
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            changeImage('prev');
        }
    }
});


/* --- Копирование в буфер обмена с уведомлением --- */
function copyToClipboard(element) {
    const text = element.textContent.trim();
    if (!text) return;

    navigator.clipboard.writeText(text)
        .then(() => {
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Скопировано!';
            tooltip.style.cssText = `
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
          pointer-events: none;
          margin-top: 12px;
        `;

            document.body.appendChild(tooltip);

            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateX(-50%) translateY(10px)';
            }, 10);

            setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateX(-50%) translateY(0)';
                setTimeout(() => {
                    document.body.removeChild(tooltip);
                }, 200);
            }, 1500);
        })
        .catch(err => {
            console.error('Не удалось скопировать:', err);
        });
}