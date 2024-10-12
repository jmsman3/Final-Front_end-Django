// const displayOrderHistory = async () => {
//     const tbody = document.querySelector('#order-history tbody');
//     if (!tbody) {
//         console.error('Tbody element not found.');
//         return;
//     }

//     tbody.innerHTML = '';

//     // Check for the authentication token
//     const token = localStorage.getItem('token');
//     if (!token) {
//         // Display a message if the user is not logged in
//         const errorRow = document.createElement('tr');
//         errorRow.innerHTML = `
//             <td colspan="5" class="text-danger text-center">Please log in to see your order history.</td>
//         `;
//         tbody.appendChild(errorRow);
//         return; // Exit the function
//     }

//     try {
//         const response = await fetch('https://foodproject-backened-django.vercel.app/order/order_now', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Token ${token}` // Include token if authentication is needed
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const orders = await response.json();

//         orders.forEach(order => {
//             console.log(order);
//             const row = document.createElement('tr');
//             const imageUrl = `https://foodproject-backened-django.vercel.app${order.product.image}`;
//             row.innerHTML = `
//                 <td>
//                     <img src="${imageUrl || 'default-image.jpg'}" alt="${order.product.product_name}" style="width: 50px; height: auto;">
//                     ${order.product.product_name}
//                 </td>
//                 <td>$${order.price.toFixed(2)}</td>
//                 <td>${order.quantity}</td>
//                 <td>$${(order.price * order.quantity).toFixed(2)}</td>
//                 <td>${order.order.delivery_status}</td>
//             `;
//             tbody.appendChild(row);
//         });

//     } catch (error) {
//         console.error('Error fetching order data:', error);
//         const errorRow = document.createElement('tr');
//         errorRow.innerHTML = `
//             <td colspan="5" class="text-danger text-center">Failed to load order history.</td>
//         `;
//         tbody.appendChild(errorRow);
//     }
// };

// // Ensure the function is called after DOM is fully loaded
// document.addEventListener('DOMContentLoaded', () => {
//     displayOrderHistory();
// });


const displayOrderHistory = async () => {
    const tbody = document.querySelector('#order-history tbody');
    if (!tbody) {
        console.error('Tbody element not found.');
        return;
    }

    tbody.innerHTML = '';

    // Check for the authentication token
    const token = localStorage.getItem('token');
    if (!token) {
        // Display a message if the user is not logged in
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `
            <td colspan="5" class="text-danger text-center">Please log in to see your order history.</td>
        `;
        tbody.appendChild(errorRow);
        return; // Exit the function
    }

    try {
        const response = await fetch('https://foodproject-backened-django.vercel.app/order/order_now', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}` // Include token if authentication is needed
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const orders = await response.json();
        
        // Assuming orders returned from API includes cartId that maps to the products
        orders.forEach(order => {
            // Find the product based on the cartId or id in the order
            const product = data.data.find(product => product.id === order.product_id); // Assuming order has product_id

            if (product) {
                const row = document.createElement('tr');
                const imageUrl = product.image; // Get image from product
                row.innerHTML = `
                    <td>
                        <img src="${imageUrl || 'default-image.jpg'}" alt="${product.product_name}" style="width: 50px; height: auto;">
                        ${product.product_name}
                    </td>
                    <td>$${parseFloat(product.price).toFixed(2)}</td>  <!-- Display price correctly -->
                    <td>${order.quantity}</td>
                    <td>$${(parseFloat(product.price) * order.quantity).toFixed(2)}</td>
                    <td>${order.order.delivery_status}</td>
                `;
                tbody.appendChild(row);
            } else {
                console.warn(`Product not found for order ID: ${order.product_id}`);
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
