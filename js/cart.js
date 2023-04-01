let cartItems = [];

window.addEventListener('load', () => {
  // Get the cart items from cookies or local storage
  const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
  if (savedCartItems) {
    cartItems = savedCartItems;
    buildTable();
  }
});

async function addToCart(drugId, quantity) {
  let cartItem = cartItems.find(item => item.id === drugId);
  if (cartItem) {
    cartItem.quantity = Number(cartItem.quantity) + 1;
  } else {
    const response = await fetch(`http://localhost:5000/drug/${drugId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    cartItem = {
      id: drugId,
      name: data.Name,
      price: data.Price,
      quantity: quantity
    };
    cartItems.push(cartItem);
  }
  // Save the cart items to cookies or local storage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  return cartItems;
}

// Remove a cart item by id
function removeCartItemById(drugId) {
  const index = cartItems.findIndex(item => item.id == drugId);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
  // Save the cart items to cookies or local storage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  buildTable();
}

function handleInputQuantityChange(input, drugId) {
  const quantity = input.value;

  const index = cartItems.findIndex(item => item.id == drugId);
  cartItems[index].quantity = quantity;
  // Save the cart items to cookies or local storage
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  buildTable();
}

// Build the table
function buildTable() {
  console.log(cartItems)
  const cartBody = document.getElementById('cart-body');

  if (!cartBody) {
    console.error("Table body element not found");
    return;
  }

  cartBody.innerHTML = '';
  let total = 0;

  cartItems.forEach(cartItem => {
    const { id, name, price, quantity } = cartItem;
    const rowTotal = price * quantity;
    total += rowTotal;

    const row = `
      <tr>
        <td class="product-name">
          <h2 class="h5 text-black">${name}</h2>
        </td>
        <td>$${price.toFixed(2)}</td>
        <td>
          <div class="input-group" style="max-width: 120px; margin: 0 auto;">
            <input type="text" class="form-control text-center" value="${quantity}" placeholder="" 
            aria-describedby="button-addon1" onchange="handleInputQuantityChange(this, ${id})">
          </div>
        </td>
        <td>$${rowTotal.toFixed(2)}</td>
        <td><button type="button" class="btn btn-primary height-auto btn-sm js-remove-product" onClick="removeCartItemById(${id})">X</button></td>
      </tr>
    `;
    cartBody.innerHTML += row;
  });

  //document.getElementById('drug-name').innerHTML = data.Name;
  // Update the total
  const totalElement = document.getElementById('total-field');
  totalElement.textContent = `$${total.toFixed(2)}`;
}

function makeOrder() {
  const items = cartItems.map(item => {
    return {
      idDrug: item.id,
      quantity: item.quantity
    }
  });

  const userId = localStorage.getItem('user_id');

  // construct the request body with the user id, status id, and items array
  const requestBody = {
    idUser: userId,
    idStatus: 4,
    items: items
  };

  const access_token = localStorage.getItem('access_token');
  if (access_token == '') {
    activeToaster("Error", "Please Login")
    return;
  }

  fetch('http://localhost:5000/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      if (response.ok) {
        let cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        window.location = 'thankyou.html'
      } else {
        // response status code is outside the 200-299 range
        throw new Error('HTTP status ' + response.status);
      }
    })
    .then(data => {
      console.log(data.access_token);
    })
    .catch(error => activeToaster("Error", error));
}

