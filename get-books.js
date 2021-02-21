const Table = require('cli-table3');
const db = require('./db');
const fs = require('fs');

async function createBookTable(){
    const books = await db.getBooks();
    var table = new Table({
        head: ['ID', 'Book Name', 'Author'],
        style: {
            head: []    //disable colors in header cells
          , border: []  //disable colors for the border
        },
        colWidths : [,50,50]
    });

    books.forEach((element, index) => {
        table.push([element['ZASSETID'], element['Title'], element['Author']]);
    });
    return table;
}

async function writeTableToFile(){
    const data = await createBookTable();
    fs.writeFileSync('./books.txt',data.toString());
}
writeTableToFile();