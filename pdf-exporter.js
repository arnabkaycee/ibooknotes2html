const html_to_pdf = require('html-pdf');
const pdfOptions = require('./config.json')['pdfOptions'];

const exportPath = require('./config.json')['exportPath'] || __dirname;

const eta = require('eta');
const path = require ('path');
const fs = require('fs');

async function createFiles(title, author, contents) {
  
  let it = {
    title : title,
    author : author,
    data : contents
  };
  
  let x = await eta.renderFile(path.join(__dirname, "layout.eta"), it);
  const fileName = title.replaceAll(' ', '-');
  const pdfFilePath = path.join(exportPath, fileName+'.pdf');
  const htmlFilePath = path.join(exportPath, fileName+'.html');
  html_to_pdf.create(x, pdfOptions).toFile(pdfFilePath, function(err, res) {
    if (err) return console.log(err);
    console.log(`Exported to file : ${res.filename}`);
  });
  fs.writeFileSync(htmlFilePath,x);
}

module.exports.createFiles = createFiles;