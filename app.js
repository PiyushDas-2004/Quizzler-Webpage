// Global variables
let isScrolling = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initScrollAnimations();
    initCounterAnimations();
    initMobileMenu();
    initParallaxEffects();
    initHeaderScroll();
    initDownloadButtons();
    addScrollProgress();
});

// Initialize Download Buttons
function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', downloadApp);
    });
}

// Smooth Scrolling Navigation - Fixed
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#download') {
                // Special case for download - scroll to footer
                const footer = document.querySelector('.footer');
                if (footer) {
                    footer.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Prevent multiple scroll events
                if (!isScrolling) {
                    isScrolling = true;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Reset scrolling flag after animation
                    setTimeout(() => {
                        isScrolling = false;
                    }, 1000);
                }
            }
        });
    });
}

// Scroll-based Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation delays for grid items
                if (entry.target.parentElement.classList.contains('features__grid') ||
                    entry.target.parentElement.classList.contains('technology__grid') ||
                    entry.target.parentElement.classList.contains('team__grid')) {
                    
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 100}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.feature-card, .tech-card, .team-card, .benefit, .testimonial'
    );
    
    animatableElements.forEach(el => observer.observe(el));
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat__number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60 FPS
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas for large numbers
        const displayValue = Math.floor(current).toLocaleString();
        element.textContent = displayValue;
    }, 16);
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Parallax Effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.particle');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.2)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Download App Function - Fixed
function downloadApp(event) {
    event.preventDefault();
    
    // Create a more realistic download simulation
    const downloadBtn = event.target.closest('.download-btn');
    const originalText = downloadBtn.innerHTML;
    
    // Show loading state
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Download...';
    downloadBtn.disabled = true;
    
    // Simulate download preparation
    setTimeout(() => {
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Downloading...';
        
        // Show success message
        setTimeout(() => {
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Download Started!';
            downloadBtn.style.background = 'var(--color-success)';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
                downloadBtn.style.background = '';
            }, 3000);
        }, 1000);
    }, 1500);
    
    // Show download instructions
    showDownloadModal();
}

// Download Modal - Enhanced
function showDownloadModal() {
    // Remove existing modal if present
    const existingModal = document.querySelector('.download-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fab fa-android"></i> Download Quizzler</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="download-info">
                        <div class="qr-placeholder">
                            <i class="fas fa-qrcode"></i>
                            <p>QR Code</p>
                        </div>
                        <div class="download-details">
                            <h4>Get Quizzler for Android</h4>
                            <p>Experience personalized learning with AI-powered assessments</p>
                            <div class="download-features">
                                <div class="download-feature">
                                    <i class="fas fa-brain"></i>
                                    <span>Adaptive Learning</span>
                                </div>
                                <div class="download-feature">
                                    <i class="fas fa-chart-line"></i>
                                    <span>Progress Tracking</span>
                                </div>
                                <div class="download-feature">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>Secure Exams</span>
                                </div>
                            </div>
                            <button class="btn btn--primary btn--full-width" onclick="initiateDownload()">
                                <i class="fab fa-google-play"></i>
                                Coming Soon to Google Play
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .download-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .download-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--space-20);
            }
            
            .modal-content {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                border: 1px solid var(--color-card-border);
                max-width: 500px;
                width: 100%;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .download-modal.active .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-24);
                border-bottom: 1px solid var(--color-card-border-inner);
            }
            
            .modal-header h3 {
                margin: 0;
                color: var(--color-text);
                display: flex;
                align-items: center;
                gap: var(--space-8);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .modal-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
            
            .modal-body {
                padding: var(--space-24);
            }
            
            .download-info {
                display: flex;
                gap: var(--space-24);
                align-items: center;
            }
            
            .qr-placeholder {
                width: 120px;
                height: 120px;
                background: var(--color-bg-1);
                border-radius: var(--radius-base);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: var(--space-8);
            }
            
            .qr-placeholder i {
                font-size: var(--font-size-4xl);
                color: var(--color-primary);
            }
            
            .qr-placeholder p {
                margin: 0;
                font-size: var(--font-size-sm);
                color: var(--color-text-secondary);
            }
            
            .download-details {
                flex: 1;
            }
            
            .download-details h4 {
                margin-bottom: var(--space-8);
                color: var(--color-text);
            }
            
            .download-details > p {
                color: var(--color-text-secondary);
                margin-bottom: var(--space-16);
            }
            
            .download-features {
                display: flex;
                flex-direction: column;
                gap: var(--space-8);
                margin-bottom: var(--space-20);
            }
            
            .download-feature {
                display: flex;
                align-items: center;
                gap: var(--space-8);
            }
            
            .download-feature i {
                color: var(--color-primary);
                width: 16px;
            }
            
            .download-feature span {
                color: var(--color-text-secondary);
                font-size: var(--font-size-sm);
            }
            
            @media (max-width: 768px) {
                .download-info {
                    flex-direction: column;
                    text-align: center;
                }
                
                .qr-placeholder {
                    width: 100px;
                    height: 100px;
                }
            }
        `;
        
        document.head.appendChild(modalStyles);
    }
    
    document.body.appendChild(modal);
    
    // Add close functionality
    modal.querySelector('.modal-close').addEventListener('click', closeDownloadModal);
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeDownloadModal();
        }
    });
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 50);
}

function closeDownloadModal() {
    const modal = document.querySelector('.download-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function initiateDownload() {
    // Create a demo file download
    const demoContent = `Welcome to Quizzler!

This is a demonstration of our AI-powered learning application.

Features:
✓ Adaptive Assessments with 82% accuracy
✓ Personalized Learning Paths
✓ Focus Mode for distraction-free learning
✓ Secure Exam Mode with anti-cheating measures

Powered by 5 Advanced AI Models:
- Decision Tree (82% accuracy)
- Support Vector Machine (78% accuracy) 
- Bayesian Network (80% accuracy)
- RNN-LSTM (MSE: 0.05)
- K-Nearest Neighbors (80% accuracy)

Results:
• 15% improvement in test scores
• Enhanced student engagement
• Better learning outcomes

Developed by the team at Thakur College of Engineering & Technology, Mumbai.

Thank you for your interest in Quizzler!
The full Android app will be available on Google Play Store soon.`;

    const blob = new Blob([demoContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Quizzler-Demo-Info.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    closeDownloadModal();
}

// Add interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add floating animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add glow effect to tech cards
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 30px rgba(var(--color-primary-rgb, 33, 128, 141), 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
});

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    
    const progressStyles = document.createElement('style');
    progressStyles.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(var(--color-brown-600-rgb, 94, 82, 64), 0.1);
            z-index: 1001;
        }
        
        .scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--color-primary), var(--color-primary-hover));
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    
    document.head.appendChild(progressStyles);
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        
        const progressBarElement = document.querySelector('.scroll-progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = `${Math.min(progress, 100)}%`;
        }
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.querySelector('.download-modal.active');
        if (modal) {
            closeDownloadModal();
        }
    }
    
    // Navigate sections with arrow keys (when not in input)
    if (!e.target.matches('input, textarea, select')) {
        const sections = ['#home', '#features', '#technology', '#results', '#team', '#download'];
        const currentSection = getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        
        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            e.preventDefault();
            const nextSection = document.querySelector(sections[currentIndex + 1]);
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            const prevSection = document.querySelector(sections[currentIndex - 1]);
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

function getCurrentSection() {
    const sections = ['#home', '#features', '#technology', '#results', '#team', '#download'];
    let current = '#home';
    
    sections.forEach(sectionId => {
        const section = document.querySelector(sectionId);
        if (section && section.getBoundingClientRect().top <= 100) {
            current = sectionId;
        }
    });
    
    return current;
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add a subtle fade-in for the entire page
    if (!document.querySelector('#loading-styles')) {
        const loadingStyles = document.createElement('style');
        loadingStyles.id = 'loading-styles';
        loadingStyles.textContent = `
            body {
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }
            
            body.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(loadingStyles);
    }
});
