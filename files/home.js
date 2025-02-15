// home.js

// Change page
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartModal();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadCartFromLocalStorage();
    document.getElementById('mainFooter').style.display = 'block';
    showSection("home");

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const homeLink = document.getElementById("homeLink");
    const homelogoLink = document.getElementById("homelogoLink");
    const instrumentsLink = document.getElementById("instrumentsLink");
    const openCheckoutModalButton = document.getElementById("openCheckoutModal");
    const checkoutButton = document.getElementById("checkoutButton");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", function () {
            performCheckout();
        });
    }

    function hideFooter() {
        document.getElementById('mainFooter').style.display = 'none';
    }

    // Function to show the footer
    function showFooter() {
        document.getElementById('mainFooter').style.display = 'block';
    }

    function performCheckout() {
        // Get the cart items and their details
        const cartItems = cart.map(item => `${item.productName} - $${item.price.toFixed(2)}`).join('%0A');
        const totalPrice = cart.reduce((total, item) => total + item.price, 0).toFixed(2);

        // Create the mailto link with new line characters
        const mailtoLink = `mailto:?subject=Checkout Details&body=Cart Items:%0A${cartItems}%0A%0ATotal Price: $${totalPrice}`;

        // Open the mail client
        window.location.href = mailtoLink;

        // Display a notification or alert
        showAlert("Checkout details pasted to mail!");
    }

    if (homeLink) {
        homeLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("home");
            showFooter();
        });
    }

    if (homelogoLink) {
        homelogoLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("home");
            showFooter();
        });
    }

    if (instrumentsLink) {
        instrumentsLink.addEventListener("click", function (event) {
            event.preventDefault();
            showSection("instruments");
            hideFooter();
        });
    }

    if (openCheckoutModalButton) {
        openCheckoutModalButton.addEventListener("click", function () {
            updateCartModal();
            jQuery('#cartModal').modal('show');
        });
    }
});

function showSection(sectionId) {
    const sections = ["home", "instruments"];

    // Hide all sections
    sections.forEach(function (section) {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = "none";
        }
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = "block";
    }
}


// Cart
let cart = [];

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productName, price, imageUrl, description) {
    cart.push({ productName, price, imageUrl, description });
    updateCartModal();
    showNotification(productName);
    saveCartToLocalStorage();
}

function updateCartModal() {
    const cartItemsContainer = document.getElementById("cartItems");
            const totalPriceContainer = document.getElementById("totalPrice");
            const clearCartButton = document.getElementById("clearCartButton");
            const checkoutButton = document.getElementById("checkoutButton");
            let cartItemsHtml = "";
            let totalPrice = 0;

            cart.forEach(item => {
                cartItemsHtml += `
                <div class="cart-item">
                    <img class="cart-item-image" src="${item.imageUrl}" alt="${item.productName}">
                    <div class="cart-item-details">
                        <span class="product-name">${item.productName}</span>
                        <p class="product-description">${item.description}</p>
                        <span class="product-price">$${item.price.toFixed(2)}</span>
                    </div>
                </div>`;
                totalPrice += item.price;
            });

            cartItemsContainer.innerHTML = cartItemsHtml;
            totalPriceContainer.textContent = `Total: $${totalPrice.toFixed(2)}`;


            clearCartButton.style.display = cart.length > 0 ? "block" : "none";


            checkoutButton.style.display = cart.length > 0 ? "block" : "none";
}

function clearCart() {
   // Clear the cart
            cart = [];

            // Update the cart modal
            updateCartModal();
}

function showNotification(productName) {
    const notificationBar = document.getElementById("notificationBar");
            notificationBar.textContent = `${productName} added to the cart!`;

            // Show notification
            notificationBar.style.display = "block";

            // Hide notification after a indicated seconds
            setTimeout(() => {
                notificationBar.style.display = "none";
            }, 3000);
}

function showAlert(alertText) {
     const notificationBar = document.getElementById("notificationBar");
            notificationBar.textContent = `${alertText}`;

            // Show notification
            notificationBar.style.display = "block";

            // Hide notification after a indicated seconds
            setTimeout(() => {
                notificationBar.style.display = "none";
            }, 7000);
}


// Banner
let isDragging = false;
let startPositionX = 0;
let currentSlide = 0;
const slides = [
			"images/banner1.jpg",
            "images/banner2.jpg",
            "images/banner3.png",
            "images/banner4.png",

];

const interval = 3000;
let autoChangeTimer;

function startAutoChange() {
     autoChangeTimer = setInterval(() => {
                nextSlide();
            }, interval);
}

function stopAutoChange() {
     clearInterval(autoChangeTimer);
}

function showSlide(index) {
            document.getElementById("bannerImage").src = slides[index];
            currentSlide = index;
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        const banner = document.getElementById("banner");
        const image = document.getElementById("bannerImage");

        banner.addEventListener("mousedown", function (event) {

            if (event.target === image || event.target.parentNode === image) {
                isDragging = true;
                startPositionX = event.clientX;
                image.classList.add("grabbing");
                image.style.cursor = "grab";
                stopAutoChange();
            }
        });

        document.addEventListener("mousemove", function (event) {
            if (isDragging) {
                const deltaX = event.clientX - startPositionX;
                if (deltaX > 50) {
                    nextSlide();
                    isDragging = false;
                } else if (deltaX < -50) {
                    prevSlide();
                    isDragging = false;
                }
            }
        });

        document.addEventListener("mouseup", function () {
            if (isDragging) {
                isDragging = false;
                image.classList.remove("grabbing");
                image.style.cursor = "default";
                startAutoChange();
            }
        });

        image.addEventListener("mouseenter", function () {
            if (!isDragging) {
                image.classList.add("grab");
                image.style.cursor = "grab";
                stopAutoChange();
            }
        });

        image.addEventListener("mouseleave", function () {
            if (!isDragging) {
                image.classList.remove("grabbing");
                image.classList.remove("grab");
                image.style.cursor = "default";
                startAutoChange();
            }
        });
