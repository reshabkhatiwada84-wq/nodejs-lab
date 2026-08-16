const http = require("http");

const PORT = process.env.PORT || 3000;

// Student Data
const students = [
    { id: 23145001, name: "Aditya Soni", course: "BCA", hostel: "Panani Bhawan 1st Floor G Block Room No.1" },
    { id: 23145002, name: "Bhaskar Mall", course: "BCA", hostel: "Panani Bhawan 1st Floor G Block Room No.8" },
    { id: 23145003, name: "Ayush Ram Tripathi", course: "BCA", hostel: "Panani Bhawan 1st Floor J Block Room No.2" },
    { id: 23145004, name: "Yadev Singh Nishad", course: "BCA", hostel: "Panani Bhawan 1st Floor H Block Room No.1" },
    { id: 23145005, name: "Sayon Koley", course: "BCA", hostel: "Panani Bhawan 1st Floor H Block Room No.4" },
    { id: 23145006, name: "Rishabh Khatiwada", course: "BCA", hostel: "Panani Bhawan 1st Floor H Block Room No.8" },
    { id: 23145007, name: "Gauri", course: "BCA", hostel: "Nivadita Hostel" },
    { id: 23145008, name: "Kanak Sharma", course: "BCA", hostel: "Nivadita Hostel" },
    { id: 23145009, name: "Pragya Gupta", course: "BCA", hostel: "Nivadita Hostel" },
    { id: 23145010, name: "Shreya Singh", course: "BCA", hostel: "Nivadita Hostel" },
    { id: 23145011, name: "Shreya Kashyap", course: "BCA", hostel: "Nivadita Hostel" },
    { id: 23145012, name: "Mikki", course: "BCA", hostel: "Nivadita Hostel" }
];

// Helper function to send JSON responses
const sendJSON = (res, statusCode, data) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 4));
};

const server = http.createServer((req, res) => {
    console.log("Requested URL:", req.url);

    // Home Route
    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("Welcome to Student Directory Server");
    }

    // Route: /students
    if (req.url === "/students") {
        return sendJSON(res, 200, students);
    }

    // Dynamic Route (/students/:id or /:id)
    const isStudentsPath = req.url.startsWith("/students/");
    const isShortPath = /^\/\d+$/.test(req.url);

    if (isStudentsPath || isShortPath) {
        const idText = isStudentsPath ? req.url.split("/")[2] : req.url.substring(1);

        if (isNaN(idText)) {
            return sendJSON(res, 400, { error: "Student ID must be a number" });
        }

        const student = students.find(s => s.id === Number(idText));
        return student
            ? sendJSON(res, 200, student)
            : sendJSON(res, 404, { error: "Student not found" });
    }

    // Unknown Route
    sendJSON(res, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});