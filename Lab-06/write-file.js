const fs = require('fs');

fs.writeFile('output.txt', 'This is my second message!', (err) => {
    if (err) throw err;
    console.log('File written successfully.');
});