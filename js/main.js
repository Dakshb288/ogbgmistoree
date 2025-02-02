// Move these to global scope
let accounts = [];
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    // Force reflow
    modal.offsetHeight;
    modal.classList.add('active');
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Match transition duration
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Telegram WebApp
    try {
        const webapp = window.Telegram.WebApp;
        webapp.ready();
        webapp.expand(); // Expand the web app to full height
        
        // Get user data and log it to see what we're receiving
        const user = webapp.initDataUnsafe?.user;
        console.log('Telegram User Data:', user);
        
        // Update profile with Telegram data
        const usernameElement = document.getElementById('telegram-username');
        if (user && usernameElement) {
            if (user.username) {
                usernameElement.textContent = '@' + user.username;
            } else if (user.first_name) {
                usernameElement.textContent = user.first_name;
            } else {
                usernameElement.textContent = 'User';
            }
        }
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
        });
    });

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }

    // Initialize accounts data
    accounts = [
        {
            id: 1,
            title: 'Premium BGMI Account',
            price: 2999,
            background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
            status: 'available',
            level: 75,
            royalPass: true,
            images: [
                'linear-gradient(45deg, #FF416C, #FF4B2B)',
                'linear-gradient(45deg, #FF4B2B, #FF416C)',
                'linear-gradient(45deg, #FF6B6B, #FF4B2B)'
            ],
            details: {
                'Account Level': '75',
                'Royal Pass': 'Purchased',
                'Mythic Outfits': '8',
                'Gun Skins': '15+',
                'Achievement Points': '3500+',
                'Login Methods': '2 (Facebook + X)'
            },
            description: 'Premium BGMI account with rare collectibles and high-value items. Features multiple legendary outfits and gun skins. Perfect for serious players looking for a well-maintained account with impressive stats.',
            loginType: 'Facebook',
            loginPlatforms: ['Facebook', 'X'],
            loginId: 'premium.bgmi@gmail.com',
            password: 'FB123#premium'
        },
        {
            id: 2,
            title: 'Elite BGMI Account',
            price: 3999,
            background: 'linear-gradient(45deg, #7F00FF, #E100FF)',
            status: 'sold',
            level: 82,
            royalPass: true,
            images: [
                'linear-gradient(45deg, #7F00FF, #E100FF)',
                'linear-gradient(45deg, #E100FF, #7F00FF)',
                'linear-gradient(45deg, #B721FF, #7F00FF)'
            ],
            details: {
                'Account Level': '82',
                'Royal Pass': 'Purchased',
                'Mythic Outfits': '12',
                'Gun Skins': '20+',
                'Achievement Points': '4200+',
                'Login Methods': '1 (X)'
            },
            description: 'Elite BGMI account featuring extensive collection of rare items and high achievement points. Includes multiple season Royal Pass rewards and exclusive gun skins.',
            loginType: 'X',
            loginPlatforms: ['X'],
            loginId: 'elite.bgmi@gmail.com',
            password: 'TW456#elite'
        }
    ];

    // Update the createAccountCard function
    function createAccountCard(account) {
        return `
            <div class="account-card" data-status="${account.status}">
                <div class="account-image" style="background: ${account.background}">
                    <div class="image-overlay"></div>
                    <span class="status ${account.status}">${account.status.toUpperCase()}</span>
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
                            <i class="fas ${account.status === 'sold' ? 'fa-xmark' : 'fa-check-circle'}"></i>
                        </span>
                    </div>
                    <div class="specs-section">
                        <span class="spec-item">
                            <i class="fas fa-gamepad"></i>
                            Level ${account.level}
                        </span>
                        <span class="spec-item">
                            <i class="fab ${getLoginIcon(account.loginType)}"></i>
                            ${account.loginType}
                        </span>
                    </div>
                    <div class="price-section">
                        <p class="price">₹${account.price}</p>
                        <span class="price-tag">Best Value</span>
                    </div>
                    <div class="action-buttons">
                        ${account.status === 'available' ? 
                            `<button class="btn-buy" onclick="initiatePayment(${account.id})">
                                <i class="fas fa-shopping-cart"></i>
                                BUY NOW
                            </button>` : ''
                        }
                        <button class="btn-view" onclick="viewDetails(${account.id})">
                            <i class="fas fa-eye"></i>
                            VIEW DETAILS
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to render accounts
    function renderAccounts(accounts) {
        const accountsGrid = document.querySelector('.accounts-grid');
        accountsGrid.innerHTML = accounts.map(account => createAccountCard(account)).join('');
    }

    // Initialize the app
    renderAccounts(accounts);

    // Achievement Slider
    initAchievementSlider();

    // Search functionality
    const searchInput = document.getElementById('account-search');
    const searchFilters = document.querySelectorAll('.search-filters .filter-btn');
    const searchResults = document.querySelector('.search-results');
    const noResults = document.querySelector('.no-results');
    let currentFilter = 'all';

    // Update search results based on input and filter
    function updateSearchResults() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredAccounts = accounts;

        // Apply status filter
        if (currentFilter !== 'all') {
            filteredAccounts = accounts.filter(account => account.status === currentFilter);
        }

        // Apply search term
        if (searchTerm) {
            filteredAccounts = filteredAccounts.filter(account => {
                return (
                    account.title.toLowerCase().includes(searchTerm) ||
                    account.level.toString().includes(searchTerm) ||
                    account.details['Mythic Outfits'].toLowerCase().includes(searchTerm) ||
                    account.details['Gun Skins'].toLowerCase().includes(searchTerm) ||
                    account.details['Achievement Points'].toLowerCase().includes(searchTerm)
                );
            });
        }

        // Update results with animation
        if (filteredAccounts.length === 0) {
            searchResults.style.display = 'none';
            searchResults.classList.remove('visible');
            noResults.style.display = 'block';
        } else {
            searchResults.style.display = 'grid';
            searchResults.classList.remove('visible');
            searchResults.innerHTML = filteredAccounts.map(account => createAccountCard(account)).join('');
            
            // Force reflow
            searchResults.offsetHeight;
            
            // Add visible class to trigger animation
            searchResults.classList.add('visible');
            noResults.style.display = 'none';
        }
    }

    // Handle search input
    searchInput.addEventListener('input', debounce(updateSearchResults, 300));

    // Handle filter buttons
    searchFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            searchFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            updateSearchResults();
        });
    });

    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

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
                                <img src="assets/images/payment-qr.jpg" alt="Payment QR Code">
                            </div>
                        </div>
                        
                        <div class="upi-section">
                            <h3>UPI Details</h3>
                            <div class="upi-details">
                                <div class="upi-id">
                                    <span class="label">UPI ID:</span>
                                    <span class="value">your@upi</span>
                                    <button class="copy-btn" onclick="copyToClipboard(this, 'your@upi')">
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
                            <li>Take a screenshot of payment confirmation</li>
                            <li>Upload the screenshot below</li>
                        </ol>
                    </div>

                    <div class="screenshot-section">
                        <h3>Upload Payment Screenshot</h3>
                        <label class="screenshot-upload" for="screenshot-input">
                            <input type="file" id="screenshot-input" accept="image/*" style="display: none;" onchange="handleScreenshot(this)">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Click to upload screenshot</p>
                            <p class="file-hint">JPG, PNG files allowed</p>
                        </label>
                        <div class="screenshot-preview">
                            <img id="screenshot-preview-img">
                        </div>
                    </div>

                    <button class="confirm-payment-btn" id="confirm-btn" onclick="confirmPayment(${account.id})" disabled>
                        <i class="fas fa-check-circle"></i>
                        Confirm Payment
                    </button>
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

// Add screenshot handling function
function handleScreenshot(input) {
    const preview = document.querySelector('.screenshot-preview');
    const previewImg = document.getElementById('screenshot-preview-img');
    const confirmBtn = document.getElementById('confirm-btn');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            confirmBtn.classList.add('active');
            confirmBtn.disabled = false;
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Update confirmation function
function confirmPayment(accountId) {
    const screenshot = document.getElementById('screenshot-input').files[0];
    if (!screenshot) {
        alert('Please upload payment screenshot');
        return;
    }

    const userInfo = window.Telegram.WebApp.initDataUnsafe?.user;
    const account = accounts.find(acc => acc.id === accountId);
    
    // First send screenshot with order details
    const formData = new FormData();
    formData.append('chat_id', '6670332208');
    formData.append('photo', screenshot);
    formData.append('caption', `
🛍 New Order Received!

Account: ${account.title}
Price: ₹${account.price}
Level: ${account.level}

Customer:
@${userInfo?.username || 'No username'}
ID: ${userInfo?.id || 'No ID'}
Time: ${new Date().toLocaleString()}
    `);

    // Send screenshot with order details
    fetch('https://api.telegram.org/bot7854142306:AAHOpy2QYrIzlqx34wQpXO6cVl-1EMFfjek/sendPhoto', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to send order');
        // Show confirmation to user
        showConfirmationMessage(document.getElementById('payment-modal'));
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error sending order. Please contact support.');
    });
}

function showConfirmationMessage(modal) {
    modal.querySelector('.payment-content').innerHTML = `
        <div class="modal-header">
            <h2>Thank You!</h2>
            <button class="modal-close" onclick="hideModal('payment-modal')">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="confirmation-message">
                <div class="success-animation">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Order Placed Successfully!</h3>
                <div class="confirmation-details">
                    <p class="main-message">Thanks for purchasing from OG BGMI Store!</p>
                    <div class="status-info">
                        <div class="status-item">
                            <i class="fas fa-clock"></i>
                            <span>Payment Under Review</span>
                        </div>
                        <div class="status-item">
                            <i class="fas fa-telegram"></i>
                            <span>We'll contact you on Telegram</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add helper function to navigate to profile
function goToProfile() {
    hideModal('payment-modal');
    document.querySelector('[data-tab="profile"]').click();
}

// Update viewDetails function to remove duplicates
function viewDetails(accountId) {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    const modal = document.getElementById('details-modal');
    const modalTitle = modal.querySelector('.modal-header h2');
    const carousel = modal.querySelector('.account-carousel');
    const detailsGrid = modal.querySelector('.details-grid');
    const description = modal.querySelector('.description p');
    const buyButton = modal.querySelector('.btn-buy');
    const closeButton = modal.querySelector('.modal-close');

    // Remove any existing login platforms section first
    const existingPlatforms = modal.querySelector('.login-platforms');
    if (existingPlatforms) {
        existingPlatforms.remove();
    }

    // Add close button functionality
    closeButton.onclick = () => hideModal('details-modal');

    // Set title
    modalTitle.textContent = account.title;

    // Update carousel to use backgrounds instead of images
    carousel.innerHTML = account.images.map((gradient, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="carousel-gradient" style="background: ${gradient}"></div>
        </div>
    `).join('');

    // Set details with simplified information
    detailsGrid.innerHTML = Object.entries(account.details).map(([label, value]) => `
        <div class="detail-item">
            <i class="fas ${getIconForLabel(label)}"></i>
            <div>
                <div class="detail-label">${label}</div>
                <div class="detail-value">${value}</div>
            </div>
        </div>
    `).join('');

    // Add single login platforms section
    const loginPlatformsHTML = `
        <div class="login-platforms">
            <h3>Login Platforms</h3>
            <div class="platform-list">
                ${account.loginPlatforms.map(platform => `
                    <div class="platform-item">
                        <i class="fab ${getLoginIcon(platform)}"></i>
                        <span>${platform === 'x' ? 'X (Twitter)' : platform}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    detailsGrid.insertAdjacentHTML('afterend', loginPlatformsHTML);

    // Set description
    description.textContent = account.description;

    // Handle buy button visibility based on account status
    if (account.status === 'sold') {
        buyButton.style.display = 'none';
    } else {
        buyButton.style.display = 'block';
        buyButton.onclick = () => initiatePayment(account.id);
    }

    showModal('details-modal');
}

// Helper function to get appropriate icons for labels
function getIconForLabel(label) {
    const icons = {
        'Account Level': 'fa-gamepad',
        'Royal Pass': 'fa-crown',
        'Mythic Outfits': 'fa-tshirt',
        'Gun Skins': 'fa-crosshairs',
        'Achievement Points': 'fa-trophy'
    };
    return icons[label] || 'fa-info-circle';
}

// Update the carousel dots when scrolling
document.querySelector('.account-carousel').addEventListener('scroll', function() {
    const index = Math.round(this.scrollLeft / this.offsetWidth);
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
});

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

// Support function
function contactSupport() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink('https://t.me/OgbgmiSTOREE_bot');
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
