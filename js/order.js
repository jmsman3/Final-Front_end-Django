const displayOrderHistory = async () => {
    const tbody = document.querySelector('#order-history tbody');
    if (!tbody) {
        console.error('Tbody element not found.');
        return;
    }

    tbody.innerHTML = '';

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
        // Fetch orders first
        const response = await fetch('https://foodproject-backened-django.vercel.app/order/order_now/', {
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
        console.log('Fetched orders:', orders);  // Check the structure of the orders data

        // Fetch products to map against the order items
        const productsResponse = await fetch('https://foodproject-backened-django.vercel.app/menu/products/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!productsResponse.ok) {
            throw new Error('Network response was not ok while fetching products');
        }

        const productsData = await productsResponse.json();  // Store fetched products

        // Assuming orders is an array and you want to process them
        orders.forEach(order => {
            const product = productsData.data.find(product => product.id === order.product); // Change order.product_id to order.product based on your API structure
            if (product) {
                const row = document.createElement('tr');
                const imageUrl = product.image || 'default-image.jpg'; // Fallback image
                row.innerHTML = `
                    <td>
                        <img src="${imageUrl}" alt="${product.product_name}" style="width: 50px; height: auto;">
                        ${product.product_name}
                    </td>
                    <td>$${parseFloat(product.price).toFixed(2)}</td>
                    <td>${order.quantity}</td>
                    <td>$${(parseFloat(product.price) * order.quantity).toFixed(2)}</td>
                    <td>${order.delivery_status}</td> <!-- Make sure this exists on the order object -->
                `;
                tbody.appendChild(row);
            } else {
                console.warn(`Product not found for order ID: ${order.product}`);
            }
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
    displayOrderHistory();
});
