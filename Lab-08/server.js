const { logger } = require('./modules/logger');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const slugify = require('slugify');
const labs = require('./labs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

function send(res, status, data, contentType = 'application/json') {
    res.writeHead(status, { 'Content-Type': `${contentType}; charset=utf-8` });
    res.end(
        contentType.includes('application/json')
            ? JSON.stringify(data, null, 2)
            : data
    );
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function findLab(id) {
    return labs.find(lab => lab.id === id);
}

function getLabFile(lab, filename) {
    if (!lab.files.includes(filename) || path.basename(filename) !== filename) {
        return null;
    }

    const fullPath = path.resolve(ROOT_DIR, lab.folder, filename);
    const labPath = path.resolve(ROOT_DIR, lab.folder) + path.sep;

    return fullPath.startsWith(labPath) && fs.existsSync(fullPath)
        ? fullPath
        : null;
}

// Lab-02 route handling
function handleLab02(pathname, res) {
    if (pathname === '/' || pathname === '/about' ||
        pathname === '/college' || pathname === '/profile') {

        if (pathname === '/') {
            return send(res, 200, 'Welcome to my Node.js HTTP Server\nName: Rishabh Khatiwada\nLab Assignment: 02', 'text/plain');
        }

        if (pathname === '/about') {
            return send(res, 200, 'About: BCA VII Semester, Dev Sanskriti Vishwavidyalaya.', 'text/plain');
        }

        if (pathname === '/college') {
            return send(res, 200, 'Dev Sanskriti Vishwavidyalaya - Computer Science - BCA VII Semester', 'text/plain');
        }

        return send(res, 200, {
            name: 'Rishabh Khatiwada',
            scholarNumber: '23145018',
            course: 'BCA VII',
            semester: '7th',
            college: 'Dev Sanskriti Vishwavidyalaya',
            subject: 'CS403NOD - Node.js'
        });
    }

    return send(res, 404, { error: 'Lab-02 route not found', path: pathname });
}

// Lab-03 student data and routes
const students = [
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

function handleLab03(pathname, res) {
    if (pathname === '/') {
        return send(res, 200, 'Welcome to Student Directory Server', 'text/plain');
    }

    if (pathname === '/students') {
        return send(res, 200, students);
    }

    const match = pathname.match(/^\/students\/(\d+)$/) ||
                  pathname.match(/^\/(\d+)$/);

    if (match) {
        const student = students.find(s => s.id === Number(match[1]));
        return student
            ? send(res, 200, student)
            : send(res, 404, { error: 'Student not found' });
    }

    if (pathname.startsWith('/students/')) {
        return send(res, 400, { error: 'Student ID must be a number' });
    }

    return send(res, 404, { error: 'Route not found' });
}

// Lab-04 student data and routes
const advancedStudents = [
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

function handleLab04(pathname, res) {
    if (pathname === '/') {
        return send(res, 200, 'Welcome to Advanced Node.js Server', 'text/plain');
    }

    if (pathname === '/students') {
        return send(res, 200, advancedStudents);
    }

    if (pathname.startsWith('/students/marks/')) {
        const value = pathname.split('/')[3];

        if (value === undefined || value.trim() === '' || !Number.isFinite(Number(value))) {
            return send(res, 400, { error: 'Provide a valid marks threshold' });
        }

        return send(res, 200,
            advancedStudents.filter(student => student.marks > Number(value)));
    }

    if (pathname.startsWith('/students/')) {
        const course = pathname.split('/')[2];

        return send(res, 200, advancedStudents.filter(
            student => student.course.toLowerCase() === course.toLowerCase()
        ));
    }

    return send(res, 404, { error: 'Route not found' });
}

const server = http.createServer(async (req, res) => {
    const requestURL = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = requestURL.pathname;

   logger.emit('request', req.method, req.url);

    if (req.method !== 'GET') {
        return send(res, 405, { error: 'Only GET requests are supported' });
    }

    if (pathname === '/') {
        const links = labs.map(lab =>
            `<li><a href="/labs/${lab.id}">Lab ${lab.id}: ${escapeHTML(lab.title)}</a></li>`
        ).join('');

        return send(res, 200, `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Integrated Node.js Lab Portal</title></head>
<body style="font-family:Arial;max-width:850px;margin:40px auto">
<h1>Integrated Node.js Lab Portal</h1>
<p>Name: Rishabh Khatiwada | Course: BCA VII Semester</p>
<p>Environment: ${process.env.RENDER ? 'Live (Render)' : 'Local'}</p>
<h2>Available Labs</h2><ul>${links}</ul>
<p><a href="/labs">JSON Lab Registry</a> | <a href="/health">Health</a> | <a href="/about">About</a></p>
</body></html>`, 'text/html');
    }

    if (pathname === '/health') {
        return send(res, 200, {
            status: 'ok',
            environment: process.env.RENDER ? 'live (Render)' : 'local',
            uptimeSeconds: Math.floor(process.uptime())
        });
    }

    if (pathname === '/about') {
        return send(res, 200, {
            project: 'Lab-08 Integrated Node.js Server',
            student: process.env.STUDENT_NAME || 'Rishabh Khatiwada',
            labs: labs.length
        });
    }

    if (pathname === '/labs') {
        return send(res, 200, labs.map(lab => ({
            ...lab,
            slug: slugify(lab.title, { lower: true, strict: true })
        })));
    }

   
if (pathname === '/api/dashboard') {
    const logsDir = path.join(__dirname, 'logs');
    const screenshotsDir = path.join(__dirname, 'public', 'screenshots');
    const logFile = path.join(logsDir, 'server.log');

    let requestsLogged = 0;
    let screenshots = [];

    try {
        if (fs.existsSync(logFile)) {
            const logContent = await fs.promises.readFile(logFile, 'utf8');

            requestsLogged = logContent
                .split(/\r?\n/)
                .filter(line => line.trim() !== '')
                .length;
        }

        if (fs.existsSync(screenshotsDir)) {
            screenshots = (await fs.promises.readdir(screenshotsDir))
                .filter(file => /\.(png|jpe?g)$/i.test(file));
        }

        return send(res, 200, {
            labs: labs.length,
            screenshots: screenshots.length,
            screenshotFiles: screenshots,
            requestsLogged
        });
    } catch (error) {
        return send(res, 500, {
            error: 'Unable to load dashboard data',
            message: error.message
        });
    }
}


    const match = pathname.match(/^\/labs\/(\d{2})(?:\/(run|app)(\/.*)?)?$/);

    if (match) {
        const [, id, action, rest = '/'] = match;
        const lab = findLab(id);

        if (!lab) {
            return send(res, 404, { error: 'Lab not found', id });
        }

        if (action === 'run') {
            if (lab.type !== 'script') {
                return send(res, 400, { error: 'This lab is a server lab, not a script lab.' });
            }

            const filename = lab.files.find(file => file.endsWith('.js'));

            if (!filename) {
                return send(res, 404, { error: 'No JavaScript file found for this lab' });
            }

            const filePath = getLabFile(lab, filename);

            if (!filePath) {
                return send(res, 404, { error: 'Lab file not found' });
            }

            return execFile(process.execPath, [filePath], {
                timeout: 5000,
                cwd: path.dirname(filePath),
                maxBuffer: 1024 * 1024
            }, (error, stdout, stderr) => {
                send(res, 200, {
                    ok: !error,
                    output: stdout,
                    error: stderr || (error ? error.message : '')
                });
            });
        }

        if (action === 'app') {
            const subPath = rest === '/' ? '/' : rest;

            if (id === '02') return handleLab02(subPath, res);
            if (id === '03') return handleLab03(subPath, res);
            if (id === '04') return handleLab04(subPath, res);

            return send(res, 400, { error: 'This lab does not expose HTTP routes.' });
        }

        const filesHTML = lab.files.map(file =>
            `<li><a href="/labs/${id}/source/${encodeURIComponent(file)}">${escapeHTML(file)}</a></li>`
        ).join('');

        return send(res, 200, `<!doctype html>
<html><head><meta charset="utf-8"><title>Lab ${id}</title></head>
<body style="font-family:Arial;max-width:850px;margin:40px auto">
<h1>Lab ${id}: ${escapeHTML(lab.title)}</h1>
<p>Topic: ${escapeHTML(lab.topic)}</p>
<p>Type: ${escapeHTML(lab.type)}</p>
<h2>JavaScript Files</h2><ul>${filesHTML}</ul>

<h2>Screenshots</h2>
<div style="display:flex;flex-wrap:wrap;gap:16px">
${(lab.screenshots || []).map(file => `
    <figure style="margin:0;max-width:320px">
        <a href="/screenshots/${encodeURIComponent(file)}" target="_blank">
            <img
                src="/screenshots/${encodeURIComponent(file)}"
                alt="${escapeHTML(file)}"
                style="width:100%;height:auto;border:1px solid #ccc;border-radius:8px"
            >
        </a>
        <figcaption>${escapeHTML(file)}</figcaption>
    </figure>
`).join('')}
</div>

<p><a href="/labs/${id}/run">Run this lab</a></p>
${lab.type === 'server' ? `<p><a href="/labs/${id}/app/">Open integrated server routes</a></p>` : ''}
<p><a href="/">Back to portal</a></p>
</body></html>`, 'text/html');
    }

    const sourceMatch = pathname.match(/^\/labs\/(\d{2})\/source\/([^/]+)$/);

    if (sourceMatch) {
        const lab = findLab(sourceMatch[1]);

        if (!lab) return send(res, 404, { error: 'Lab not found' });

        let filename;
        try {
            filename = decodeURIComponent(sourceMatch[2]);
        } catch {
            return send(res, 400, { error: 'Invalid filename' });
        }

        const filePath = getLabFile(lab, filename);
        if (!filePath) return send(res, 404, { error: 'Source file not found' });

        const code = fs.readFileSync(filePath, 'utf8');
        return send(res, 200,
            `<html><head><meta charset="utf-8"><title>${escapeHTML(filename)}</title></head><body style="font-family:Arial;margin:30px"><h2>${escapeHTML(filename)}</h2><pre style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHTML(code)}</pre><p><a href="/labs/${lab.id}">Back to lab</a></p></body></html>`,
            'text/html'
        );
    }

  
const screenshotMatch = pathname.match(/^\/screenshots\/([^/]+)$/);

if (screenshotMatch) {
    const filename = path.basename(screenshotMatch[1]);

    if (!/\.(png|jpe?g)$/i.test(filename)) {
        return send(res, 400, { error: 'Invalid image type' });
    }

    const imagePath = path.join(
        __dirname,
        'public',
        'screenshots',
        filename
    );

    if (!fs.existsSync(imagePath)) {
        return send(res, 404, { error: 'Screenshot not found' });
    }

    const contentType = /\.png$/i.test(filename)
        ? 'image/png'
        : 'image/jpeg';

    res.writeHead(200, { 'Content-Type': contentType });
    return fs.createReadStream(imagePath).pipe(res);
}
  

    return send(res, 404, { error: 'Route not found', path: pathname });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Integrated Lab Server running on http://localhost:${PORT}`);
});
