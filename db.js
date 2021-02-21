const bookDbFilePath = require('./config.json')['bookPath'];
const noteDbFilePath = require('./config.json')['notePath'];
const path = require('path');
const homedir = require('os').homedir();
const sqlite3 = require('sqlite3');
const util = require('util');
const fs = require('fs');

const NOTE_QUERY = `SELECT
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
WHERE ZTITLE IS NOT NULL`;

const BOOK_QUERY_PARAM = `SELECT
ZASSETID,
ZTITLE AS Title,
ZAUTHOR AS Author
FROM ZBKLIBRARYASSET
WHERE ZASSETID = "%s"
AND ZTITLE IS NOT NULL`;



function fromDir(startPath,filter){

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }
    const foundFiles = [];
    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.endsWith(filter)) {
            foundFiles.push(filename);
        };
    };
    return foundFiles;
};


async function getConnection(filePath) {
    const basePath = path.join(homedir, filePath);
    const resolvedFilePath = fromDir(basePath, '.sqlite');
    let db;
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(resolvedFilePath[0], (err) => {
            if (err) {
              return reject(err);
            }
            return resolve(db);
          });
    
    });
    
}


async function getAllNotes(bookId) {
    const dbNote = await getConnection(noteDbFilePath);
    return new Promise((resolve, reject) => {
        const queries = [];
        dbNote.each(util.format(NOTE_QUERY, bookId), (err, row) => {
            if (err) {
                reject(err); // optional: you might choose to swallow errors.
            } else {
                queries.push(row); // accumulate the data
            }
        }, (err, n) => {
            if (err) {
                reject(err); // optional: again, you might choose to swallow this error.
            } else {
                resolve(queries); // resolve the promise
            }
        });
    });
}

async function getBooks(bookId) {
    let query;
    if (bookId){
        query = util.format(BOOK_QUERY_PARAM, bookId);
    }else{
        query = BOOK_QUERY;
    }
    const dbBook = await getConnection(bookDbFilePath);
    return new Promise((resolve, reject) => {
        const queries = [];
        dbBook.each(query, (err, row) => {
            if (err) {
                reject(err); // optional: you might choose to swallow errors.
            } else {
                queries.push(row); // accumulate the data
            }
        }, (err, n) => {
            if (err) {
                reject(err); // optional: again, you might choose to swallow this error.
            } else {
                resolve(queries); // resolve the promise
            }
        });
    });
}

module.exports.getBooks = getBooks;
module.exports.getAllNotes = getAllNotes;
