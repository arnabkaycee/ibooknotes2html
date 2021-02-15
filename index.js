const sqlite3 = require('sqlite3');
const config = require('./config.json');
const util = require('util');


// underlined -> underlined,
// 5 - purple
// 4 - pink
// 3 - yellow
// 2 - blue
// 1 - green


const NOTE_QUERY=`SELECT
ZANNOTATIONSELECTEDTEXT as SelectedText,
ZANNOTATIONNOTE as Note,
ZFUTUREPROOFING5 as Chapter,
ZANNOTATIONCREATIONDATE as Created,
ZANNOTATIONMODIFICATIONDATE as Modified,
ZANNOTATIONASSETID as AssetId,
ZANNOTATIONISUNDERLINE as Underlined,
case ZANNOTATIONSTYLE
    WHEN '5' then '#f1c1f7'
    WHEN '4' then '#f7c1cb'
    WHEN '3' then '#fffbc2'
    WHEN '2' then '#def1ff'
    WHEN '1' then '#cef5e6'
    END as color
FROM ZAEANNOTATION
WHERE ZANNOTATIONASSETID = "%s"
AND ZANNOTATIONSELECTEDTEXT IS NOT NULL
ORDER BY ZANNOTATIONASSETID ASC,Created ASC`;

const BOOK_QUERY = `SELECT
ZASSETID,
ZTITLE AS Title,
ZAUTHOR AS Author
FROM ZBKLIBRARYASSET
WHERE ZTITLE IS NOT NULL`

const dbBook = new sqlite3.Database(config.bookPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the book database.');
  });

const dbNote = new sqlite3.Database(config.notePath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the note database.');
  });


function getAllBooks(){

    dbBook.serialize(() => {
        dbBook.each(`SELECT
                ZASSETID,
                ZTITLE AS Title,
                ZAUTHOR AS Author
            FROM ZBKLIBRARYASSET
            WHERE ZTITLE IS NOT NULL`, (err, row) => {
          if (err) {
            console.error(err.message);
          }
          console.log(row);
        });
      });
}

function getAllNotes(bookId){
    //console.log(util.format(NOTE_QUERY, bookId));
    dbNote.serialize(() => {
        dbNote.each(util.format(NOTE_QUERY, bookId), (err, row) => {
          if (err) {
            console.error(err.message);
          }
          console.log(row);
        });
      });
}

function createHTML(){
    let json = getAllNotes('4347099EFF55D26EA262175D88BA312D');

}

getAllNotes('4347099EFF55D26EA262175D88BA312D')
//getAllBooks();

