/*
    | Bookshelf API |  
  by: Yusuf Fahar Prasli Irsyad 
*/

//Import file
const { nanoid } = require('nanoid');
const books = require('./books');

/* | Adding Books | */
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  // Data processed on the backend
  const id = nanoid(16);
  const finished = pageCount == readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  // Move books
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, finished, reading, insertedAt, updatedAt
  };
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  };
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

/* | View Entire Book | */
const getAllBooksHandler = (request, h) => {
  //additional features. query params.
  const { name, reading, finished } = request.query;
  if (name) {
    const queryName = name.toLowerCase();
    const book = books.filter((n) => n.name.toLowerCase().includes(queryName));
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  };
  if (reading !== undefined) {
    const isReading = reading === '1';
    const book = books.filter((n) => n.reading === isReading);
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  };
  if (finished !== undefined) {
    const isFinished = finished === '1';
    const book = books.filter((n) => n.finished === isFinished);
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  };
  
  //sent all book
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

/* | View Book Details | */
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];
  // If id found
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  };
  // if id not found
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

/* | Edit Book's data | */
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  
  const index = books.findIndex((book) => book.id === bookId);
  
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  };
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  };
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukani',
    });
    response.code(404);
    return response;
  };
  //criteria are met
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

/* | Delete Book | */
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  };
  //criteria are met
  books.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
    });
  response.code(200);
  return response;
};

module.exports = { 
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};