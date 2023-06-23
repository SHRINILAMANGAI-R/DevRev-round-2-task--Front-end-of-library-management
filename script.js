const booksPerPage = 10; // Number of books to display per page
let currentPage = 1; // Current page number
let booksData = []; // Array to store all books data
let filteredBooks = []; // Array to store filtered books data

// Fetch book data from the Google Books API
async function fetchBooksData() {
  try {
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=javascript');
    const data = await response.json();
    return data.items; // Extracting the book items from the API response
  } catch (error) {
    console.error('Error fetching book data:', error);
    return []; // Return an empty array in case of an error
  }
}

// Function to display books based on the current page
function displayBooks() {
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksToDisplay = filteredBooks.slice(startIndex, endIndex);

  const booksContainer = document.getElementById('books');
  booksContainer.innerHTML = ''; // Clear previous content

  for (const book of booksToDisplay) {
    const bookElement = document.createElement('div');
    const title = book.volumeInfo.title;
    const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
    const subject = book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : 'Unknown Subject';
    const publishDate = book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate : 'Unknown Publish Date';
    let copies = 50;

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to Cart';
    addButton.addEventListener('click', () => {
      if (copies > 0) {
        copies--;
        updateCopiesDisplay(title, copies);
        addToCart(book); // Execute the addToCart(book) function
      }
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove from Cart';
    removeButton.addEventListener('click', () => {
      copies++;
      updateCopiesDisplay(title, copies);
      removeFromCart(book); // Execute the removeFromCart(book) function
    });

    bookElement.innerHTML = `<p>Title: ${title}</p>
                             <p>Author: ${author}</p>
                             <p>Subject: ${subject}</p>
                             <p>Publish Date: ${publishDate}</p>
                             <p>No of copies: <span id="copies-${title}">${copies}</span></p>`;
    bookElement.appendChild(addButton);
    bookElement.appendChild(removeButton);

    booksContainer.appendChild(bookElement);
  }
}

// Function to update the display of copies for a book
function updateCopiesDisplay(title, copies) {
  const copiesElement = document.getElementById(`copies-${title}`);
  if (copiesElement) {
    copiesElement.textContent = copies;
  }
}

// Function to generate pagination buttons
function generatePaginationButtons() {
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginationContainer = document.getElementById('pagination');

  paginationContainer.innerHTML = ''; // Clear previous buttons

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.addEventListener('click', () => {
      currentPage = i;
      displayBooks();
    });
    paginationContainer.appendChild(button);
  }
}

// Function to apply filters based on user input
function applyFilters() {
  const titleInput = document.getElementById('title').value.toLowerCase();
  const authorInput = document.getElementById('author').value.toLowerCase();
  const subjectInput = document.getElementById('subject').value.toLowerCase();
  const publishDateInput = document.getElementById('publish-date').value.toLowerCase();

  filteredBooks = booksData.filter((book) => {
    const { volumeInfo } = book;
    const title = volumeInfo.title.toLowerCase();
    const authors = volumeInfo.authors ? volumeInfo.authors.map(author => author.toLowerCase()) : [];
    const categories = volumeInfo.categories ? volumeInfo.categories.map(category => category.toLowerCase()) : [];
    const publishedDate = volumeInfo.publishedDate ? volumeInfo.publishedDate.toLowerCase() : '';

    return (
      title.includes(titleInput) &&
      authors.some(author => author.includes(authorInput)) &&
      categories.some(category => category.includes(subjectInput)) &&
      publishedDate.includes(publishDateInput)
    );
  });

  currentPage = 1; // Reset to the first page after applying filters
  displayBooks();
  generatePaginationButtons();
}

// Function to add a book to the cart
function addToCart(book) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.push(book);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to remove a book from the cart
function removeFromCart(book) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const updatedCartItems = cartItems.filter((item) => item.volumeInfo.title !== book.volumeInfo.title);
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
}

// Fetch book data and initialize booksData and filteredBooks
fetchBooksData()
  .then((data) => {
    booksData = data;
    filteredBooks = data;
    displayBooks();
    generatePaginationButtons();
  })
  .catch((error) => {
    console.error('Error fetching book data:', error);
  });















