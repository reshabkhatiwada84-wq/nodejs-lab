# Node.js Lab 06 - File System

## Lab Number
06

## Date
25 September 2026

## Description

This lab demonstrates file system operations in Node.js, including asynchronous and synchronous file reading, writing, appending, deleting files, async/await, and a command-line notes application.

## Files and What They Demonstrate

- `read-async.js` - Demonstrates reading a file asynchronously using `fs.readFile()`.
- `read-sync.js` - Demonstrates reading a file synchronously using `fs.readFileSync()`.
- `write-file.js` - Demonstrates writing data to a file using `fs.writeFile()` and overwriting existing content.
- `append-file.js` - Demonstrates adding new content to an existing file using `fs.appendFile()`.
- `delete-file.js` - Demonstrates deleting a file using `fs.unlink()`.
- `async-await-version.js` - Demonstrates reading and writing files using `fs.promises` with async/await and try/catch.
- `add-note.js` - Demonstrates accepting a note from command-line arguments and appending it to a notes file.
- `read-notes.js` - Demonstrates reading and displaying saved notes from a file.

## Concepts Covered

- Node.js File System (`fs`) module
- Asynchronous file operations
- Synchronous file operations
- Writing and overwriting files
- Appending data to files
- Deleting files
- Promises
- Async/Await
- Try/Catch error handling
- Command-line arguments
- Building a simple Notes App