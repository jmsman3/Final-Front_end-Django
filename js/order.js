document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get('cart_id');

    if (cartId) {
        displayOrderHistory(cartId); // Call the function to fetch and display user orders
    } else {
        console.error("Cart ID not found in URL.");
    }
});

const displayOrderHistory = async (cartId) => {
    console.log("Fetching order history...");
    try {
        const response = await fetch('https://foodproject-backened-django.vercel.app/order/order_now', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch order history');
        }

        const data = await response.json();
        console.log("Fetched order data:", data);
        renderOrderItems(data); // Function to render order items
    } catch (error) {
        console.error("Error fetching order history:", error);
        alert("Failed to fetch order history. Please try again.");
    }
};

const renderOrderItems = (orderItems) => {
    const orderContainer = document.getElementById("order-container");
    orderContainer.innerHTML = ''; // Clear existing items

    orderItems.forEach(item => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order-item");
        orderDiv.innerHTML = `
            <h5>${item.product_name}</h5>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price}</p>
            <button class="btn btn-danger delete-order-btn" data-order-item-id="${item.id}">Delete</button>
        `;

        orderContainer.appendChild(orderDiv);
    });

    // Add delete functionality
    const deleteButtons = document.querySelectorAll('.delete-order-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderItemId = button.getAttribute('data-order-item-id');
            console.log("Deleting order item with ID:", orderItemId);
            deleteOrderItem(orderItemId);
        });
    });
};

const deleteOrderItem = async (orderItemId) => {
    try {
        const response = await fetch(`https://foodproject-backened-django.vercel.app/order/order_now`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: orderItemId }) // Pass the order item ID to delete
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete order item');
        }

        const data = await response.json();
        console.log("Order item deleted successfully:", data);
        alert("Order item deleted successfully");
        displayOrderHistory(); // Refresh the order history
    } catch (error) {
        console.error("Error deleting order item:", error);
        alert("Failed to delete order item. Please try again.");
    }
};
