const fs = require('fs');
const path = require('path');

const labs = [
  {
    id: '01',
    dir: 'Lab-01',
    title: 'Node.js Basics',
    description: 'Introduction to Node.js, npm, first program, console, variables, data types and basic concepts.',
    images: ['node-version.png'],
    codeFiles: ['app.js']
  },
  {
    id: '02',
    dir: 'Lab-2',
    title: 'HTTP Server',
    description: 'HTTP module, server creation, routing, request and response handling, JSON and 404 responses.',
    images: ['server-running.png'],
    codeFiles: ['server.js']
  },
  {
    id: '03',
    dir: 'Lab-3',
    title: 'Student Directory',
    description: 'A practical Node.js server for displaying student information using different routes.',
    images: ['student-server output.png', 'student-server output 1.png'],
    codeFiles: ['student-server.js']
  },
  {
    id: '04',
    dir: 'Lab-4',
    title: 'Advanced Server',
    description: 'Student records, routing, filtering and practical server-side operations using Node.js.',
    images: ['advance.output-2.png', 'advance.output-student.png', 'advanced-output.png'],
    codeFiles: ['advanced-server.js']
  },
  {
    id: '05',
    dir: 'Lab-05',
    title: 'Asynchronous Node.js',
    description: 'Callbacks, Promises, Promise chaining, async/await, Promise.all() and Event Loop.',
    images: [],
    codeFiles: ['callback-version.js', 'promise-version.js', 'chaining-version.js', 'async-await-version.js', 'concurrent-orders.js']
  },
  {
    id: '06',
    dir: 'Lab-06',
    title: 'File System & CLI Notes',
    description: 'File-system operations, synchronous and asynchronous file handling and the command-line Notes App.',
    images: ['notes-app-output.png', 'read comparision.png.png'],
    codeFiles: ['read-sync.js', 'read-async.js', 'write-file.js', 'append-file.js', 'delete-file.js', 'add-note.js', 'read-notes.js']
  }
];

const outDir = path.join(__dirname, 'labs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const getTemplate = (lab, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lab ${lab.id} | Node.js Laboratory</title>
  <link rel="stylesheet" href="../style.css">
  <style>
    .lab-container {
      max-width: 1180px;
      margin: 40px auto;
      padding: 30px 24px;
    }
    .lab-content-box {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 40px;
    }
    .back-btn {
      display: inline-block;
      margin-bottom: 25px;
      color: var(--green);
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
    }
    .back-btn:hover {
      text-decoration: underline;
    }
    h1 {
      margin-top: 0;
      font-size: 34px;
      letter-spacing: -1px;
    }
    .desc {
      color: var(--muted);
      margin-top: 15px;
      font-size: 15px;
      line-height: 1.8;
    }
    h2 {
      margin-top: 45px;
      margin-bottom: 20px;
      font-size: 22px;
      color: var(--text);
      border-bottom: 1px solid var(--line);
      padding-bottom: 10px;
    }
    .lab-img {
      max-width: 100%;
      border-radius: 12px;
      border: 1px solid var(--line);
      margin-bottom: 20px;
    }
    pre {
      background: rgba(0,0,0,0.4);
      padding: 20px;
      border-radius: 12px;
      overflow-x: auto;
      border: 1px solid var(--line);
      margin-top: 15px;
    }
    code {
      color: var(--green);
      font-family: monospace;
      font-size: 14px;
    }
    .code-title {
      display: inline-block;
      background: var(--line);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      color: var(--text);
      font-weight: 700;
      margin-bottom: -10px;
      position: relative;
      z-index: 1;
    }
    .code-wrapper {
      margin-top: 25px;
    }
  </style>
</head>
<body>
  <nav class="nav">
    <div class="logo">
      <span>⬢</span> Node.js Lab Portal
    </div>
    <div class="nav-links">
      <a href="../index.html">← Home</a>
    </div>
  </nav>

  <main class="lab-container">
    <div class="lab-content-box">
      <a href="../index.html#labs" class="back-btn">← Back to Explore Labs</a>
      
      <small>LABORATORY ${lab.id}</small>
      <h1>${lab.title}</h1>
      <p class="desc">${lab.description}</p>
      
      ${content}
    </div>
  </main>
  
  <footer>
    <strong>Node.js Laboratory Portal</strong>
    <span>BCA VII Semester • Rishabh Khatiwada</span>
  </footer>
</body>
</html>
`;

labs.forEach(lab => {
  let content = '';

  // Add images
  if (lab.images.length > 0) {
    content += `<h2>Outputs</h2>`;
    lab.images.forEach(img => {
      content += `<img src="../${lab.dir}/${img}" class="lab-img" alt="${img} output">`;
    });
  }

  // Add code files
  if (lab.codeFiles.length > 0) {
    content += `<h2>Source Code</h2>`;
    lab.codeFiles.forEach(file => {
      const filePath = path.join(__dirname, lab.dir, file);
      let code = '';
      try {
        if (fs.existsSync(filePath)) {
          code = fs.readFileSync(filePath, 'utf-8');
          code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        } else {
          code = `// File ${file} not found.`;
        }
      } catch (err) {
        code = `// Error reading ${file}: ${err.message}`;
      }
      
      content += `
        <div class="code-wrapper">
          <div class="code-title">${file}</div>
          <pre><code>${code}</code></pre>
        </div>
      `;
    });
  }

  const html = getTemplate(lab, content);
  fs.writeFileSync(path.join(outDir, `lab${lab.id}.html`), html);
  console.log(`Generated lab${lab.id}.html`);
});

console.log('All labs generated successfully!');
