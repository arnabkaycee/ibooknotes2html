
const db = require('./db');
const pdf = require('./pdf-exporter');
const booksToFetch = require('./config.json')['books'];

async function generate() {

  for (let i = 0; i < booksToFetch.length; i++) {
    const element = booksToFetch[i];

    let bookId = element;
    if (bookId) {
      let bookDetails = await db.getBooks(bookId);
      if (bookDetails && bookDetails[0]) {
        bookDetails = bookDetails[0];

        if (bookDetails && bookDetails['Title'] && bookDetails['Author']) {
          let json = await db.getAllNotes(bookId);
          pdf.createFiles(bookDetails['Title'], bookDetails['Author'], json);
        }
      }
    }
  }
generate();