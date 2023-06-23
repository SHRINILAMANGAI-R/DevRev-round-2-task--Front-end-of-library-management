// Retrieve cart items from local storage
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const cartItemsContainer = document.getElementById('cart-items');

// Display cart items
for (const item of cartItems) {
  const listItem = document.createElement('li');
  listItem.textContent = item.volumeInfo.title;
  cartItemsContainer.appendChild(listItem);
}
