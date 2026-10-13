const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const LABS_OUTPUT = path.join(ROOT, 'labs');
const INDEX_FILE = path.join(ROOT, 'index.html');

const START_MARKER = '<!-- AUTO-LABS-START -->';
const END_MARKER = '<!-- AUTO-LABS-END -->';

const knownLabs = {
  1: {
    title: 'Node.js Basics',
    description: 'Introduction to Node.js, npm, first program, console, variables and data types.',
    emoji: '🟢',
    type: 'script'
  },
  2: {
    title: 'HTTP Server',
    description: 'HTTP module, server creation, routing and request-response handling.',
    emoji: '🌐',
    type: 'server',
    routes: ['/', '/about', '/college', '/profile']
  },
  3: {
    title: 'Student Directory Server',
    description: 'A Node.js server for displaying student information using different routes.',
    emoji: '👨‍🎓',
    type: 'server',
    routes: ['/', '/students', '/students/23145006', '/students/9999']
  },
  4: {
    title: 'Advanced Server & Filters',
    description: 'Student records, routing, filtering and server-side operations using Node.js.',
    emoji: '⚙️',
    type: 'server',
    routes: ['/', '/students', '/students/marks/80', '/students/marks/90']
  },
  5: {
    title: 'Asynchronous Node.js',
    description: 'Simulating Food Delivery Tracker with callbacks, Promises, async/await and concurrency.',
    emoji: '⚡',
    type: 'script'
  },
  6: {
    title: 'File System & CLI Notes',
    description: 'File-system operations, synchronous/asynchronous file handling and CLI Notes app.',
    emoji: '📝',
    type: 'script'
  },
  7: {
    title: 'EventEmitter & Events',
    description: 'Node.js events, EventEmitter, listeners, order tracking and event-driven architecture.',
    emoji: '📡',
    type: 'script'
  },
  8: {
    title: 'Integrated Lab Server',
    description: 'A unified portal bringing previous Node.js practical labs together with live execution.',
    emoji: '🚀',
    type: 'server',
    routes: ['/health', '/about', '/labs', '/api/dashboard']
  }
};

function escapeHTML(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function discoverLabs() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const match = entry.name.match(/^Lab-(\d+)$/i);
      if (!match) return null;

      return {
        id: Number(match[1]),
        folder: entry.name
      };
    })
    .filter(lab => lab && lab.id > 0)
    .sort((a, b) => a.id - b.id);
}

function getFiles(folder) {
  const folderPath = path.join(ROOT, folder);
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  const codeFiles = entries
    .filter(entry => entry.isFile() && /\.js$/i.test(entry.name))
    .map(entry => entry.name)
    .sort();

  const images = entries
    .filter(entry =>
      entry.isFile() &&
      /\.(png|jpe?g|gif|webp)$/i.test(entry.name)
    )
    .map(entry => entry.name)
    .sort();

  return { codeFiles, images };
}

function getCleanDescription(readme, defaultDesc) {
  if (!readme) return defaultDesc;

  const paragraphs = readme
    .replace(/^#+.*$/gm, '')
    .split(/\n\s*\n/)
    .map(p => p.replace(/\s+/g, ' ').trim())
    .filter(p => {
      if (!p) return false;
      if (/^[-*]?\s*\*\*?(Name|Scholar|Course|Semester|Subject|Lab Number|Date|College|Node-Version):/i.test(p)) return false;
      if (p.length < 15) return false;
      return true;
    });

  return paragraphs[0] || defaultDesc;
}

function getInfo(lab) {
  const defaults = knownLabs[lab.id] || {};
  
  // Look for README with case-insensitive matching
  const folderPath = path.join(ROOT, lab.folder);
  const dirFiles = fs.readdirSync(folderPath);
  const readmeFile = dirFiles.find(f => /^readme\.md$/i.test(f));
  
  let readme = '';
  if (readmeFile) {
    readme = fs.readFileSync(path.join(folderPath, readmeFile), 'utf8');
  }

  const heading = readme.match(/^#\s+(.+)$/m);
  const title = heading?.[1]?.trim() || defaults.title || `Lab ${String(lab.id).padStart(2, '0')}`;
  const description = defaults.description || getCleanDescription(readme, `Practical programs and source code for ${lab.folder}.`);

  return {
    ...lab,
    title,
    description,
    emoji: defaults.emoji || '💻',
    type: defaults.type || 'script',
    routes: defaults.routes || [],
    readmeContent: readme,
    ...getFiles(lab.folder)
  };
}

function createLabPage(lab) {
  const labIdFormatted = String(lab.id).padStart(2, '0');
  
  // Read all source code files into JSON for client runner
  const codeFilesData = {};
  for (const file of lab.codeFiles) {
    const filePath = path.join(ROOT, lab.folder, file);
    try {
      codeFilesData[file] = fs.readFileSync(filePath, 'utf8');
    } catch {
      codeFilesData[file] = `// Unable to read ${file}`;
    }
  }

  // Generate Screenshot Cards HTML
  let screenshotsHTML = '';
  if (lab.images.length) {
    screenshotsHTML = `
      <div class="gallery-grid">
        ${lab.images.map(image => {
          const imageURL = `../${encodeURIComponent(lab.folder)}/${encodeURIComponent(image)}`;
          return `
            <div class="gallery-card" onclick="openLightbox('${imageURL}', '${escapeHTML(image)}')">
              <div class="gallery-img-wrap">
                <img src="${imageURL}" alt="${escapeHTML(image)}" loading="lazy">
                <span class="zoom-hint">🔍 Click to zoom</span>
              </div>
              <div class="gallery-caption">${escapeHTML(image)}</div>
            </div>`;
        }).join('')}
      </div>`;
  } else {
    screenshotsHTML = `
      <div style="background:var(--bg-card); border:1px dashed var(--line); border-radius:16px; padding:40px; text-align:center; color:var(--muted); margin-top:20px;">
        <span style="font-size:32px; display:block; margin-bottom:10px;">📸</span>
        <strong>No image screenshots found for this lab.</strong>
        <p style="font-size:13px; margin-top:6px;">All execution outputs can be generated live in the terminal above.</p>
      </div>`;
  }

  // Route Explorer for Server Labs
  let routeExplorerHTML = '';
  if (lab.type === 'server' && lab.routes && lab.routes.length) {
    routeExplorerHTML = `
      <div class="route-tester-box">
        <h3><span>🌐</span> Interactive Server & API Route Explorer</h3>
        <p style="color:var(--muted); font-size:13.5px; margin-bottom:16px;">
          Test simulated HTTP endpoints for this server lab. Click any route below to view live server response:
        </p>
        <div class="route-chips">
          ${lab.routes.map(r => `
            <button class="route-chip" onclick="testRoute('${labIdFormatted}', '${r}')">
              <span class="method">GET</span>
              <span>${escapeHTML(r)}</span>
            </button>
          `).join('')}
        </div>
        <div class="response-card">
          <div class="response-header">
            <span id="res-route-indicator">Ready to test route</span>
            <span id="res-status-badge" class="status-badge status-200" style="display:none;">200 OK</span>
          </div>
          <pre class="response-body" id="res-output">// Click a route above to execute HTTP request</pre>
        </div>
      </div>`;
  }

  // File Selector Options
  const fileSelectOptions = lab.codeFiles.map((f, i) => `
    <option value="${escapeHTML(f)}" ${i === 0 ? 'selected' : ''}>${escapeHTML(f)}</option>
  `).join('');

  // Initial code content for the first file
  const firstFileName = lab.codeFiles[0] || 'No JavaScript file';
  const firstFileSource = codeFilesData[firstFileName] || '// No JavaScript code available in this folder.';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lab ${labIdFormatted} | ${escapeHTML(lab.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../style.css">
</head>
<body>

  <!-- ================= TOP NAVIGATION ================= -->
  <nav class="nav">
    <a href="../index.html" class="logo">
      <span>⬢</span> Node.js Lab Portal
    </a>
    <div class="nav-links">
      <a href="../index.html">← Back to Portal</a>
      <a href="../index.html#labs">All Labs</a>
      <a href="https://github.com/reshabkhatiwada84-wq/nodejs-lab" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
    </div>
  </nav>

  <main class="lab-container">

    <!-- ================= LAB HEADER ================= -->
    <div class="lab-header-card">
      <a href="../index.html#labs" class="back-btn">← Back to Explore Labs</a>
      <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
        <span class="badge">
          <span class="badge-dot"></span>
          LABORATORY ${labIdFormatted}
        </span>
        <span class="card-tag ${lab.type}">${lab.type === 'server' ? '🌐 HTTP SERVER LAB' : '🟢 SCRIPT LAB'}</span>
      </div>
      <h1>${escapeHTML(lab.emoji)} ${escapeHTML(lab.title)}</h1>
      <p class="desc">${escapeHTML(lab.description)}</p>
    </div>

    <!-- ================= TABS NAVIGATION ================= -->
    <div class="tabs-nav">
      <button class="tab-btn active" onclick="switchTab('tab-runner')">
        <span>💻</span> Code & Interactive Runner
      </button>
      <button class="tab-btn" onclick="switchTab('tab-screenshots')">
        <span>🖼</span> Screenshots & Outputs (${lab.images.length})
      </button>
      ${lab.readmeContent ? `
      <button class="tab-btn" onclick="switchTab('tab-readme')">
        <span>📖</span> Lab Documentation
      </button>` : ''}
    </div>

    <!-- ================= TAB 1: RUNNER & SOURCE CODE ================= -->
    <div id="tab-runner" class="tab-panel active">

      <!-- INTERACTIVE TERMINAL -->
      <div class="terminal-box">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>

          <div class="terminal-title">
            <span>bash</span> — <strong id="active-filename-display">${escapeHTML(firstFileName)}</strong>
          </div>

          <div class="terminal-actions">
            ${lab.codeFiles.length > 1 ? `
            <div class="file-select-wrap">
              <label for="codeFileSelect" style="font-size:11px; color:var(--muted); font-family:var(--font-mono);">File:</label>
              <select id="codeFileSelect" class="file-select" onchange="onFileChange(this.value)">
                ${fileSelectOptions}
              </select>
            </div>` : ''}

            <button class="run-btn" id="runCodeBtn" onclick="runCurrentCode()">
              <span id="run-icon">▶</span>
              <span id="run-text">Run Code</span>
            </button>
            <button class="clear-btn" onclick="clearTerminal()">Clear</button>
          </div>
        </div>

        <div class="terminal-body" id="terminal-body">
          <div class="terminal-output" id="terminal-output"><span class="log-dim">// Click "▶ Run Code" above to execute this script in real time.
// Output, timestamps, and console logs will appear here.</span></div>
        </div>

        <div class="terminal-status-bar">
          <div class="status-pill">
            <span class="status-indicator ready" id="status-indicator"></span>
            <span id="status-text">Ready</span>
          </div>
          <span id="execution-time-text">Time: 0ms</span>
        </div>
      </div>

      ${routeExplorerHTML}

      <!-- SOURCE CODE VIEWER -->
      <div class="code-wrapper">
        <div class="code-top-bar">
          <span class="code-title">
            <span>📄</span>
            <span id="code-viewer-title">${escapeHTML(firstFileName)}</span>
          </span>
          <button class="copy-btn" id="copyCodeBtn" onclick="copyCurrentCode()">📋 Copy Code</button>
        </div>
        <pre><code id="source-code-display">${escapeHTML(firstFileSource)}</code></pre>
      </div>

    </div>

    <!-- ================= TAB 2: SCREENSHOTS GALLERY ================= -->
    <div id="tab-screenshots" class="tab-panel">
      <h2 style="font-family:var(--font-display); font-size:24px; margin-bottom:8px;">Outputs and Visual Proofs</h2>
      <p style="color:var(--muted); font-size:14px; margin-bottom:20px;">
        High-resolution screenshots captured during lab execution and terminal tests. Click any image to view in full size.
      </p>
      ${screenshotsHTML}
    </div>

    ${lab.readmeContent ? `
    <!-- ================= TAB 3: README / NOTES ================= -->
    <div id="tab-readme" class="tab-panel">
      <div class="lab-header-card" style="margin-top:20px;">
        <h2 style="font-family:var(--font-display); font-size:24px; margin-bottom:16px;">Lab Documentation & Assignment Notes</h2>
        <pre style="white-space:pre-wrap; font-family:var(--font-mono); font-size:13.5px; color:#c7dbd0; line-height:1.7;">${escapeHTML(lab.readmeContent)}</pre>
      </div>
    </div>` : ''}

  </main>

  <!-- ================= LIGHTBOX MODAL ================= -->
  <div class="lightbox-modal" id="lightboxModal" onclick="closeLightbox(event)">
    <div class="lightbox-content">
      <button class="lightbox-close" onclick="closeLightbox(null)">✕</button>
      <img id="lightboxImg" src="" alt="Zoomed screenshot">
      <div class="lightbox-caption" id="lightboxCaption"></div>
    </div>
  </div>

  <footer>
    <strong>Node.js Laboratory Portal</strong>
    <span>BCA VII Semester • Rishabh Khatiwada (Scholar No. 23145018)</span>
  </footer>

  <!-- ================= EMBEDDED LAB RUNNER SCRIPT ================= -->
  <script>
    const LAB_FOLDER = "${escapeHTML(lab.folder)}";
    const LAB_ID = "${labIdFormatted}";
    const codeFiles = ${JSON.stringify(codeFilesData)};
    let currentFileName = "${escapeHTML(firstFileName)}";

    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      
      const targetPanel = document.getElementById(tabId);
      if (targetPanel) targetPanel.classList.add('active');
      
      event.currentTarget.classList.add('active');
    }

    function onFileChange(newFile) {
      currentFileName = newFile;
      document.getElementById('active-filename-display').textContent = newFile;
      document.getElementById('code-viewer-title').textContent = newFile;
      
      const code = codeFiles[newFile] || '// File not found';
      document.getElementById('source-code-display').textContent = code;
    }

    function clearTerminal() {
      document.getElementById('terminal-output').innerHTML = '<span class="log-dim">// Terminal cleared. Ready for execution.</span>';
      document.getElementById('status-text').textContent = 'Ready';
      document.getElementById('status-indicator').className = 'status-indicator ready';
      document.getElementById('execution-time-text').textContent = 'Time: 0ms';
    }

    function copyCurrentCode() {
      const code = codeFiles[currentFileName] || '';
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyCodeBtn');
        const orig = btn.textContent;
        btn.textContent = '✓ Copied!';
        btn.style.borderColor = 'var(--green)';
        btn.style.color = 'var(--green)';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      });
    }

    // Lightbox functions
    function openLightbox(url, caption) {
      const modal = document.getElementById('lightboxModal');
      const img = document.getElementById('lightboxImg');
      const cap = document.getElementById('lightboxCaption');
      img.src = url;
      cap.textContent = caption;
      modal.classList.add('active');
    }

    function closeLightbox(e) {
      if (!e || e.target.id === 'lightboxModal' || e.target.classList.contains('lightbox-close')) {
        document.getElementById('lightboxModal').classList.remove('active');
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('lightboxModal').classList.remove('active');
      }
    });

    // Interactive Route Tester for Server Labs
    async function testRoute(labId, routePath) {
      const ind = document.getElementById('res-route-indicator');
      const badge = document.getElementById('res-status-badge');
      const out = document.getElementById('res-output');

      ind.textContent = 'Requesting: GET ' + routePath + '...';
      badge.style.display = 'none';
      out.textContent = 'Sending HTTP request to server...';

      try {
        const res = await fetch('/api/route/' + labId + routePath);
        const contentType = res.headers.get('content-type') || '';
        let body;
        
        if (contentType.includes('application/json')) {
          const json = await res.json();
          body = JSON.stringify(json, null, 2);
        } else {
          body = await res.text();
        }

        ind.textContent = 'GET ' + routePath;
        badge.style.display = 'inline-block';
        badge.className = 'status-badge ' + (res.status === 200 ? 'status-200' : 'status-404');
        badge.textContent = res.status + ' ' + (res.status === 200 ? 'OK' : 'Not Found');
        out.textContent = body;
      } catch (err) {
        // Fallback simulation if running without live server
        ind.textContent = 'GET ' + routePath + ' (Simulated)';
        badge.style.display = 'inline-block';
        badge.className = 'status-badge status-200';
        badge.textContent = '200 OK (Client Shim)';
        
        if (routePath === '/' || routePath === '/about') {
          out.textContent = 'Response from Lab ' + labId + ' server for route: ' + routePath;
        } else if (routePath.includes('students')) {
          out.textContent = JSON.stringify({
            message: "Student records response",
            lab: labId,
            route: routePath,
            timestamp: new Date().toISOString()
          }, null, 2);
        } else {
          out.textContent = 'HTTP/1.1 200 OK\\nRoute: ' + routePath;
        }
      }
    }

    // Live Execution Engine
    async function runCurrentCode() {
      const btn = document.getElementById('runCodeBtn');
      const icon = document.getElementById('run-icon');
      const text = document.getElementById('run-text');
      const out = document.getElementById('terminal-output');
      const statusInd = document.getElementById('status-indicator');
      const statusTxt = document.getElementById('status-text');
      const timeTxt = document.getElementById('execution-time-text');

      btn.disabled = true;
      icon.textContent = '⏳';
      text.textContent = 'Running...';
      statusInd.className = 'status-indicator running';
      statusTxt.textContent = 'Executing...';
      
      out.innerHTML = '<span class="log-dim">$ node ' + currentFileName + '</span>\\n';

      const startTime = performance.now();

      // 1. Try Backend Node Runner (/api/run)
      try {
        const response = await fetch('/api/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lab: LAB_FOLDER,
            file: currentFileName
          })
        });

        if (response.ok) {
          const result = await response.json();
          const elapsed = Math.round(result.duration || (performance.now() - startTime));
          timeTxt.textContent = 'Time: ' + elapsed + 'ms';

          if (result.output) {
            out.innerHTML += '<span class="log-stdout">' + escapeClient(result.output) + '</span>';
          }
          if (result.error) {
            out.innerHTML += '<span class="log-stderr">' + escapeClient(result.error) + '</span>';
          }

          statusInd.className = 'status-indicator ' + (result.ok ? 'ready' : 'error');
          statusTxt.textContent = result.ok ? 'Finished (Exit 0)' : 'Error (Exit 1)';
          resetRunButton();
          return;
        }
      } catch (backendErr) {
        // Backend not reached, fall back to browser sandbox
      }

      // 2. Browser Sandbox Fallback Runner
      runInBrowserSandbox();
    }

    function runInBrowserSandbox() {
      const out = document.getElementById('terminal-output');
      const statusInd = document.getElementById('status-indicator');
      const statusTxt = document.getElementById('status-text');
      const timeTxt = document.getElementById('execution-time-text');
      const startTime = performance.now();

      const rawCode = codeFiles[currentFileName] || '';
      
      // Sandbox mocks for Node modules
      let logs = [];
      const customConsole = {
        log: (...args) => {
          logs.push({ type: 'stdout', msg: args.map(formatArg).join(' ') });
        },
        error: (...args) => {
          logs.push({ type: 'error', msg: args.map(formatArg).join(' ') });
        },
        warn: (...args) => {
          logs.push({ type: 'warn', msg: args.map(formatArg).join(' ') });
        },
        info: (...args) => {
          logs.push({ type: 'info', msg: args.map(formatArg).join(' ') });
        }
      };

      function formatArg(arg) {
        if (typeof arg === 'object' && arg !== null) {
          try { return JSON.stringify(arg, null, 2); } catch { return String(arg); }
        }
        return String(arg);
      }

      // EventEmitter Browser Shim
      class BrowserEventEmitter {
        constructor() { this._events = {}; }
        on(event, listener) {
          (this._events[event] = this._events[event] || []).push(listener);
          return this;
        }
        once(event, listener) {
          const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
          };
          return this.on(event, wrapper);
        }
        emit(event, ...args) {
          const list = (this._events[event] || []).slice();
          list.forEach(fn => fn(...args));
          return list.length > 0;
        }
        off(event, listener) {
          if (this._events[event]) {
            this._events[event] = this._events[event].filter(fn => fn !== listener);
          }
          return this;
        }
      }

      // Virtual in-memory FS
      const virtualFS = {
        'sample.txt': 'Welcome to Node.js File System!',
        'notes.txt': '1. Learn Node.js\\n2. Build Practical Labs\\n3. Deploy Server',
        'output.txt': 'Previous output content'
      };

      const mockFS = {
        readFileSync: (file) => virtualFS[file] || 'Sample content of ' + file,
        readFile: (file, enc, cb) => {
          const callback = typeof enc === 'function' ? enc : cb;
          setTimeout(() => callback(null, virtualFS[file] || 'Content of ' + file), 10);
        },
        writeFileSync: (file, data) => { virtualFS[file] = data; },
        writeFile: (file, data, cb) => {
          virtualFS[file] = data;
          if (cb) setTimeout(() => cb(null), 10);
        },
        appendFileSync: (file, data) => { virtualFS[file] = (virtualFS[file] || '') + data; },
        appendFile: (file, data, cb) => {
          virtualFS[file] = (virtualFS[file] || '') + data;
          if (cb) setTimeout(() => cb(null), 10);
        },
        unlinkSync: (file) => { delete virtualFS[file]; },
        unlink: (file, cb) => {
          delete virtualFS[file];
          if (cb) setTimeout(() => cb(null), 10);
        }
      };

      const mockRequire = (mod) => {
        if (mod === 'events') return BrowserEventEmitter;
        if (mod === 'fs') return mockFS;
        if (mod === 'path') return { join: (...args) => args.join('/'), resolve: (...args) => args.join('/') };
        if (mod === 'http') return { createServer: () => ({ listen: (p, cb) => { customConsole.log('Server started on port', p); if(cb) cb(); } }) };
        return {};
      };

      try {
        // Transform Node code for browser execution
        const wrappedCode = \`(async function(console, require, EventEmitter) {
          \${rawCode}
        })\`;
        
        const fn = eval(wrappedCode);
        fn(customConsole, mockRequire, BrowserEventEmitter)
          .then(() => {
            const elapsed = Math.round(performance.now() - startTime);
            timeTxt.textContent = 'Time: ' + elapsed + 'ms';
            renderLogs(logs);
            statusInd.className = 'status-indicator ready';
            statusTxt.textContent = 'Executed (Browser Sandbox)';
            resetRunButton();
          })
          .catch(err => {
            logs.push({ type: 'error', msg: 'Runtime Error: ' + err.message });
            renderLogs(logs);
            statusInd.className = 'status-indicator error';
            statusTxt.textContent = 'Error';
            resetRunButton();
          });
      } catch (compileErr) {
        logs.push({ type: 'error', msg: 'Execution Error: ' + compileErr.message });
        renderLogs(logs);
        statusInd.className = 'status-indicator error';
        statusTxt.textContent = 'Syntax/Compile Error';
        resetRunButton();
      }
    }

    function renderLogs(logs) {
      const out = document.getElementById('terminal-output');
      if (!logs.length) {
        out.innerHTML += '<span class="log-stdout">// Code executed with no standard console output.</span>\\n';
        return;
      }
      for (const item of logs) {
        const cls = item.type === 'error' ? 'log-error' : item.type === 'warn' ? 'log-warn' : item.type === 'info' ? 'log-info' : 'log-stdout';
        out.innerHTML += '<span class="' + cls + '">' + escapeClient(item.msg) + '</span>\\n';
      }
    }

    function escapeClient(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function resetRunButton() {
      const btn = document.getElementById('runCodeBtn');
      document.getElementById('run-icon').textContent = '▶';
      document.getElementById('run-text').textContent = 'Run Code';
      btn.disabled = false;
    }
  </script>
</body>
</html>`;

  const output = path.join(LABS_OUTPUT, `lab${labIdFormatted}.html`);
  fs.writeFileSync(output, html, 'utf8');
}

function createCards(labs) {
  return labs.map(lab => {
    const labIdFormatted = String(lab.id).padStart(2, '0');
    const isServer = lab.type === 'server';
    const tagText = isServer ? '🌐 HTTP SERVER' : '🟢 SCRIPT LAB';
    const tagClass = isServer ? 'server' : 'script';

    return `
        <article class="card">
          <div class="card-top">
            <span class="card-num">${labIdFormatted}</span>
            <span class="card-tag ${tagClass}">${tagText}</span>
          </div>
          <div class="emoji">${escapeHTML(lab.emoji)}</div>
          <h3>${escapeHTML(lab.title)}</h3>
          <p>${escapeHTML(lab.description)}</p>
          <div class="card-footer">
            <a href="labs/lab${labIdFormatted}.html">
              Open Lab →
            </a>
            <span class="pill-run">▶ Run in Web</span>
          </div>
        </article>`;
  }).join('\n');
}

function updateHomepage(labs) {
  let html = fs.readFileSync(INDEX_FILE, 'utf8');

  const start = html.indexOf(START_MARKER);
  const end = html.indexOf(END_MARKER);

  if (start === -1 || end === -1 || end < start) {
    throw new Error('Lab markers missing in index.html. Check AUTO-LABS-START and AUTO-LABS-END.');
  }

  html =
    html.slice(0, start + START_MARKER.length) +
    '\n' + createCards(labs) + '\n        ' +
    html.slice(end);

  fs.writeFileSync(INDEX_FILE, html, 'utf8');
}

function main() {
  fs.mkdirSync(LABS_OUTPUT, { recursive: true });

  const labs = discoverLabs().map(getInfo);

  for (const lab of labs) {
    createLabPage(lab);
    console.log(`Generated Lab ${String(lab.id).padStart(2, '0')}: ${lab.title}`);
  }

  updateHomepage(labs);

  console.log(`\nSuccess! Generated ${labs.length} interactive lab pages.`);
  console.log('Homepage cards, runners, and screenshot galleries updated.');
}

try {
  main();
} catch (error) {
  console.error('\nLab generation failed:', error.message);
  process.exitCode = 1;
}
