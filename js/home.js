// Token ta check kori
const isAuthenticated = () => {
    return !!localStorage.getItem('token'); 
};


// const placeOrder = (cartId, event) => {
//     console.log('Sending request with cartId:', cartId);
// console.log('Token:', localStorage.getItem('token'));

//     event.preventDefault();

//     if (!isAuthenticated()) {
//         alert('Please log in to place an order.');
//         window.location.href = 'login.html';
//         return;
//     }

//     fetch(`https://foodproject-backened-django.vercel.app/order/order_now`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ cart_id: cartId })
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Failed to place order');
//         }
//     })
//     .then(data => {
//         console.log('Order placed successfully:', data);
//         window.location.href = 'order.html';  // Redirect korlam history page
//     })
//     .catch(error => {
//         console.error('Error placing order:', error);
//     });
// };

// const placeOrder = (cartId, event) => {
//     event.preventDefault();

//     if (!isAuthenticated()) {
//         alert('Please log in to place an order.');
//         window.location.href = 'login.html';
//         return;
//     }

//     console.log('Placing order with cartId:', cartId);
//     console.log('Token:', localStorage.getItem('token'));

//     fetch('https://foodproject-backened-django.vercel.app/order/order_now', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Token ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ product : cartId })
//     })
//     .then(response => {
//         console.log('Response status:', response.status);
//         return response.json().then(data => ({ response, data }));
//     })
//     .then(({ response, data }) => {
//         if (response.ok) {
//             console.log('Order placed successfully:', data);
//             window.location.href = 'order.html';
//         } else {
//             console.error('Response data:', data);
//             throw new Error('Failed to place order');
//         }
//     })
//     .catch(error => {
//         console.error('Error placing order:', error);
//     });
// };


const updateOrderItem = (itemId, quantity) => {
    fetch(`https://foodproject-backened-django.vercel.app/order/order_now`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id: itemId, quantity: quantity })  // Include updated quantity
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update order item');
        }
        return response.json();
    })
    .then(data => {
        console.log('Order item updated successfully:', data);
        alert("Order item updated successfully");
        // Optionally, refresh or update the displayed order items
    })
    .catch(error => {
        console.error('Error updating order item:', error);
        alert("There was an issue updating the order item. Please try again.");
    });
};

// Attach event listener for updating order item quantity
document.addEventListener('DOMContentLoaded', () => {
    const updateButtons = document.querySelectorAll('.update-order-item-btn');
    updateButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = button.getAttribute('data-item-id');
            const newQuantity = prompt('Enter new quantity:', '1');
            if (newQuantity) {
                updateOrderItem(itemId, newQuantity);
            }
        });
    });
});

const placeOrder = async (cartId, event) => {
    event.preventDefault();

    if (!isAuthenticated()) {
        alert('Please log in to place an order.');
        window.location.href = 'login.html';
        return;
    }

    const quantity = 1; // Default quantity, or retrieve from user input if needed

    console.log('Placing order with cartId:', cartId);
    console.log('Token:', localStorage.getItem('token'));
    console.log({ product: cartId, quantity: quantity });

    try {
        const body = { product: cartId, quantity: quantity }; // Create the body object first
        console.log(body); // Log the body before sending it

        const response = await fetch('https://foodproject-backend-django.vercel.app/order/order_now', { // Fixed typo here
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body) // Convert the body to JSON string
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to place order');
        }

        const data = await response.json();
        console.log('Order placed successfully:', data);
        alert("Order placed successfully");

        // Redirect the user to the order page after successful order placement
        window.location.href = `order.html?cart_id=${cartId}`; // Pass cart ID to order page
    } catch (error) {
        console.error('Error placing order:', error);
        alert("There was an issue placing the order. Please try again.");
    }
};

const homePageCart = () => {
    console.log('Fetching products...');
    fetch("https://foodproject-backened-django.vercel.app/menu/products/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            console.log("Fetched product data:", data);
            homePage_cart_Detail(data);
        })
        .catch((error) => {
            console.log("Error fetching data:", error);
        });
};

const homePage_cart_Detail = async (data) => {
    const parent = document.getElementById("home_Cart_Show");
    parent.innerHTML = '';

    let savedCartIds = JSON.parse(localStorage.getItem("SavedCartIds")) || [];
    console.log("Saved Cart IDs:", savedCartIds);

    for (const cart of data.data) {
        const cart_id = cart.id;
        console.log(`Processing cart item with ID: ${cart_id}`);

        if (!savedCartIds.includes(cart_id)) {
            savedCartIds.push(cart_id);
            localStorage.setItem("SavedCartIds", JSON.stringify(savedCartIds));
            console.log(`Added item ID ${cart_id} to saved cart IDs`);
        }

        const div = document.createElement("div");
        div.classList.add("card", "mb-4");
        div.style.width = '18rem';

        const imageUrl = cart.image;
        console.log(`Image URL for ${cart.product_name}: ${imageUrl}`);

        div.innerHTML = `
            <img src="${imageUrl}" class="card-img-top" alt="${cart.product_name}">
            <div class="card-body">
                <h5 class="card-title">Food name: ${cart.product_name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Category: ${cart.category.category_name}</h6>
                <p class="card-text">Description: ${cart.description.slice(0, 30)}...</p>
                <p class="card-text"><strong>Price:</strong> $${cart.price}</p>
                <p class="card-text"><strong>Stock:</strong> ${cart.stock}</p>
                <p class="card-text"><strong>Discount:</strong> Available</p>
                <button class="btn btn-primary order-now-btn" data-cart-id="${cart.id}">Order Now</button>
                <button class="btn btn-primary" onclick="handle_AddToCart('${cart.id}', '${cart.product_name}', '${cart.price}', '${cart.stock}', '${cart.category.category_name}', '${imageUrl}', event)">Add to Cart</button>
            </div>
        `;

        parent.appendChild(div);
        console.log(`Rendered card for: ${cart.product_name}`);
    }

    // Add event listeners to all order buttons
    const orderButtons = document.querySelectorAll('.order-now-btn');
    orderButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const cartId = button.getAttribute('data-cart-id');
            console.log("Order for Cart id", cartId);
            placeOrder(cartId, event);
        });
    });

    // Authentication display management
    manageAuthenticationDisplay();
};

// Call the homePageCart function to fetch products on page load
document.addEventListener("DOMContentLoaded", homePageCart);


// Function to manage authentication display logic
const manageAuthenticationDisplay = () => {
    if (isAuthenticated()) {
        document.querySelector('main.container.mt-4').style.display = 'block';
        document.getElementById('display-profile-button').style.display = 'block';
        console.log("User is authenticated, displaying main container and profile button");
    } else {
        document.querySelector('main.container.mt-4').style.display = 'none';
        document.getElementById('display-profile-button').style.display = 'none';
        console.log("User is not authenticated, hiding main container and profile button");
    }
};



const handle_AddToCart = (id, name, price, stock, category_name, image, event) => {
    event.preventDefault();

    if (!isAuthenticated()) {
        alert('Please log in to add items to the cart.');
        return;
    }
 
    const parent = document.getElementById("cart-table-body");
    console.log("Adding to cart:", name, price, stock, category_name, id); 

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${name}</td>
    <td><img src="${image}" alt="${name}" style="width: 50px; height: 50px;"></td>
        <td class="each_price">${price}</td>
        <td>${stock}</td>
        <td>${category_name}</td>
        <td>
             <a href="#" class="btn btn-primary" onclick="placeOrder('${id}', event)">Order Now</a>
            <a href="#" class="btn btn-danger" onclick="handle_RemoveFromCart(event)">Remove from Cart</a>
        </td>
    `;
    
    parent.appendChild(row);
    console.log(parent);
    
    UpdateTotal();
    
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.push({ id, name, price, stock, category_name, image });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    console.log("Row appended to table body");
};


const handle_RemoveFromCart = (event) => {
    event.preventDefault();
    const row = event.target.closest('tr'); // Get the closest table row
    const price = parseFloat(row.querySelector('.each_price').innerText);

    // Remove row from the table
    row.remove();

    UpdateTotal();

    // Update cartItems in localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const name = row.querySelector('td').innerText; 
    cartItems = cartItems.filter(item => item.name !== name);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    console.log("Row removed from table body");
};

const UpdateTotal = () =>{
    const allPrice = document.getElementsByClassName("each_price");
    let count = 0;
    for(const element of allPrice){
        count = count + parseFloat(element.innerText);
    }
    document.getElementById("total").innerText = count;
};

homePageCart();

