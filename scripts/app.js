// scripts/app.js
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const header = document.querySelector('.header');

    // Mobile Menu Toggle

    menuToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', navList.classList.contains('active'));
});

// Close menu when clicking outside
    document.addEventListener('click', (e) => {
    if (!e.target.closest('.header')) {
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

    // Smooth Scroll for same-page navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll to Top Button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.className = 'scroll-top';
    document.body.appendChild(scrollToTopButton);

    window.addEventListener('scroll', () => {
        scrollToTopButton.style.display = window.pageYOffset > 500 ? 'block' : 'none';
    });

    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌓';
    header?.appendChild(darkModeToggle);

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Initialize dark mode from localStorage
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Lazy Load Images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        img.dataset.src = img.src;
        img.removeAttribute('src');
        observer.observe(img);
    });

    // Project Filtering System
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons?.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                card.style.display = filter === 'all' || card.dataset.category === filter 
                    ? 'block' 
                    : 'none';
            });
        });
    });

    // Modal System for Projects
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    document.body.appendChild(modal);

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const image = card.querySelector('img').cloneNode();

            modal.innerHTML = `
                <div class="modal-content">
                    <button class="close-modal">&times;</button>
                    ${image.outerHTML}
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
            `;
            
            modal.style.display = 'flex';
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Set active navigation link
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-list a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Contact Form Validation
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        
        if (validateForm()) {
            // Simulate form submission
            contactForm.reset();
            contactForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // For real usage, add fetch() to your backend here
        }
    });
}

function validateForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name');
    if (name.value.trim() === '') {
        showError(name, 'Name is required');
        isValid = false;
    }

    // Email validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError(email, 'Valid email required');
        isValid = false;
    }

    // Subject validation
    const subject = document.getElementById('subject');
    if (subject.value.trim() === '') {
        showError(subject, 'Subject is required');
        isValid = false;
    }

    // Message validation
    const message = document.getElementById('message');
    if (message.value.trim() === '') {
        showError(message, 'Message is required');
        isValid = false;
    }

    return isValid;
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    error.textContent = message;
    error.style.display = 'block';
    input.style.borderColor = '#e74c3c';
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.style.borderColor = '#ddd';
    });
}