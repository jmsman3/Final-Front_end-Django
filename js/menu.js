document.addEventListener('DOMContentLoaded', () => {
    // Attach click event listeners to category buttons
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-category');
            loadFoodItemsByCategory(categoryId);
        });
    });
});

function loadFoodItemsByCategory(categoryId) {
    console.log('Category ID:', categoryId);

    fetch(`https://foodproject-backened-django.vercel.app/menu/products/?category_id=${categoryId}`)
        .then(response => {
            console.log('Response Status:', response.status); // Check the status code
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            const foodItemsContainer = document.getElementById('home_Cart_Show');
            foodItemsContainer.innerHTML = ''; // Clear existing items

            // Check if data has a 'data' property
            if (data.data && data.data.length > 0) {
                // Loop through the fetched items and create HTML for each
                data.data.forEach(item => {
                    const foodItemDiv = document.createElement('div');
                    foodItemDiv.classList.add("card", "m-3");  // Add margin to create space between cards
                    foodItemDiv.style.width = '18rem'; // Adjust card width to match

                    const imageUrl = `https://foodproject-backened-django.vercel.app${item.image}`;
                    // Construct the content (image, title, price, description)
                    foodItemDiv.innerHTML = `
                    
                        <img src="${imageUrl}" class="card-img-top" alt="${item.product_name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.product_name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Category: ${item.category.category_name}</h6>
                            <p class="card-text">Description: ${item.description}</p>
                            <p class="card-text"><strong>Price:</strong> $${item.price}</p>
                            <p class="card-text"><strong>Stock:</strong> ${item.stock}</p>
                            <a href="#" class="btn btn-primary"  onclick="placeOrder('${item.id}', event)"  >Order Now</a>

                            <a href="home.html" class="btn btn-primary" onclick="handle_AddToCart('${item.id}', '${item.product_name}', '${item.price}', '${item.stock}', '${item.category.category_name}', '${imageUrl}', event)">Add to Cart</a>

                        </div>
                    `;

                    // Append the new food item to the container
                    foodItemsContainer.appendChild(foodItemDiv);
                });
            } else {
                foodItemsContainer.innerHTML = '<p>No items found for this category.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching food items:', error);
        });
}

