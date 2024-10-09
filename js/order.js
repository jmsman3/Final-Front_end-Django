document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get('cart_id');

    if (cartId) {

        displayOrderHistory(cartId); // Added function call to fetch and display user posts
    } else {
        console.error("Cart ID not found in URL.");
    }
});


const displayOrderHistory = async (cartId) => {
    const tbody = document.querySelector('#order-history tbody');
    if (!tbody) {
        console.error('Tbody element not found.');
        return;
    }

    tbody.innerHTML = '';

    // Check for the authentication token
    const token = localStorage.getItem('token');
    if (!token) {
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `
            <td colspan="5" class="text-danger text-center">Please log in to see your order history.</td>
        `;
        tbody.appendChild(errorRow);
        return; 
    }

    try {
        const response = await fetch(`https://foodproject-backened-django.vercel.app/order/order_now?cart_id=${cartId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}` 
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const orders = await response.json();

        orders.forEach(order => {
            const row = document.createElement('tr');
            const imageUrl = `https://foodproject-backened-django.vercel.app${order.product.image}`;
            row.innerHTML = `
                <td>
                    <img src="${imageUrl || 'default-image.jpg'}" alt="${order.product.product_name}" style="width: 50px; height: auto;">
                    ${order.product.product_name}
                </td>
                <td>$${order.price.toFixed(2)}</td>
                <td>${order.quantity}</td>
                <td>$${(order.price * order.quantity).toFixed(2)}</td>
                <td>${order.order.delivery_status}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching order data:', error);
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `
            <td colspan="5" class="text-danger text-center">Failed to load order history.</td>
        `;
        tbody.appendChild(errorRow);
    }
};

// Ensure the function is called after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get('cart_id');

    if (cartId) {
        displayOrderHistory(cartId); // Call the function with the cart ID
    } else {
        console.error("Cart ID not found in URL.");
    }
});

// Ensure the function is called after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    displayOrderHistory();
});

