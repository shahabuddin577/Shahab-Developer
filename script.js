// DOM Elements
const navbar = document.querySelector('.navbar');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('section');
const heroText = document.querySelector('.hero-content h1');
const statItems = document.querySelectorAll('.stat-item');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contact-form');

// Set animation delays on stat items for staggered effect
statItems.forEach((item, index) => {
    item.style.setProperty('--i', index);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    // Add scrolled class to navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav links
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.querySelector('a').classList.remove('active');
        if (link.querySelector('a').getAttribute('href').slice(1) === current) {
            link.querySelector('a').classList.add('active');
        }
    });
});

// Mobile Navigation Toggle
burger.addEventListener('click', () => {
    // Toggle Navigation
    nav.classList.toggle('nav-active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if it's open
        if (nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        }
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add sending state
        const submitButton = this.querySelector('.submit-button');
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message').value;
        
        // Send data to server
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, subject, message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                submitButton.textContent = 'Sent Successfully!';
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.textContent = 'Send Message';
                    submitButton.disabled = false;
                }, 2000);
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            submitButton.textContent = 'Error! Try Again';
            submitButton.style.backgroundColor = '#ff6b6b';
            
            // Reset button after delay
            setTimeout(() => {
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '';
            }, 3000);
        });
    });
}

// Scroll Animation with Intersection Observer
const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
};

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-text, .skill-category, .project-card, .stat-item').forEach(element => {
    element.classList.add('hidden');
    observer.observe(element);
});

// Typing Animation for Hero Section
const typeWriter = () => {
    if (heroText) {
        const text = heroText.textContent;
        heroText.innerHTML = ''; // Clear the content
        heroText.style.opacity = '1';
        
        let i = 0;
        const speed = 100; // Adjust speed as needed
        
        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '<') {
                    // Find the end of the HTML tag
                    const endIndex = text.indexOf('>', i);
                    if (endIndex !== -1) {
                        heroText.innerHTML += text.substring(i, endIndex + 1);
                        i = endIndex + 1;
                    } else {
                        i++;
                    }
                } else {
                    heroText.innerHTML += text.charAt(i);
                    i++;
                }
                setTimeout(type, speed);
            }
        }
        
        setTimeout(() => {
            type();
        }, 500);
    }
};

// Particles background effect
const createParticles = () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.setProperty('--size', Math.random() * 2 + 1 + 'px');
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDuration = Math.random() * 5 + 5 + 's';
            particle.style.animationDelay = Math.random() * 3 + 's';
            hero.appendChild(particle);
        }
    }
};

// Scroll-triggered parallax effects
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    
    // Parallax effect on hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `50% ${scrollPosition * 0.5}px`;
    }
    
    // Rotate project cards slightly based on scroll
    projectCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect().top;
        const rotation = (cardPosition - window.innerHeight / 2) / (window.innerHeight / 2) * 5;
        card.style.transform = `perspective(1000px) rotateY(${rotation}deg) translateY(-5px)`;
    });
});

// Project card hover effect
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const rotateX = (e.clientY - cardCenterY) / 10;
        const rotateY = (cardCenterX - e.clientX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Skills progress animation
const animateSkills = () => {
    const skills = document.querySelectorAll('.skill-category li');
    skills.forEach((skill, index) => {
        skill.style.animation = `fadeIn 0.5s ease-out forwards ${index * 0.1}s`;
        skill.style.opacity = '0';
    });
};

// Load Projects Dynamically
const loadProjects = async () => {
    const projectsContainer = document.querySelector('.project-grid');
    if (!projectsContainer) return;

    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        // Clear existing content
        projectsContainer.innerHTML = '';
        
        // Add projects to the DOM
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            const tags = project.technologies.map(tech => 
                `<span>${tech}</span>`
            ).join('');
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.imageUrl}" alt="${project.title}">
                </div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${tags}
                </div>
                <div class="project-links">
                    <a href="${project.liveUrl}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> View Live
                    </a>
                    <a href="${project.githubUrl}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
        
        // Re-initialize project card effects
        const newProjectCards = document.querySelectorAll('.project-card');
        
        // Apply hover effect to new cards
        newProjectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const rotateX = (e.clientY - cardCenterY) / 10;
                const rotateY = (cardCenterX - e.clientX) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
        
    } catch (error) {
        console.error('Error loading projects:', error);
    }
};

// Initialize functions on page load
window.addEventListener('load', () => {
    // Add CSS for particle animations
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: floatParticle linear infinite;
        }
        
        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0);
            }
            25% {
                transform: translateY(-20vh) translateX(20vw);
            }
            50% {
                transform: translateY(-40vh) translateX(0);
            }
            75% {
                transform: translateY(-20vh) translateX(-20vw);
            }
            100% {
                transform: translateY(0) translateX(0);
            }
        }
        
        .hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        .animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    createParticles();
    typeWriter();
    animateSkills();
    loadProjects(); // Load projects from API
    
    // Initialize scroll-to-top button
    initScrollToTopButton();
});

// Add preloader
document.body.insertAdjacentHTML('afterbegin', `
    <div class="preloader">
        <div class="loader"></div>
    </div>
`);

const preloader = document.querySelector('.preloader');
const style = document.createElement('style');
style.textContent = `
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--gradient-1);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.8s, visibility 0.8s;
    }
    
    .loader {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: var(--accent-color);
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    
    .preloader.hide {
        opacity: 0;
        visibility: hidden;
    }
`;
document.head.appendChild(style);

window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('hide');
    }, 1000);
});

// Add scroll-to-top button
document.body.insertAdjacentHTML('beforeend', `
    <button class="scroll-top" aria-label="Scroll to top">
        <i class="fas fa-arrow-up"></i>
    </button>
`);

const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Scroll-to-top button functionality
const initScrollToTopButton = () => {
    const scrollTopButton = document.querySelector('.scroll-top');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopButton.classList.add('active');
            } else {
                scrollTopButton.classList.remove('active');
            }
        });
        
        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}; 