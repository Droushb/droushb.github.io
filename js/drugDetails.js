// Extract the drugId from the URL
const urlParams = new URLSearchParams(window.location.search);
const drugId = urlParams.get('id');

// Make a GET request to the server to get the drug details
fetch(`http://localhost:5000/drug/${drugId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())
  .then(data => {
    // Populate the HTML elements with the drug details
    document.getElementById('drug-name').innerHTML = data.Name;
    document.getElementById('drug-title').innerHTML = data.Name;
    document.getElementById('drug-status').innerHTML = data.Status;
    document.getElementById('drug-description').innerHTML = data.Description;
    document.getElementById('drug-price').innerHTML = '$' + data.Price;
    document.getElementById('drug-image').src = data.Image;
    if (data.Status != "available") {
      document.getElementById('add-to-cart').disabled = true;
    } else {
      document.getElementById('add-to-cart').disabled = false;
    }
    document.getElementById('add-to-cart').addEventListener('click', async () => {
      const quantity = document.getElementById('input-quantity').value;
      activeToaster("Success", "You successfully added drug to cart");
      await addToCart(drugId, quantity);
      // window.location.href = 'cart.html';
    });
  })
  .catch(error => activeToaster("Error", error));

