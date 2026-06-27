let books = [];

// DOM Elements
const form = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const totalBooks = document.getElementById("totalBooks");
const search = document.getElementById("search");
const filter = document.getElementById("filter");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const categoryInput = document.getElementById("category");
const yearInput = document.getElementById("year");

// Load books from localStorage or JSON file
async function loadBooks() {
  const savedBooks = localStorage.getItem("books");

  if (savedBooks) {
    books = JSON.parse(savedBooks);
  } else {
    try {
      const response = await fetch("books.json");
      books = await response.json();
      saveToStorage();
    } catch (error) {
      console.error("Error loading books:", error);
      books = [];
    }
  }

  renderBooks();
}

// Save books
function saveToStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

// Show books on screen
function renderBooks(data = books) {
  bookList.innerHTML = "";

  data.forEach((book, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
    <h3>${book.title}</h3>
    <p><b>Author:</b> ${book.author}</p>
    <p><b>Category:</b> ${book.category}</p>
    <p><b>Year:</b> ${book.year}</p>
    <button onclick="deleteBook(${index})">Delete</button>
  `;
    bookList.appendChild(card);
  });

  totalBooks.textContent = data.length;
  updateFilter();
}

// Add new book
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const newBook = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    category: categoryInput.value.trim(),
    year: yearInput.value.trim()
  };

  books.push(newBook);
  saveToStorage();
  renderBooks();
  form.reset();
});

// Delete book
function deleteBook(index) {
  books.splice(index, 1);
  saveToStorage();
  renderBooks();
}

// Search books
search.addEventListener("input", function () {
  const searchText = search.value.toLowerCase();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchText)
  );

  renderBooks(filteredBooks);
});

// Update category list
function updateFilter() {
  const categories = ["all", ...new Set(books.map(book => book.category))];

  filter.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });
}

// Filter books by category
filter.addEventListener("change", function () {
  if (filter.value === "all") {
    renderBooks();
  } else {
    const filteredBooks = books.filter(book =>
      book.category === filter.value
    );

    renderBooks(filteredBooks);
  }
});

// Start app
loadBooks();