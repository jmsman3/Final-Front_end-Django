// Token check function
const isAuthenticated = () => {
    return !!localStorage.getItem('token'); 
};



// Function to place an order
const placeOrder = (productId, event) => {
    event.preventDefault();  // Prevent default button behavior

    if (!isAuthenticated()) {
        alert('Please log in to place an order.');
        window.location.href = 'login.html';
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Error: Authentication token not found. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    console.log('Placing order with productId:', productId);
    console.log('Token:', token);

    fetch('https://foodproject-backened-django.vercel.app/order/order_now/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
            product: parseInt(productId),  // Ensure the product ID is an integer
            quantity: 1  // Default quantity to 1, you can modify this as needed
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json().then(data => ({ response, data }));
    })
    .then(({ response, data }) => {
        if (response.ok) {
            console.log('Order placed successfully:', data);
            alert('Order placed successfully!');
            window.location.href = 'order.html';  // Redirect to the order page
        } else {
            console.error('Error response data:', data);
            alert(`Failed to place order: ${data.error || 'Please try again.'}`);
        }
    })
    .catch(error => {
        console.error('Error placing order:', error);
        alert('There was an issue placing your order. Please try again.');
    });
};

// Function to load products for the home page
const homePageCart = () => {
    console.log('Fetching products for home page...');
    
    fetch("https://foodproject-backened-django.vercel.app/menu/products/")
        .then(response => response.json())
        .then((data) => {
            console.log('Products fetched:', data);
            homePage_cart_Detail(data);  // Pass the fetched data to the cart details function
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
            alert('Error loading products. Please try again later.');
        });
};

// Function to display the products in the cart
const homePage_cart_Detail = (data) => {
    const parent = document.getElementById("home_Cart_Show");
    parent.innerHTML = '';  // Clear the container before adding new elements

    let savedCartIds = JSON.parse(localStorage.getItem("SavedCartIds")) || [];

    data.data.forEach((cart) => {
        const cart_id = cart.id;
        if (!savedCartIds.includes(cart_id)) {
            savedCartIds.push(cart_id);
            localStorage.setItem("SavedCartIds", JSON.stringify(savedCartIds));
        }

        const div = document.createElement("div");
        div.classList.add("card", "mb-4");
        div.style.width = '18rem';

        const imageUrl = `${cart.image}`;  // Dynamic image URL from API
        console.log(imageUrl);

        div.innerHTML = `
            <img src="${imageUrl}" class="card-img-top" alt="${cart.product_name}">
            <div class="card-body">
                <h5 class="card-title">Food name: ${cart.product_name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Category: ${cart.category.category_name}</h6>
                <p class="card-text">Description: ${cart.description.slice(0, 30)}...</p>
                <p class="card-text"><strong>Price:</strong> ${cart.price}</p>
                <p class="card-text"><strong>Stock:</strong> ${cart.stock}</p>
                <p class="card-text"><strong>Discount:</strong> Available</p>
                <a href="" class="btn btn-primary" onclick="placeOrder('${cart.id}', event)">Order Now</a>
                <a href="#" class="btn btn-secondary" onclick="handle_AddToCart('${cart.id}', '${cart.product_name}', '${cart.price}', '${cart.stock}', '${cart.category.category_name}', '${imageUrl}', event)">Add to Cart</a>
            </div>
        `;
        parent.appendChild(div);
    });

    // Conditionally display the main content based on authentication
    document.querySelector('main.container.mt-4').style.display = isAuthenticated() ? 'block' : 'none';

    // Show or hide the profile button based on authentication
    document.getElementById('display-profile-button').style.display = isAuthenticated() ? 'block' : 'none';
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

