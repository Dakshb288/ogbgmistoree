// Add this at the very start of your file, before any other code
function checkTelegramWebApp() {
    if (!window.Telegram || !window.Telegram.WebApp) {
        // Not opened in Telegram, show error message
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                text-align: center;
            ">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #ff3b30; margin-bottom: 20px;"></i>
                <h1 style="color: #fff; font-family: var(--font-heading); margin-bottom: 15px;">Access Restricted</h1>
                <p style="color: #808080; font-size: 16px; line-height: 1.5;">
                    This store can only be accessed through Telegram.<br>
                    Please open it using our Telegram bot:
                </p>
                <a href="https://t.me/OgbgmiSTOREE_bot" style="
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 24px;
                    background: #0088cc;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-family: var(--font-heading);
                ">
                    <i class="fab fa-telegram"></i>
                    Open in Telegram
                </a>
            </div>
        `;
        return false;
    }
    return true;
}

// Move these to global scope
let accounts = [];
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    modal.offsetHeight; // Force reflow
    modal.classList.add('active');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if opened in Telegram
    if (!checkTelegramWebApp()) {
        return; // Stop execution if not in Telegram
    }

    // Initialize Telegram WebApp
    try {
        const webapp = window.Telegram.WebApp;
        webapp.ready();
        webapp.expand();
        
        // Get user data and log it for debugging
        const user = webapp.initDataUnsafe?.user;
        console.log('Telegram User Data:', user);
        
        // Update profile with Telegram data
        const usernameElement = document.getElementById('telegram-username');
        if (usernameElement) {
            // Try to get username from Telegram's WebApp data
            if (webapp.initDataUnsafe?.user?.username) {
                usernameElement.textContent = '@' + webapp.initDataUnsafe.user.username;
            } 
            // Fallback to first name if username isn't available
            else if (webapp.initDataUnsafe?.user?.first_name) {
                usernameElement.textContent = webapp.initDataUnsafe.user.first_name;
            }
            // Default case
            else {
                usernameElement.textContent = '@user';
            }
        }

        // Log the entire WebApp data for debugging
        console.log('Full WebApp Data:', webapp.initDataUnsafe);
    } catch (error) {
        console.error('Telegram WebApp initialization error:', error);
    }

    // Navigation functionality
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // First remove active classes
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Hide all tabs first
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show new tab with animation
            const newTab = document.getElementById(`${tabName}-tab`);
            newTab.style.display = 'block';
            
            // Force reflow
            newTab.offsetHeight;
            
            // Add active class to trigger animation
            newTab.classList.add('active');
            
            // Handle trust banner and CTA visibility
            const trustBanner = document.querySelector('.trust-banner');
            const browseCta = document.querySelector('.browse-cta');
            
            if (tabName === 'home') {
                trustBanner.style.display = 'block';
                browseCta.style.display = 'block';
            } else {
                trustBanner.style.display = 'none';
                browseCta.style.display = 'none';
            }

            // Add this to your tab switching logic in the event listener
            const floatingCta = document.querySelector('.floating-cta');
            
            // Show/hide floating CTA only in proofs section
            if (tabName === 'proofs') {
                floatingCta.classList.add('active');
            } else {
                floatingCta.classList.remove('active');
            }
        });
    });

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }

    // Initialize accounts data first
    accounts = [
        {
            id: 1,
            title: 'TEST',
            price: 99999,
            flashDeal: {
                active: false,
                originalPrice: 1299999,
                endsIn: "2h"  // Simple text display
            },
            images: ['./assets/accounts/does-anyone-know-who-this-is-some-people-say-its-cj-but-v0-3pk9b5dgj5va1.jpg.webp'],
            status: 'available',
            level: 75,
            royalPass: true,
            loginType: 'Facebook',
            details: {
                'Account Level': '75',
                'Royal Pass': 'Purchased',
                'Mythic Outfits': '8',
                'Gun Skins': '15+',
                'Achievement Points': '3500+',
                'Login Methods': '2 (Facebook + X)'
            },
            description: 'Testing hori hai bhayankar'
        },
    ];

    // Render accounts immediately after initialization
    const accountsGrid = document.querySelector('.accounts-grid');
    if (accountsGrid) {
        accountsGrid.innerHTML = accounts.map(account => `
            <div class="account-card visible" data-status="${account.status}">
                <div class="account-image" style="position: relative; aspect-ratio: 16/9; overflow: hidden;">
                    <img src="${account.images[0]}" alt="${account.title}" 
                        style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
                    <div class="image-overlay"></div>
                    <span class="status ${account.status}">${account.status.toUpperCase()}</span>
                    ${account.flashDeal && account.flashDeal.active ? `
                        <span class="flash-deal-badge">
                            <i class="fas fa-bolt"></i> FLASH DEAL
                        </span>
                    ` : ''}
                    <div class="account-meta">
                        <span class="meta-item">
                            <i class="fas fa-gamepad"></i>
                            Level ${account.level}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-crown"></i>
                            ${account.royalPass ? 'RP Active' : 'No RP'}
                        </span>
                    </div>
                </div>
                <div class="account-details">
                    <div class="title-section">
                        <h3>${account.title}</h3>
                        <span class="verified-badge">
                            <i class="fas ${account.status === 'sold' ? 'fa-times' : 'fa-check-circle'}"
                               style="color: ${account.status === 'sold' ? '#ff3b30' : '#00ffa3'}"></i>
                        </span>
                    </div>
                    <div class="price-section">
                        <div class="price-wrapper">
                            <p class="price">₹${account.price}</p>
                            ${account.flashDeal && account.flashDeal.active ? `
                                <p class="original-price">₹${account.flashDeal.originalPrice}</p>
                            ` : ''}
                        </div>
                        <span class="price-tag">
                            ${account.flashDeal && account.flashDeal.active ? `
                                <i class="fas fa-clock"></i> ${account.flashDeal.endsIn}
                            ` : account.status === 'sold' ? 'Sold Out' : 'Best Value'}
                        </span>
                    </div>
                    <div class="action-buttons">
                        ${account.status === 'available' ? `
                            <button class="btn-buy" onclick="initiatePayment(${account.id})">
                                <i class="fas fa-shopping-cart"></i>
                                BUY NOW
                            </button>
                        ` : ''}
                        <button class="btn-view" onclick="viewDetails(${account.id})" style="${account.status === 'sold' ? 'grid-column: 1 / -1;' : ''}">
                            <i class="fas fa-eye"></i>
                            VIEW DETAILS
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Achievement Slider
    initAchievementSlider();

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    function updateAccounts() {
        let filteredAccounts = accounts;
        if (currentFilter !== 'all') {
            filteredAccounts = accounts.filter(account => account.status === currentFilter);
        }

        accountsGrid.innerHTML = filteredAccounts.map(account => `
            <div class="account-card visible" data-status="${account.status}">
                <div class="account-image" style="position: relative; aspect-ratio: 16/9; overflow: hidden;">
                    <img src="${account.images[0]}" alt="${account.title}" 
                        style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
                    <div class="image-overlay"></div>
                    <span class="status ${account.status}">${account.status.toUpperCase()}</span>
                    ${account.flashDeal && account.flashDeal.active ? `
                        <span class="flash-deal-badge">
                            <i class="fas fa-bolt"></i> FLASH DEAL
                        </span>
                    ` : ''}
                    <div class="account-meta">
                        <span class="meta-item">
                            <i class="fas fa-gamepad"></i>
                            Level ${account.level}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-crown"></i>
                            ${account.royalPass ? 'RP Active' : 'No RP'}
                        </span>
                    </div>
                </div>
                <div class="account-details">
                    <div class="title-section">
                        <h3>${account.title}</h3>
                        <span class="verified-badge">
                            <i class="fas ${account.status === 'sold' ? 'fa-times' : 'fa-check-circle'}"
                               style="color: ${account.status === 'sold' ? '#ff3b30' : '#00ffa3'}"></i>
                        </span>
                    </div>
                    <div class="price-section">
                        <div class="price-wrapper">
                            <p class="price">₹${account.price}</p>
                            ${account.flashDeal && account.flashDeal.active ? `
                                <p class="original-price">₹${account.flashDeal.originalPrice}</p>
                            ` : ''}
                        </div>
                        <span class="price-tag">
                            ${account.flashDeal && account.flashDeal.active ? `
                                <i class="fas fa-clock"></i> ${account.flashDeal.endsIn}
                            ` : account.status === 'sold' ? 'Sold Out' : 'Best Value'}
                        </span>
                    </div>
                    <div class="action-buttons">
                        ${account.status === 'available' ? `
                            <button class="btn-buy" onclick="initiatePayment(${account.id})">
                                <i class="fas fa-shopping-cart"></i>
                                BUY NOW
                            </button>
                        ` : ''}
                        <button class="btn-view" onclick="viewDetails(${account.id})" style="${account.status === 'sold' ? 'grid-column: 1 / -1;' : ''}">
                            <i class="fas fa-eye"></i>
                            VIEW DETAILS
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Start the countdown timer
        if (filteredAccounts.some(acc => acc.flashDeal?.active)) {
            setInterval(updateAccountTimers, 1000);
        }
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            updateAccounts();
        });
    });

    // Initial render
    updateAccounts();

    // Hide/show banner based on active tab
    const trustBanner = document.querySelector('.trust-banner');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            if (tabName === 'search' || tabName === 'profile') {
                trustBanner.style.display = 'none';
            } else {
                trustBanner.style.display = 'block';
            }
        });
    });

    updateProfile();

    // Performance Optimizations
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Handle scroll events
        }, 100);
    });

    // Use IntersectionObserver for lazy loading
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                lazyLoadObserver.unobserve(entry.target);
            }
        });
    });

    // Apply to account cards
    document.querySelectorAll('.account-card').forEach(card => {
        lazyLoadObserver.observe(card);
    });

    // Smooth tab switching
    function switchTab(tabName) {
        const currentTab = document.querySelector('.tab-content.active');
        const newTab = document.getElementById(`${tabName}-tab`);
        
        if (currentTab) {
            currentTab.style.opacity = '0';
            setTimeout(() => {
                currentTab.style.display = 'none';
                currentTab.classList.remove('active');
                showNewTab(newTab);
            }, 300);
        } else {
            showNewTab(newTab);
        }
    }

    function showNewTab(tab) {
        tab.style.display = 'block';
        tab.style.opacity = '0';
        requestAnimationFrame(() => {
            tab.style.opacity = '1';
            tab.classList.add('active');
        });
    }

    // Update the proofs data - remove customer field
    const proofs = [
        {
            id: 1,
            title: "GLACIER M416 ACCOUNT SOLD",
            image: "./assets/proofs/dhrix2.jpg",
            rating: 5,
            comment: "Trusted seller! Got my Glacier M416 account instantly ⭐️"
        }
    ];

    // Update the render function - remove customer span
    function renderProofs() {
        const proofsGrid = document.querySelector('.proofs-grid');
        if (!proofsGrid) return;

        proofsGrid.innerHTML = proofs.map(proof => `
            <div class="proof-card">
                <div class="proof-title">
                    <h3>${proof.title}</h3>
                </div>
                <div class="proof-image" onclick="showFullscreen('${proof.image}')">
                    <img src="${proof.image}" alt="Proof ${proof.id}">
                </div>
                <div class="proof-content">
                    <div class="stars">
                        ${'⭐️'.repeat(proof.rating)}
                    </div>
                    <p class="comment">${proof.comment}</p>
                </div>
            </div>
        `).join('');
    }

    // Call renderProofs in your DOMContentLoaded event
    renderProofs();
});

// Update the payment handling function
function initiatePayment(accountId) {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;

    const paymentModal = document.getElementById('payment-modal');
    paymentModal.innerHTML = `
        <div class="modal-content payment-content">
            <div class="modal-header">
                <h2>Complete Payment</h2>
                <button class="modal-close" onclick="hideModal('payment-modal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="payment-details">
                    <div class="amount-section">
                        <h3>Amount to Pay</h3>
                        <div class="amount">₹${account.price}</div>
                    </div>
                    
                    <div class="payment-methods">
                        <div class="qr-section">
                            <h3>Scan QR Code</h3>
                            <div class="qr-code">
                                <img src="./assets/qrcode/qrcode.png" 
                                    alt="Payment QR Code"
                                    onclick="showFullscreen('./assets/qrcode/qrcode.png')"
                                    style="cursor: zoom-in;">
                            </div>
                        </div>
                        
                        <div class="upi-section">
                            <h3>UPI Details</h3>
                            <div class="upi-details">
                                <div class="upi-id">
                                    <span class="label">UPI ID:</span>
                                    <span class="value">anasog@fam</span>
                                    <button class="copy-btn" onclick="copyToClipboard(this, 'anasog@fam')">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="payment-instructions">
                        <h3>Instructions</h3>
                        <ol>
                            <li>Scan the QR code or use the UPI ID to pay</li>
                            <li>Pay the exact amount: ₹${account.price}</li>
                            <li>Take a screenshot of your payment</li>
                            <li>Click "Confirm Payment" below</li>
                            <li>Send the screenshot in the chat that opens</li>
                        </ol>
                    </div>

                    <div class="action-buttons">
                        <button class="btn-confirm" onclick="confirmPayment(${account.id}, '${account.title}', ${account.price})">
                            <i class="fas fa-check"></i>
                            Confirm Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    showModal('payment-modal');
}

// Add helper function to copy UPI ID
function copyToClipboard(button, text) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = button.querySelector('i');
        icon.className = 'fas fa-check';
        button.classList.add('copied');
        setTimeout(() => {
            icon.className = 'fas fa-copy';
            button.classList.remove('copied');
        }, 2000);
    });
}

// Update confirmation function
function confirmPayment(accountId, title, price) {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;

    const message = `✨ NEW ORDER REQUEST ✨

🎮 Account Details: ${title}
💰 Price: ₹${price}

💫 Thank you for choosing OG BGMI Store!
📸 Please send your payment screenshot below.`;
    
    // Close payment modal
    hideModal('payment-modal');
    
    // Open chat with pre-filled message
    if (window.Telegram?.WebApp) {
        const encodedMessage = encodeURIComponent(message);
        window.Telegram.WebApp.openLink(`https://t.me/Ehean4s?text=${encodedMessage}`);
    }
}

// Add helper function to navigate to profile
function goToProfile() {
    hideModal('payment-modal');
    document.querySelector('[data-tab="profile"]').click();
}

// Update viewDetails function
function viewDetails(accountId) {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    const modal = document.getElementById('details-modal');
    
    // Update modal content
    const modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Account Details</h2>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="account-images">
                    <div class="account-carousel">
                        ${account.images.map(img => `
                            <div class="carousel-item">
                                <img src="${img}" alt="${account.title}" onclick="showFullscreen('${img}')">
                            </div>
                        `).join('')}
                    </div>
                    <div class="carousel-nav">
                        ${account.images.map((_, i) => `
                            <span class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
                        `).join('')}
                    </div>
                </div>
                <div class="details-grid">
                    ${Object.entries(account.details).map(([label, value]) => `
                        <div class="detail-item">
                            <div class="detail-content">
                                <div class="detail-label">${label}</div>
                                <div class="detail-value">${value}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="description">
                    <h3>Description</h3>
                    <p>${account.description}</p>
                </div>
                ${account.status === 'available' ? `
                    <div class="action-buttons">
                        <button class="btn-buy" onclick="initiatePayment(${account.id})">
                            <i class="fas fa-shopping-cart"></i>
                            BUY NOW
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    modal.innerHTML = modalContent;
    
    // Add close button event handler
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', () => hideModal('details-modal'));
    
    showModal('details-modal');

    // Initialize swipeable carousel
    const carousel = modal.querySelector('.account-carousel');
    const dots = modal.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    let startX;
    let currentX;

    // Touch events for mobile
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentX = carousel.style.transform ? 
            parseInt(carousel.style.transform.replace('translateX(', '')) : 0;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const diff = e.touches[0].clientX - startX;
        const newX = currentX + diff;
        carousel.style.transform = `translateX(${newX}px)`;
    });

    carousel.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        const threshold = carousel.offsetWidth / 4;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentSlide > 0) {
                currentSlide--;
            } else if (diff < 0 && currentSlide < account.images.length - 1) {
                currentSlide++;
            }
        }
        
        updateSlide();
        startX = null;
    });

    // Click events for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlide();
        });
    });

    function updateSlide() {
        const offset = -currentSlide * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Initialize first slide
    updateSlide();
}

// Add this new function
function showFullscreen(imageSrc) {
    const fullscreenModal = document.getElementById('fullscreen-modal');
    const fullscreenImage = document.getElementById('fullscreen-image');
    
    fullscreenImage.src = imageSrc;
    showModal('fullscreen-modal');

    // Close on clicking the close button
    const closeBtn = fullscreenModal.querySelector('.modal-close');
    closeBtn.onclick = () => hideModal('fullscreen-modal');

    // Close on clicking outside the image
    fullscreenModal.onclick = (e) => {
        if (e.target === fullscreenModal) {
            hideModal('fullscreen-modal');
        }
    };
}

// Update Achievement Slider
function initAchievementSlider() {
    const track = document.querySelector('.achievement-track');
    const slides = document.querySelectorAll('.achievement-slide');
    let currentSlide = 0;
    let autoSlide;

    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    // Initialize first slide
    slides[0].classList.add('active');
    
    // Auto-slide
    autoSlide = setInterval(nextSlide, 4000);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 4000);
    });
}

// Simplified Telegram integration
window.Telegram.WebApp.ready();

// Get user data from Telegram
const user = window.Telegram.WebApp.initDataUnsafe?.user;

// Update profile with Telegram data
function updateProfile() {
    if (user) {
        document.getElementById('telegram-username').textContent = user.username ? '@' + user.username : 'User';
    }
}

// Add toggle password function
function togglePassword(button, password) {
    const passwordField = button.parentElement.querySelector('.password-field');
    const icon = button.querySelector('i');
    
    if (passwordField.textContent === '••••••••') {
        passwordField.textContent = password;
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordField.textContent = '••••••••';
        icon.className = 'fas fa-eye';
    }
}

// Update showInboxModal function
function showInboxModal() {
    const existingModal = document.getElementById('inbox-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'inbox-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content inbox-content">
            <div class="modal-header">
                <h2>My Inbox</h2>
                <button class="modal-close" onclick="hideModal('inbox-modal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="inbox-messages" id="inbox-messages">
                    <!-- Messages will be inserted here -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    showModal('inbox-modal');
    
    // Re-populate inbox messages
    testInbox();
}

// Update the addCredentialToInbox function to include personalized message
function addCredentialToInbox(credential) {
    const inboxMessages = document.getElementById('inbox-messages');
    
    credential.logins.forEach(login => {
        const messageElement = document.createElement('div');
        messageElement.className = 'inbox-message unread';
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-title">
                    <i class="fab ${getLoginIcon(login.type)}"></i>
                    <span>${login.type === 'x' ? 'X (Twitter)' : login.type} Login</span>
                </div>
                <div class="message-time">${credential.date}</div>
            </div>
            <div class="message-content">
                <div class="welcome-note">
                    <p>Dear Customer,</p>
                    <p>Thank you for purchasing from OG BGMI Store. Here are your account credentials for ${login.type} login:</p>
                </div>
                <div class="credential-box">
                    <div class="credential-item">
                        <span class="label">ID:</span>
                        <span class="value">${login.loginId}</span>
                        <button class="copy-btn" onclick="copyToClipboard(this, '${login.loginId}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="credential-item">
                        <span class="label">Pass:</span>
                        <span class="value password-field">••••••••</span>
                        <button class="toggle-btn" onclick="togglePassword(this, '${login.password}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="copy-btn" onclick="copyToClipboard(this, '${login.password}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                <div class="important-notes">
                    <div class="note-header">
                        <i class="fas fa-info-circle"></i>
                        <span>Important Notes:</span>
                    </div>
                    <ul>
                        <li>Please change the password after your first login</li>
                        <li>Do not share these credentials with anyone</li>
                        <li>For any issues, contact our support immediately</li>
                    </ul>
                </div>
            </div>
        `;

        if (inboxMessages) {
            inboxMessages.insertBefore(messageElement, inboxMessages.firstChild);
        }
    });
}

// Navigation helper
function goToHome() {
    document.querySelector('[data-tab="home"]').click();
}

// Simplify Support function to direct chat
function contactSupport() {
    if (window.Telegram?.WebApp) {
        const message = "Hi! I need help with my BGMI account purchase.";
        const encodedMessage = encodeURIComponent(message);
        window.Telegram.WebApp.openLink(`https://t.me/Ehean4s?text=${encodedMessage}`);
    }
}

// FAQ function
function showFAQ() {
    // Implement FAQ modal or navigation
}

// Share profile function
function shareProfile() {
    if (user?.username) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=Check%20out%20my%20profile%20on%20BGMI%20Store!&text=@${user.username}`);
    }
}

// Update credential handling functions
function showCredentialDetails(credential) {
    const modal = document.createElement('div');
    modal.className = 'credential-modal';
    modal.innerHTML = `
        <div class="credential-content">
            <div class="credential-header">
                <h3>${credential.title}</h3>
                <span class="credential-time">${credential.date}</span>
            </div>
            <div class="credential-details">
                <div class="detail-row">
                    <span class="label">Login ID:</span>
                    <span class="value">${credential.loginId}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Password:</span>
                    <span class="value">••••••••</span>
                    <button class="show-hide-btn" onclick="togglePassword(this, '${credential.password}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Example usage:
/*
addCredentialToInbox({
    title: 'Premium BGMI Account',
    date: 'Just now',
    loginId: 'example@gmail.com',
    password: 'securepass123'
});
*/

// Update test credentials
function testInbox() {
    const dummyCredentials = [
        {
            date: 'Just now',
            logins: [
                {
                    type: 'Facebook',
                    loginId: 'premium.bgmi@gmail.com',
                    password: 'FB123#premium'
                },
                {
                    type: 'X',
                    loginId: 'premium.bgmi@gmail.com',
                    password: 'X456#premium'
                }
            ]
        },
        {
            date: '2 hours ago',
            logins: [
                {
                    type: 'Google Play',
                    loginId: 'elite.bgmi@gmail.com',
                    password: 'GP789#elite'
                }
            ]
        }
    ];

    dummyCredentials.forEach(credential => {
        addCredentialToInbox(credential);
    });

    // Update badge count with total number of logins
    const totalLogins = dummyCredentials.reduce((sum, cred) => sum + cred.logins.length, 0);
    const messageBadge = document.querySelector('.message-badge');
    if (messageBadge) {
        messageBadge.textContent = totalLogins;
        messageBadge.classList.add('active');
    }
}

// Call testInbox() to populate the inbox
testInbox();

// Update helper function for login type icon
function getLoginIcon(loginType) {
    switch(loginType.toLowerCase()) {
        case 'facebook': return 'fa-facebook';
        case 'x': return 'fa-x-twitter'; // Updated from Twitter to X
        case 'google play': return 'fa-google-play';
        default: return 'fa-user';
    }
}

// Account Management System
const ACCOUNTS_DATA = {
    available: [
        {
            id: 1,
            title: 'Premium BGMI Account',
            price: 2999,
            images: [
                'assets/accounts/acc1-main.jpg',    // Main display image
                'assets/accounts/acc1-inventory.jpg',// Inventory screenshot
                'assets/accounts/acc1-outfits.jpg', // Outfits collection
                'assets/accounts/acc1-weapons.jpg'  // Weapon skins
            ],
            status: 'available',
            level: 75,
            royalPass: true,
            loginPlatforms: ['Facebook', 'X'],
            details: {
                'Account Level': '75',
                'Royal Pass': 'Purchased',
                'Mythic Outfits': '8',
                'Gun Skins': '15+',
                'Achievement Points': '3500+',
                'Login Methods': '2 (Facebook + X)'
            },
            description: 'Premium BGMI account with rare collectibles.'
        }
    ],
    sold: []
};

// Function to add new account
function addAccount(accountData) {
    const newId = ACCOUNTS_DATA.available.length + ACCOUNTS_DATA.sold.length + 1;
    const newAccount = {
        id: newId,
        ...accountData,
        status: 'available'
    };
    
    ACCOUNTS_DATA.available.push(newAccount);
    renderAccounts(getAllAccounts());
}

// Function to mark account as sold
function markAsSold(accountId) {
    const accountIndex = ACCOUNTS_DATA.available.findIndex(acc => acc.id === accountId);
    if (accountIndex !== -1) {
        const account = ACCOUNTS_DATA.available[accountIndex];
        account.status = 'sold';
        ACCOUNTS_DATA.sold.push(account);
        ACCOUNTS_DATA.available.splice(accountIndex, 1);
        renderAccounts(getAllAccounts());
    }
}

// Get all accounts
function getAllAccounts() {
    return [...ACCOUNTS_DATA.available, ...ACCOUNTS_DATA.sold];
}

// Example: Adding a new account
addAccount({
    title: 'Elite BGMI Account',
    price: 3999,
    images: [
        'linear-gradient(45deg, #7F00FF, #E100FF)',
        'linear-gradient(45deg, #E100FF, #7F00FF)',
        'linear-gradient(45deg, #B721FF, #7F00FF)'
    ],
    level: 82,
    royalPass: true,
    loginPlatforms: ['X'],
    details: {
        'Account Level': '82',
        'Royal Pass': 'Purchased',
        'Mythic Outfits': '12',
        'Gun Skins': '20+',
        'Achievement Points': '4200+',
        'Login Methods': '1 (X)'
    },
    description: 'Elite BGMI account with rare items.'
});

// Example: Marking an account as sold
markAsSold(1); // Pass the account ID

// Add this function to format the remaining time
function formatTimeRemaining(endTime) {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
}

// Update the render function to include dynamic countdown
function updateAccountTimers() {
    const timerElements = document.querySelectorAll('.flash-deal-timer');
    timerElements.forEach(timer => {
        const endTime = parseInt(timer.dataset.endTime);
        timer.textContent = formatTimeRemaining(endTime);
        
        // Disable flash deal if time is up
        if (endTime <= Date.now()) {
            const accountId = parseInt(timer.dataset.accountId);
            const account = accounts.find(acc => acc.id === accountId);
            if (account && account.flashDeal) {
                account.flashDeal.active = false;
                updateAccounts(); // Re-render accounts
            }
        }
    });
}

// Update the account rendering to calculate endTime
function calculateEndTime(hours) {
    return Date.now() + (hours * 60 * 60 * 1000);
}
