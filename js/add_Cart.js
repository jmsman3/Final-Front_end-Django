


const handle_AddToCart = (name, price, stock, category_name, cart_id, event) => {
    event.preventDefault();
    const parent = document.getElementById("cart-table-body");
    console.log("Adding to cart:", name, price, stock, category_name ,cart_id); 

    const row = document.createElement('tr');
    
    console.log("Name:", name);
    console.log("Price:", price);
    console.log("Stock:", stock);
    console.log("Category Name:", category_name);
    console.log("Cart id:", cart_id);

    row.innerHTML = `
        <td>${name}</td>
        <td>${price}</td>
        <td>${stock}</td>
        <td>${category_name}</td>
        <td>
            <a href="#" class="btn btn-primary">Order Now</a>
        </td>
    `;
    
    console.log("Generated Row:", row.innerHTML);
    
    parent.appendChild(row);
    console.log("Row appended to table body");
};

homePageCart();