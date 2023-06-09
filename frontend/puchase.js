export function makePurchase() {
    const userId = localStorage.getItem('userId');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
        
    const order = {
        user: userId,
        products: cartItems
    };
        
    fetch('http://localhost:3000/api/orders/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(() => {
        const products = Object.values(cartItems);

        fetch('http://localhost:3000/api/products/updateStock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ products })
        })
        .then(() => {
            localStorage.removeItem('cart');
            localStorage.removeItem('cartCount');
            const cartCount = document.querySelector('.cartCount');
            cartCount.innerText = '0';
            const cartPopup = document.querySelector('.cartPopup');
            cartPopup.remove();
            const overlay = document.querySelector('.overlay');
            overlay.classList.remove('overlay');
            purchaseConfirmation();
        })
        .catch(err => {
            console.error(err);
        });
    })
    .catch(err => {
        console.error(err);
    });
}

export function purchaseConfirmation() {
    const loggedIn = localStorage.getItem('loggedIn');
    const confirmationPopup = document.createElement('div');
    confirmationPopup.classList.add('confirmationPopup');

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
  
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('closeBtn');
    closeBtn.innerText = 'X';
    closeBtn.addEventListener('click', () => {
        confirmationPopup.remove();
        overlay.classList.remove('overlay');
        window.location.reload();
    });

    const confirmationMessage = document.createElement('div');
    confirmationMessage.classList.add('confirmationMessage')
    confirmationMessage.innerHTML = `Woohoo! Thank you for your order ${loggedIn}, we'll package and ship it to you shortly! <br><br>
        Every purchase supports our small business and that means the world. <br><br>
        <i class="fa-solid fa-heart fa-5x" id='heart'></i>`;

    confirmationPopup.append(closeBtn, confirmationMessage);
    document.body.appendChild(overlay);
    document.body.appendChild(confirmationPopup);
}