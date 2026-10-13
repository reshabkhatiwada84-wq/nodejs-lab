const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon'
};

function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, status, text, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*'
  });
  res.end(text);
}

// Student database for Lab 03 & 04 routes
const lab03Students = [
  { id: 23145001, name: 'Aditya Soni', course: 'BCA' },
  { id: 23145002, name: 'Bhaskar Mall', course: 'BCA' },
  { id: 23145003, name: 'Ayush Ram Tripathi', course: 'BCA' },
  { id: 23145004, name: 'Yadev Singh Nishad', course: 'BCA' },
  { id: 23145005, name: 'Sayon Koley', course: 'BCA' },
  { id: 23145006, name: 'Rishabh Khatiwada', course: 'BCA' },
  { id: 23145007, name: 'Gauri', course: 'BCA' },
  { id: 23145008, name: 'Kanak Sharma', course: 'BCA' },
  { id: 23145009, name: 'Pragya Gupta', course: 'BCA' },
  { id: 23145010, name: 'Shreya Singh', course: 'BCA' },
  { id: 23145011, name: 'Shreya Kashyap', course: 'BCA' },
  { id: 23145012, name: 'Mikki', course: 'BCA' }
];

const lab04Students = [
  { id: 1, name: 'Aditya Soni', course: 'BCA', marks: 78 },
  { id: 2, name: 'Bhaskar Mall', course: 'BCA', marks: 65 },
  { id: 3, name: 'Gaurav Kumar', course: 'BIT', marks: 82 },
  { id: 4, name: 'Aman Pratap Singh', course: 'BIT', marks: 55 },
  { id: 5, name: 'Sayon Koley', course: 'BBA', marks: 71 },
  { id: 6, name: 'Rishabh Khatiwada', course: 'BCA', marks: 88 },
  { id: 7, name: 'Akansha Rana', course: 'BIT', marks: 91 },
  { id: 8, name: 'Amit Tiwari', course: 'BIT', marks: 62 },
  { id: 9, name: 'Ashutosh Sukla', course: 'BBA', marks: 78 },
  { id: 10, name: 'Rohit Kumar', course: 'BBA', marks: 84 },
  { id: 11, name: 'Raman Singh', course: 'BBA', marks: 92 },
  { id: 12, name: 'Sumit Sukla', course: 'BA', marks: 95 },
  { id: 13, name: 'Ram Mohan', course: 'BA', marks: 88 }
];

function handleLabServerRoute(labId, subPath, res) {
  const normPath = (subPath || '/').replace(/\/+$/, '') || '/';

  // LAB 02 ROUTES
  if (labId === '02' || labId === 2) {
    if (normPath === '/') {
      return sendText(res, 200, 'Welcome to my Node.js HTTP Server\nName: Rishabh Khatiwada\nLab Assignment: 02');
    }
    if (normPath === '/about') {
      return sendText(res, 200, 'About: BCA VII Semester, Dev Sanskriti Vishwavidyalaya (DSVV), Haridwar.');
    }
    if (normPath === '/college') {
      return sendText(res, 200, 'Dev Sanskriti Vishwavidyalaya - Department of Computer Science - BCA VII Semester');
    }
    if (normPath === '/profile') {
      return sendJSON(res, 200, {
        name: 'Rishabh Khatiwada',
        scholarNumber: '23145018',
        course: 'BCA',
        semester: 'VII',
        college: 'Dev Sanskriti Vishwavidyalaya',
        subject: 'CS403NOD - Node.js',
        status: 'Active Student'
      });
    }
    return sendJSON(res, 404, { error: 'Route not found in Lab 02 server', path: normPath });
  }

  // LAB 03 ROUTES
  if (labId === '03' || labId === 3) {
    if (normPath === '/') {
      return sendText(res, 200, 'Welcome to Student Directory Server (Lab 03)\nUse /students to view student records.');
    }
    if (normPath === '/students') {
      return sendJSON(res, 200, lab03Students);
    }
    const studentMatch = normPath.match(/^\/students\/(\d+)$/);
    if (studentMatch) {
      const studentId = Number(studentMatch[1]);
      const found = lab03Students.find(s => s.id === studentId);
      return found 
        ? sendJSON(res, 200, found)
        : sendJSON(res, 404, { error: 'Student not found', queryId: studentId });
    }
    return sendJSON(res, 404, { error: 'Route not found in Student Directory', path: normPath });
  }

  // LAB 04 ROUTES
  if (labId === '04' || labId === 4) {
    if (normPath === '/') {
      return sendText(res, 200, 'Welcome to Advanced Student Record Server (Lab 04)');
    }
    if (normPath === '/students') {
      return sendJSON(res, 200, lab04Students);
    }
    const marksMatch = normPath.match(/^\/students\/marks\/(\d+)$/);
    if (marksMatch) {
      const minMarks = Number(marksMatch[1]);
      const filtered = lab04Students.filter(s => s.marks >= minMarks);
      return sendJSON(res, 200, { minMarks, count: filtered.length, students: filtered });
    }
    const idMatch = normPath.match(/^\/students\/(\d+)$/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      const found = lab04Students.find(s => s.id === id);
      return found 
        ? sendJSON(res, 200, found)
        : sendJSON(res, 404, { error: 'Student record not found', id });
    }
    return sendJSON(res, 404, { error: 'Route not found in Advanced Server', path: normPath });
  }

  return sendJSON(res, 400, { error: 'Unsupported server lab ID', labId });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // API: Run script endpoint
  if (pathname === '/api/run') {
    if (req.method === 'GET') {
      return sendText(res, 200, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lab Runner API Status</title>
  <link rel="stylesheet" href="/style.css">
  <style>
    body { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
    .status-card { background:var(--bg-card); border:1px solid var(--line); border-radius:20px; padding:40px; max-width:540px; text-align:center; backdrop-filter:blur(14px); }
    .status-card h1 { font-size:26px; margin:16px 0 10px; }
    .status-card p { color:var(--muted); font-size:14.5px; line-height:1.7; margin-bottom:24px; }
  </style>
</head>
<body>
  <div class="status-card">
    <div style="font-size:42px;">⚡</div>
    <h1>Runner API is Active</h1>
    <p>
      You opened the backend API endpoint directly in your browser.
      To explore the labs, view screenshots, and execute JavaScript interactively, open the Laboratory Portal:
    </p>
    <a href="/" class="primary" style="display:inline-block; margin-bottom:12px;">← Go to Laboratory Portal</a>
    <div><a href="/labs/lab01.html" class="secondary" style="display:inline-block; font-size:13px;">Or Open Lab 01 Interactive Page →</a></div>
  </div>
</body>
</html>`, 'text/html; charset=utf-8');
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
      let payload;
      try {
        payload = JSON.parse(body || '{}');
      } catch {
        return sendJSON(res, 400, { error: 'Invalid JSON payload' });
      }

      const labFolder = payload.lab;
      const file = payload.file;

      if (!labFolder || !file) {
        return sendJSON(res, 400, { error: 'Missing lab or file parameter' });
      }

      // Security check: only allow Lab-XX folders and .js files
      if (!/^Lab-\d+$/i.test(labFolder) || !/^[a-zA-Z0-9_\-.]+\.js$/i.test(file)) {
        return sendJSON(res, 400, { error: 'Unauthorized path or filename' });
      }

      const filePath = path.join(ROOT, labFolder, file);
      if (!fs.existsSync(filePath)) {
        return sendJSON(res, 404, { error: `File not found: ${file}` });
      }

      const startTime = Date.now();
      execFile(process.execPath, [filePath], {
        timeout: 7000,
        cwd: path.dirname(filePath),
        maxBuffer: 1024 * 1024
      }, (error, stdout, stderr) => {
        const duration = Date.now() - startTime;
        return sendJSON(res, 200, {
          ok: !error,
          output: stdout || '',
          error: stderr || (error ? error.message : ''),
          duration
        });
      });
    });
    return;
  }
}

  // API: Server route testing endpoint
  const routeApiMatch = pathname.match(/^\/api\/route\/(\d{1,2})(\/.*)?$/);
  if (routeApiMatch) {
    const labNum = String(routeApiMatch[1]).padStart(2, '0');
    const subRoute = routeApiMatch[2] || '/';
    return handleLabServerRoute(labNum, subRoute, res);
  }

  // API: Lab metadata
  if (pathname === '/api/health') {
    return sendJSON(res, 200, {
      status: 'online',
      server: 'Node.js Lab Portal Runner',
      student: 'Rishabh Khatiwada',
      scholarNo: '23145018',
      uptime: Math.floor(process.uptime())
    });
  }

  // Static File Serving
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  let fullPath = path.join(ROOT, relativePath);

  // Prevent directory traversal
  if (!fullPath.startsWith(ROOT)) {
    return sendJSON(res, 403, { error: 'Forbidden' });
  }

  // If path is a directory, check for index.html
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    fullPath = path.join(fullPath, 'index.html');
  }

  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    return sendText(res, 404, `404 Not Found: ${pathname}`);
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(fullPath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`⬢ Node.js Laboratory Portal is LIVE!`);
  console.log(`👉 Open this URL in your browser: http://localhost:${PORT}`);
  console.log(`Student: Rishabh Khatiwada (Scholar No: 23145018)`);
  console.log(`======================================================\n`);
});
