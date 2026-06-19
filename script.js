/* ==========================================================================
   CHARISMA BEAUTY LADIES SALON - INTERACTIVE LOGIC (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initFAQAccordion();
    initBookingSystem();
    initCartSystem();
    initReviewSystem();
    initInquirySystem();
});

/* ==========================================================================
   NAVIGATION LOGIC
   ========================================================================== */
function initNavigation() {
    const header = document.getElementById('navbar');
    const mobileMenuOpenBtn = document.getElementById('mobile-menu-open');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

    // Sticky nav on scroll
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Mobile nav toggles
    if (mobileMenuOpenBtn) {
        mobileMenuOpenBtn.addEventListener('click', openMobileMenu);
    }
    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
    }
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    function openMobileMenu() {
        mobileNavOverlay.classList.add('open');
        mobileNavDrawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    window.closeMobileMenu = function() {
        if (mobileNavOverlay && mobileNavDrawer) {
            mobileNavOverlay.classList.remove('open');
            mobileNavDrawer.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Set Active State in Navbar based on current pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ==========================================================================
   THEME TOGGLE (LIGHT / DARK MODE)
   ========================================================================== */
// Theme toggling removed to force default light theme

/* ==========================================================================
   SCROLL FADE-IN ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
    const fadeSections = document.querySelectorAll('.fade-in-section');
    if (fadeSections.length === 0) return;

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, observerOptions);

        fadeSections.forEach(section => {
            section.classList.add('js-fade');
            sectionObserver.observe(section);
        });
    }
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length === 0) return;

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            const isActive = item.classList.contains('active');

            // Close all other items first
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherAnswer) otherAnswer.style.maxHeight = '0px';
                const otherBtn = otherItem.querySelector('.faq-question');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = '0px';
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

/* ==========================================================================
   BOOKING MODAL SYSTEM
   ========================================================================== */
function initBookingSystem() {
    // Automatically set default date to today or tomorrow
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
}

window.openBookingModal = function(preselectedService = null) {
    const modal = document.getElementById('booking-modal');
    const formContainer = document.getElementById('booking-form-container');
    const successScreen = document.getElementById('booking-success-screen');
    const serviceSelect = document.getElementById('book-service');

    if (!modal) return;

    // Reset screens
    formContainer.style.display = 'block';
    successScreen.style.display = 'none';

    // Preselect service if supplied
    if (preselectedService && serviceSelect) {
        // Match the value
        for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value.includes(preselectedService) || preselectedService.includes(serviceSelect.options[i].value)) {
                serviceSelect.selectedIndex = i;
                break;
            }
        }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeBookingModal = function() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        // Reset form
        document.getElementById('booking-form').reset();
    }
};

window.handleBookingSubmit = function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('book-first-name').value;
    const lastName = document.getElementById('book-last-name').value;
    const email = document.getElementById('book-email').value;
    const phone = document.getElementById('book-phone').value;
    const service = document.getElementById('book-service').value;
    const date = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;

    const formContainer = document.getElementById('booking-form-container');
    const successScreen = document.getElementById('booking-success-screen');
    const detailsParagraph = document.getElementById('booking-success-details');

    // Display confirmation details
    detailsParagraph.innerHTML = `
        Dear <strong>${firstName} ${lastName}</strong>, your appointment for <strong>${service}</strong> on 
        <strong>${formatDate(date)}</strong> at <strong>${time}</strong> has been reserved.<br>
        A confirmation details summary and stylist assignments have been sent to <strong>${email}</strong>.<br>
        Contact number registered: <strong>${phone}</strong>.
    `;

    // Visual transitions
    formContainer.style.display = 'none';
    successScreen.style.display = 'block';
};

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

/* ==========================================================================
   SHOPPING CART SYSTEM
   ========================================================================== */
let cart = [];

function initCartSystem() {
    const cartBtn = document.getElementById('cart-btn');
    const cartBtnMobile = document.getElementById('cart-btn-mobile');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartOverlay = document.getElementById('cart-overlay');

    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    if (cartBtnMobile) {
        cartBtnMobile.addEventListener('click', openCart);
    }
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) closeCart();
        });
    }

    function openCart() {
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Load cart from session/local storage
    const savedCart = localStorage.getItem('charisma_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }

    // Dynamic Filter Tabs in Products Page catalog
    const productTabs = document.getElementById('product-tabs');
    if (productTabs) {
        const tabs = productTabs.querySelectorAll('.filter-tab');
        const products = document.querySelectorAll('#products-catalog article');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                products.forEach(product => {
                    const category = product.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        product.style.display = '';
                        setTimeout(() => product.style.opacity = '1', 50);
                    } else {
                        product.style.opacity = '0';
                        setTimeout(() => product.style.display = 'none', 300);
                    }
                });
            });
        });
    }
}

window.addToCart = function(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    }

    // Save cart
    localStorage.setItem('charisma_cart', JSON.stringify(cart));
    
    // Update display
    updateCartUI();
    
    // Play visual feedback animation on cart badges
    const badge = document.getElementById('cart-badge-count');
    const badgeMobile = document.getElementById('cart-badge-count-mobile');
    if (badge) {
        badge.style.transform = 'scale(1.4)';
        badge.style.backgroundColor = 'var(--color-soft-gold)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
            badge.style.backgroundColor = 'var(--color-primary)';
        }, 300);
    }
    if (badgeMobile) {
        badgeMobile.style.transform = 'scale(1.4)';
        badgeMobile.style.backgroundColor = 'var(--color-soft-gold)';
        setTimeout(() => {
            badgeMobile.style.transform = 'scale(1)';
            badgeMobile.style.backgroundColor = 'var(--color-primary)';
        }, 300);
    }

    // Auto open cart drawer
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
};

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const badgeCount = document.getElementById('cart-badge-count');
    const badgeCountMobile = document.getElementById('cart-badge-count-mobile');
    const subtotalText = document.getElementById('cart-subtotal');
    
    if (!cartItemsContainer) return;

    // Cart total quantity count
    const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
    if (badgeCount) badgeCount.textContent = totalQty;
    if (badgeCountMobile) badgeCountMobile.textContent = totalQty;

    // Cart Subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (subtotalText) subtotalText.textContent = `${subtotal} AED`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty-message">Your bag is currently empty.</div>';
        return;
    }

    let itemsHtml = '';
    cart.forEach(item => {
        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img alt="${item.name}" src="${item.img}">
                </div>
                <div class="cart-item-details">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} AED</div>
                    </div>
                    <div class="cart-item-quantity-controls">
                        <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                        <button class="cart-item-remove" onclick="removeCartItem('${item.id}')" style="margin-left: auto;">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    cartItemsContainer.innerHTML = itemsHtml;
}

window.updateQty = function(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeCartItem(id);
        return;
    }

    localStorage.setItem('charisma_cart', JSON.stringify(cart));
    updateCartUI();
};

window.removeCartItem = function(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('charisma_cart', JSON.stringify(cart));
    updateCartUI();
};

window.checkout = function() {
    if (cart.length === 0) return;
    alert('Thank you for shopping at Charisma! This is a mock checkout simulation. Your total is ' + document.getElementById('cart-subtotal').textContent + '.');
    cart = [];
    localStorage.removeItem('charisma_cart');
    updateCartUI();
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
};

/* ==========================================================================
   CLIENT REVIEWS SYSTEM
   ========================================================================== */
function initReviewSystem() {
    const form = document.getElementById('testimonial-form');
    if (!form) return;

    window.handleReviewSubmit = function(event) {
        event.preventDefault();
        
        const name = document.getElementById('review-name').value;
        const service = document.getElementById('review-service').value;
        const text = document.getElementById('review-text-content').value;
        const headline = document.getElementById('review-headline').value || 'Beautiful treatment';
        
        const starRadio = document.querySelector('input[name="stars-rating"]:checked');
        const rating = starRadio ? parseInt(starRadio.value) : 5;

        // Render new card details
        const masonry = document.getElementById('reviews-masonry');
        if (masonry) {
            const card = document.createElement('div');
            card.className = 'masonry-item bg-surface-container-lowest rounded-lg p-stack-lg shadow-[0_4px_20px_rgba(233,93,157,0.08)] border border-surface-variant/50 relative overflow-hidden group';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            let starsHtml = '';
            for (let i = 0; i < rating; i++) {
                starsHtml += '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1;">star</span>';
            }
            for (let i = rating; i < 5; i++) {
                starsHtml += '<span class="material-symbols-outlined">star</span>';
            }

            // Get Initials for Avatar
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            card.innerHTML = `
                <div class="flex items-center gap-2 mb-stack-sm text-soft-gold">${starsHtml}</div>
                <h3 class="font-headline-md text-headline-md text-on-surface mb-stack-md">"${headline}"</h3>
                <p class="font-body-md text-body-md text-on-surface-variant mb-stack-lg">"${text}"</p>
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-fixed bg-surface-container-highest flex items-center justify-center font-bold text-primary-container">${initials}</div>
                    <div>
                        <p class="font-body-md text-body-md font-semibold text-on-surface">${name}</p>
                        <p class="font-label-caps text-label-caps text-on-surface-variant/70 uppercase">${service}</p>
                    </div>
                </div>
            `;

            // Insert at the top of masonry
            masonry.insertBefore(card, masonry.firstChild);
            
            // Animation trigger
            setTimeout(() => {
                card.style.transition = 'all var(--transition-slow)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }

        // Display Success screen
        form.style.display = 'none';
        document.getElementById('review-success-screen').style.display = 'block';
    };
}

/* ==========================================================================
   CONTACT INQUIRY SYSTEM
   ========================================================================== */
function initInquirySystem() {
    const form = document.getElementById('contact-inquiry-form');
    if (!form) return;

    window.handleInquirySubmit = function(event) {
        event.preventDefault();
        
        // Hide form and display success screen
        form.style.display = 'none';
        document.getElementById('contact-success-screen').style.display = 'block';
    };
}
