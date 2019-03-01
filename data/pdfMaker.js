// Scale proprotionally to the specified width
const PDFDocument = require('pdfkit');
const fs = require('fs');
const sizeOf = require('image-size');

const thisImgDim = sizeOf('./test/5984page17.jpg');
console.log(thisImgDim.width, thisImgDim.height);

if (thisImgDim.width > thisImgDim.height) {
    return console.log("Make it landscape");
}

console.log("Make it portait");

// Create a document. Default the setting to North American Letter size.
const doc = new PDFDocument({
    layout: 'landscape',
    size: 'letter'
});

// Pipe its output somewhere, like to a file or HTTP response
doc.pipe(fs.createWriteStream('./test/outputTest2.pdf'));

// doc.addPage({
//     layout: landscape,
//     size: 'LETTER'
// });

// Add an image, constrain it to a given size, and center it vertically and horizontally
doc.image('./test/5984page17.jpg', 0, 0, {width: 612.00});

// Finalize PDF file
doc.end();