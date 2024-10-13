// const displayOrderHistory = async () => {
//     const tbody = document.querySelector('#order-history tbody');
//     if (!tbody) {
//         console.error('Tbody element not found.');
//         return;
//     }

//     tbody.innerHTML = '';

//     const token = localStorage.getItem('token');
//     if (!token) {
//         const errorRow = document.createElement('tr');
//         errorRow.innerHTML = `
//             <td colspan="5" class="text-danger text-center">Please log in to see your order history.</td>
//         `;
//         tbody.appendChild(errorRow);
//         return; 
//     }

//     try {
//         const response = await fetch('https://foodproject-backened-django.vercel.app/menu/products/', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Token ${token}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const orders = await response.json();
//         console.log('Fetched orders:', orders);  // Check the structure of the orders data
        
//         // Assuming orders is an array and you want to process them
//         orders.forEach(order => {
//             const product = data.data.find(product => product.id === order.product_id);
//             if (product) {
//                 const row = document.createElement('tr');
//                 const imageUrl = product.image || 'default-image.jpg'; // Fallback image
//                 row.innerHTML = `
//                     <td>
//                         <img src="${imageUrl}" alt="${product.product_name}" style="width: 50px; height: auto;">
//                         ${product.product_name}
//                     </td>
//                     <td>$${parseFloat(product.price).toFixed(2)}</td>
//                     <td>${order.quantity}</td>
//                     <td>$${(parseFloat(product.price) * order.quantity).toFixed(2)}</td>
//                     <td>${order.delivery_status}</td> <!-- Make sure this exists on the order object -->
//                 `;
//                 tbody.appendChild(row);
//             } else {
//                 console.warn(`Product not found for order ID: ${order.product_id}`);
//             }
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
        const response = await fetch('https://foodproject-backened-django.vercel.app/menu/products/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const productData = await response.json();
        console.log('Fetched products:', productData);  
        
        const orderHistory = [
            { product_id: 1, quantity: 2, delivery_status: 'Delivered' },
            { product_id: 2, quantity: 1, delivery_status: 'Pending' },
           
        ];
        
        orderHistory.forEach(order => {
            const product = productData.data.find(product => product.id === order.product_id);
            if (product) {
                const row = document.createElement('tr');
                const imageUrl = product.image || 'default-image.jpg'; 
                row.innerHTML = `
                    <td>
                        <img src="${imageUrl}" alt="${product.product_name}" style="width: 50px; height: auto;">
                        ${product.product_name}
                    </td>
                    <td>$${parseFloat(product.price).toFixed(2)}</td>
                    <td>${order.quantity}</td>
                    <td>$${(parseFloat(product.price) * order.quantity).toFixed(2)}</td>
                    <td>${order.delivery_status}</td> <!-- Ensure this exists on the order object -->
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



























