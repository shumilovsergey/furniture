// Initialize Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.hide();

let furnitureData = null;
let currentImageIndex = 0;

// Fetch furniture data
fetch('furniture-data.json')
    .then(response => response.json())
    .then(data => {
        furnitureData = data;
        initializeMenu();
        // Add smooth fade-in animation to the app
        document.body.style.opacity = '1';
    })
    .catch(error => {
        console.error('Error loading furniture data:', error);
        document.getElementById('furnitureGrid').innerHTML = '<div class="loading">Error loading furniture data</div>';
    });

// Initialize category menu
function initializeMenu() {
    const categoryMenu = document.getElementById('categoryMenu');
    furnitureData.categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${category.id}')">
                <span>${category.name}</span>
                <span>▼</span>
            </div>
            <div class="category-content" id="${category.id}Content">
                ${category.items.map(item => `
                    <div class="furniture-item" onclick="selectFurniture('${category.id}', '${item.id}')">
                        ${item.name}
                    </div>
                `).join('')}
            </div>
        `;
        categoryMenu.appendChild(categoryItem);
    });
}

// Toggle category expansion
function toggleCategory(categoryId) {
    const content = document.getElementById(`${categoryId}Content`);
    const header = content.previousElementSibling;
    
    // Close all other categories first
    document.querySelectorAll('.category-content').forEach(otherContent => {
        if (otherContent !== content) {
            otherContent.classList.remove('active');
            const otherHeader = otherContent.previousElementSibling;
            otherHeader.classList.remove('active');
            const otherArrow = otherHeader.querySelector('span:last-child');
            otherArrow.style.transform = 'rotate(0)';
        }
    });
    
    // Toggle the clicked category
    content.classList.toggle('active');
    header.classList.toggle('active');
    
    // Rotate arrow with smooth animation
    const arrow = header.querySelector('span:last-child');
    arrow.style.transition = 'transform 0.3s ease';
    arrow.style.transform = content.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
}

// Display selected furniture
function selectFurniture(categoryId, itemId) {
    const category = furnitureData.categories.find(c => c.id === categoryId);
    const item = category.items.find(i => i.id === itemId);
    
    if (item) {
        const furnitureGrid = document.getElementById('furnitureGrid');
        currentImageIndex = 0;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'furniture-card';
        
        // Add fade-in animation
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'translateY(20px)';
        
        itemElement.innerHTML = `
            <div class="image-carousel">
                <div class="carousel-images" id="carouselImages">
                    ${item.images.map((image, index) => `
                        <div class="carousel-image" 
                             style="background-image: url('${image}')"
                             onerror="this.style.backgroundImage=''; this.innerHTML='Error loading image'">
                        </div>
                    `).join('')}
                </div>
                ${item.images.length > 1 ? `
                    <button class="carousel-nav-button prev" onclick="changeImage(${currentImageIndex - 1})">←</button>
                    <button class="carousel-nav-button next" onclick="changeImage(${currentImageIndex + 1})">→</button>
                    <div class="carousel-controls" id="carouselControls">
                        ${item.images.map((_, index) => `
                            <div class="carousel-dot ${index === 0 ? 'active' : ''}" 
                                 onclick="changeImage(${index})"></div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="furniture-details">
                <div class="furniture-name">${item.name}</div>
                <div class="furniture-price">${item.price.toFixed(2)} руб</div>
                <div class="furniture-description">${item.description}</div>
                <button class="order-button" onclick="handleOrder('${item.name}')">Заказать</button>
            </div>
        `;
        
        furnitureGrid.innerHTML = '';
        furnitureGrid.appendChild(itemElement);

        // Trigger fade-in animation
        setTimeout(() => {
            itemElement.style.transition = 'all 0.3s ease';
            itemElement.style.opacity = '1';
            itemElement.style.transform = 'translateY(0)';
        }, 50);

        // Initialize touch events for the carousel
        if (item.images.length > 1) {
            initCarouselSwipe();
        }
    }
}

// Change carousel image
function changeImage(index) {
    const carouselImages = document.getElementById('carouselImages');
    const dots = document.querySelectorAll('.carousel-dot');
    const totalImages = dots.length;

    // Handle circular navigation
    if (index < 0) index = totalImages - 1;
    if (index >= totalImages) index = 0;

    currentImageIndex = index;
    
    // Smooth transition for images
    carouselImages.style.transition = 'transform 0.3s ease';
    carouselImages.style.transform = `translateX(-${index * 100}%)`;
    
    // Update dots with animation
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    // Update navigation buttons
    const prevButton = document.querySelector('.carousel-nav-button.prev');
    const nextButton = document.querySelector('.carousel-nav-button.next');
    if (prevButton && nextButton) {
        prevButton.onclick = () => changeImage(currentImageIndex - 1);
        nextButton.onclick = () => changeImage(currentImageIndex + 1);
    }
}

// Initialize touch swipe functionality
function initCarouselSwipe() {
    const carousel = document.querySelector('.image-carousel');
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diff = startX - currentX;
        const threshold = 50; // minimum distance for swipe

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next image
                changeImage(currentImageIndex + 1);
            } else {
                // Swipe right - previous image
                changeImage(currentImageIndex - 1);
            }
        }
    });
}

// Handle order button click
function handleOrder(furnitureName) {
    // Add animation to order button
    const orderButton = document.querySelector('.order-button');
    orderButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        orderButton.style.transform = 'translateY(-2px)';
    }, 150);

    // Send data back to the bot
    tg.sendData(JSON.stringify({
        furnitureName: furnitureName,
        action: 'order'
    }));
    
    // Close the web app
    tg.close();
} 