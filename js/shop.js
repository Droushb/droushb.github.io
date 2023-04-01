fetch('http://localhost:5000/drugs', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())
  .then(data => {
    const drugList = document.getElementById('drug-list');
    drugList.innerHTML = '';

    data.forEach(drug => {
      const isPending = drug.Status=="pending" ? '<span class="tag">Pending</span>'  : '';
      const imageSrc = drug.Image //'data:image/png;base64,' + drug.image;
      //const price = drug.isOnSale ? `<del>${drug.price.toFixed(2)}</del> &mdash; $${(drug.price * 0.7).toFixed(2)}` : `$${drug.price.toFixed(2)}`;

      const drugItem = `
    <div class="col-md-3 text-center item mb-5 ml-4 mr-4">
      ${isPending}
      <a href="shop-single.html?id=${drug.Id}"> <img src="${imageSrc}" alt="${drug.Name}"></a>
      <h3 class="text-dark"><a href="shop-single.html?id=${drug.Id}">${drug.Name}</a></h3>
      <p class="price">$${drug.Price}.00</p>
      <div class="col-md-8" style="margin: 0 auto;">
        <div class="form-group">
          <button id="add-to-cart-${drug.Id}" class="btn btn-primary btn-block" data-drug-id="${drug.Id}" data-drug-quantity="1" style="font-size: 12px;" onclick="addToCartFromShop(this)">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
      drugList.insertAdjacentHTML('beforeend', drugItem);
    });
  })
  .catch(error => activeToaster("Error", error));

async function addToCartFromShop(button) {
  const drugId = button.getAttribute('data-drug-id');
  const quantity = button.getAttribute('data-drug-quantity');

  activeToaster("Success", "You successfully added drug to cart");
  await addToCart(drugId, quantity);
  // window.location.href = 'cart.html';
};