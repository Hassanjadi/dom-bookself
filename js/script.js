/**
 * [
 *    {
 *      id: string | number,
 *      title: string,
 *      author: string,
 *      year: number,
 *      isComplete: boolean,
 *    }
 * ]
 */

const books = [];
const RENDER_EVENT = "render-book";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBookselfToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  saveBooksToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function showCustomDialog(callback) {
  const dialog = document.getElementById("custom-dialog");
  dialog.style.display = "block";

  const confirmDeleteButton = document.getElementById("confirm-delete");
  const cancelDeleteButton = document.getElementById("cancel-delete");

  confirmDeleteButton.addEventListener("click", function () {
    dialog.style.display = "none";
    callback(true);
  });

  cancelDeleteButton.addEventListener("click", function () {
    dialog.style.display = "none";
    callback(false);
  });
}

function removeBookshelfList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  showCustomDialog(function (confirmed) {
    if (confirmed) {
      books.splice(bookTarget, 1);
      saveBooksToLocalStorage();
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  });
}

function unreadBookshelfList(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  saveBooksToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
}

function makeBook(bookObject) {
  const titleBook = document.createElement("h3");
  titleBook.innerText = bookObject.title;

  const authorBook = document.createElement("p");
  authorBook.innerText = `Penulis: ${bookObject.author}`;

  const yearBook = document.createElement("p");
  yearBook.innerText = `Tahun: ${bookObject.year}`;

  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.append(titleBook, authorBook, yearBook);

  const bookList = document.createElement("div");
  bookList.classList.add("book_list_item");
  bookList.append(bookItem);
  bookList.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const unreadButton = document.createElement("button");
    unreadButton.classList.add("unread_button");
    unreadButton.innerText = "Unread";

    unreadButton.addEventListener("click", function () {
      unreadBookshelfList(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete_button");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", function () {
      removeBookshelfList(bookObject.id);
    });

    bookItem.append(unreadButton, deleteButton);
  } else {
    const readButton = document.createElement("button");
    readButton.classList.add("read_button");
    readButton.innerText = "Done";

    readButton.addEventListener("click", function () {
      addBookselfToCompleted(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete_button");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", function () {
      removeBookshelfList(bookObject.id);
    });

    bookItem.append(readButton, deleteButton);
  }

  return bookList;
}

function addBook() {
  const titleBook = document.getElementById("inputBookTitle").value;
  const authorBook = document.getElementById("inputBookAuthor").value;
  const yearBook = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    titleBook,
    authorBook,
    yearBook,
    isComplete,
    false
  );
  books.push(bookObject);

  saveBooksToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveBooksToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooksFromLocalStorage() {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books.push(...JSON.parse(storedBooks));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadBooksFromLocalStorage();
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  console.info(books);
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.appendChild(bookElement);
    } else {
      completeBookshelfList.appendChild(bookElement);
    }
  }
});

function searchBooks(title) {
  const searchResult = books.filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );
  return searchResult;
}

document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchInput = document.getElementById("searchBookTitle").value;
    const searchResult = searchBooks(searchInput);
    renderSearchResult(searchResult);
  });
});

function renderSearchResult(results) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  results.forEach((bookItem) => {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.appendChild(bookElement);
    } else {
      completeBookshelfList.appendChild(bookElement);
    }
  });
}
