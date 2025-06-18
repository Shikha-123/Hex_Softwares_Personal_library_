const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');
const searchInput = document.getElementById('searchInput');

let library = JSON.parse(localStorage.getItem('library')) || [];

bookForm.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const category = document.getElementById('category').value.trim();

  const newBook = {
    id: Date.now(),
    title,
    author,
    category,
    borrowed: false,
    history: []
  };

  library.push(newBook);
  saveLibrary();
  renderBooks();
  bookForm.reset();
});

searchInput.addEventListener('input', () => renderBooks(searchInput.value));

function renderBooks(query = '') {
  bookList.innerHTML = '';

  const filtered = library.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );

  filtered.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = `book ${book.borrowed ? 'borrowed' : ''}`;

    bookDiv.innerHTML = `
      <strong>${book.title}</strong> by ${book.author} <br/>
      <em>${book.category}</em><br/>
      Status: ${book.borrowed ? 'Borrowed' : 'Available'}
      <br/><button onclick="toggleBorrow(${book.id})">${book.borrowed ? 'Return' : 'Borrow'}</button>
    `;

    bookList.appendChild(bookDiv);
  });
}

function toggleBorrow(id) {
  const book = library.find(b => b.id === id);
  if (book) {
    book.borrowed = !book.borrowed;
    book.history.push({
      action: book.borrowed ? 'Borrowed' : 'Returned',
      date: new Date().toLocaleString()
    });
    saveLibrary();
    renderBooks(searchInput.value);
  }
}

function saveLibrary() {
  localStorage.setItem('library', JSON.stringify(library));
}

renderBooks();
